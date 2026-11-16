# -*- coding: utf-8 -*-
"""Каталог товарів для Meta (Facebook та Instagram): feed/facebook.csv + JPG-фото в assets/feed/.
Запуск з кореня репозиторію після будь-якої зміни товарів або цін:  python3 tools/make_feed.py
Meta забирає файл за адресою https://warmhome.in.ua/feed/facebook.csv за розкладом."""
import csv, hashlib, html, json, os, re, subprocess
from PIL import Image

SITE = 'https://warmhome.in.ua'
CATEGORY = {                                          # підкатегорія з products.js → категорія Google/Meta
    'sets': 'Home & Garden > Linens & Bedding > Bedding > Bed Sheets',
    'sheets': 'Home & Garden > Linens & Bedding > Bedding > Bed Sheets',
    'pillowcases': 'Home & Garden > Linens & Bedding > Bedding > Pillowcases & Shams',
    'plaids': 'Home & Garden > Linens & Bedding > Bedding > Blankets',
    'toys': 'Toys & Games > Toys > Dolls, Playsets & Toy Figures > Stuffed Animals',
    'blankets': 'Home & Garden > Linens & Bedding > Bedding > Quilts & Comforters',
    'divan': 'Home & Garden > Decor > Slipcovers',
    'rugs': 'Home & Garden > Decor > Rugs',
    'towels': 'Home & Garden > Linens & Bedding > Towels',
}
DEFAULT_CATEGORY = 'Home & Garden > Linens & Bedding > Bedding'
FIELDS = ['id', 'item_group_id', 'title', 'description', 'availability', 'condition', 'price', 'sale_price', 'link', 'image_link',
          'brand', 'google_product_category', 'product_type', 'custom_label_0']

P = json.loads(subprocess.run(['node', '-e', "global.window={};require('./assets/products.js');console.log(JSON.stringify(window.PRODUCTS))"],
                              capture_output=True, text=True, check=True).stdout)
os.makedirs('feed', exist_ok=True); os.makedirs('assets/feed', exist_ok=True)

def text(s): return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s))).strip()

def photo(p):
    """Головне фото товару у JPG 1024×1024 (Meta не завжди приймає WebP)."""
    img = p['image'].split('?')[0]                    # /assets/img/<name>-main-600.webp → велика версія <name>-main.webp
    src = img.lstrip('/').replace('-main-600.webp', '-main.webp')
    if not img.startswith('/assets/') or not os.path.exists(src):
        src = img.lstrip('/')
    out = 'assets/feed/%s.jpg' % p['slug']
    im = Image.open(src).convert('RGB'); im.thumbnail((1024, 1024), Image.LANCZOS); im.save(out, 'JPEG', quality=86, optimize=True)
    # версія = хеш вмісту фото: змінилося фото → змінилася адреса → Meta завантажує нове
    return '%s/%s?v=%s' % (SITE, out, hashlib.md5(open(out, 'rb').read()).hexdigest()[:10])

rows = []
for p in P:
    if not p.get('url'):
        continue                                      # без сторінки товару Meta не прийме позицію
    page = open('.' + p['url'] + 'index.html', encoding='utf-8').read()
    meta = re.search(r'<meta name="description" content="([^"]*)"', page)
    desc = text(meta.group(1)) if meta else p.get('short', '')
    desc += ' Відправка за 2–3 дні, доставка Новою Поштою, передоплата 200 грн, решта при отриманні.'
    img = photo(p)
    for v in p.get('variants') or [{'id': '', 'label': '', 'sku': p['sku'], 'price': p['price']}]:
        rows.append({
            'id': '%s-%s' % (v['sku'], v['id']) if v['id'] else p['sku'],   # той самий id, що в подіях пікселя
            'item_group_id': p['slug'],
            'title': ('%s, %s' % (p['name'], v['label'].lower()) if v['label'] else p['name'])[:150],
            'description': desc[:5000],
            'availability': 'out of stock' if v.get('out') or p.get('inStock') is False else 'in stock',
            'condition': 'new',
            'price': '%d UAH' % v['price'],
            'sale_price': '',
            'link': SITE + p['url'],
            'image_link': img,
            'brand': 'WarmHome UA',
            'google_product_category': next((CATEGORY[c] for c in (p.get('cat') or []) if c in CATEGORY), DEFAULT_CATEGORY),
            'product_type': ', '.join(p.get('cat') or []),
            'custom_label_0': '',
        })

with open('feed/facebook.csv', 'w', encoding='utf-8', newline='') as f:
    w = csv.DictWriter(f, fieldnames=FIELDS); w.writeheader(); w.writerows(rows)
print('товарів у каталозі:', len(rows))
