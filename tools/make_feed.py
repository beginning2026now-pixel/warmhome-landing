# -*- coding: utf-8 -*-
"""Каталог товарів для Meta (Facebook та Instagram): feed/facebook.csv + JPG-фото в assets/feed/.
Запуск з кореня репозиторію після будь-якої зміни товарів або цін:  python3 tools/make_feed.py
Meta забирає файл за адресою https://warmhome.in.ua/feed/facebook.csv за розкладом."""
import csv, hashlib, html, json, os, re, subprocess
from PIL import Image

SITE = 'https://warmhome.in.ua'
HEATERS = 'Home & Garden > Household Appliances > Climate Control Appliances > Space Heaters'
SCARF = 'Apparel & Accessories > Clothing Accessories > Scarves & Shawls'
SHOES = 'Home & Garden > Household Supplies > Shoe Care & Tools > Shoe Dryers'
WATER = 'Home & Garden > Household Appliances > Water Heaters'
KITCHEN = 'Home & Garden > Kitchen & Dining > Kitchen Appliances > Coffee Makers & Espresso Machines > Stovetop Espresso Pots'
THERMOS = 'Home & Garden > Kitchen & Dining > Food & Beverage Carriers > Thermoses'
SLEEPING = 'Sporting Goods > Outdoor Recreation > Camping & Hiking > Sleeping Bags'

P = json.loads(subprocess.run(['node', '-e', "global.window={};require('./assets/products.js');console.log(JSON.stringify(window.PRODUCTS))"],
                              capture_output=True, text=True, check=True).stdout)
os.makedirs('feed', exist_ok=True); os.makedirs('assets/feed', exist_ok=True)

def text(s): return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s))).strip()

def photo(p):
    """Головне фото товару у JPG 1024×1024 (Meta не завжди приймає WebP)."""
    img = p['image'].split('?')[0]                    # /assets/img/<name>-main-600.webp → велика версія <name>-main.webp
    src = img.lstrip('/').replace('-main-600.webp', '-main.webp')
    if not img.startswith('/assets/') or not os.path.exists(src):
        src = 'assets/img/kamin-900-light.webp'       # обігрівач з ефектом каміна: локально є лише світла версія
    out = 'assets/feed/%s.jpg' % p['slug']
    Image.open(src).convert('RGB').resize((1024, 1024), Image.LANCZOS).save(out, 'JPEG', quality=86, optimize=True)
    # версія = хеш вмісту фото: змінилося фото → змінилася адреса → Meta завантажує нове
    return '%s/%s?v=%s' % (SITE, out, hashlib.md5(open(out, 'rb').read()).hexdigest()[:10])

rows = []
for p in P:
    if p.get('inStock') is False or not p.get('url'):
        continue                                      # без сторінки товару Meta не прийме позицію
    page = open('.' + p['url'] + 'index.html', encoding='utf-8').read()
    lead = re.search(r'<p class="mt-4 text-base sm:text-lg text-slate-600">(.*?)</p>', page, re.S)
    ul = re.search(r'<ul class="mt-6 space-y-3">(.*?)</ul>', page, re.S)
    bullets = [text(li) for li in re.findall(r'<li[^>]*>(.*?)</li>', ul.group(1), re.S)] if ul else []
    desc = ' '.join([text(lead.group(1)) if lead else p['short']] + bullets)
    desc += ' Доставка Новою Поштою 1–3 дні, оплата при отриманні, обмін та повернення 14 днів.'
    old = p.get('oldPrice')
    rows.append({
        'id': p['sku'],                               # той самий артикул, що й у подіях пікселя (content_ids)
        'title': p['name'][:150],
        'description': desc[:5000],
        'availability': 'in stock',
        'condition': 'new',
        'price': '%d UAH' % (old if old and old > p['price'] else p['price']),
        'sale_price': '%d UAH' % p['price'] if old and old > p['price'] else '',
        'link': SITE + p['url'],
        'image_link': photo(p),
        'brand': 'WarmHome UA',
        'google_product_category': SCARF if 'scarf' in (p.get('cat') or []) else SHOES if 'shoes' in (p.get('cat') or []) else WATER if 'water' in (p.get('cat') or []) else KITCHEN if 'coffee' in (p.get('cat') or []) else THERMOS if 'thermos' in (p.get('cat') or []) else SLEEPING if 'sleeping' in (p.get('cat') or []) else HEATERS,
        'product_type': ', '.join(p.get('cat') or []),
        'custom_label_0': 'Закінчується' if p.get('ending') else '',
    })

with open('feed/facebook.csv', 'w', encoding='utf-8', newline='') as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
print('товарів у каталозі:', len(rows))
