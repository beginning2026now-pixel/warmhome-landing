#!/usr/bin/env python3
"""Будує каталог WarmHome UA з tools/catalog.json:
   - assets/products.js (список товарів із розмірами й цінами)
   - products/<slug>/index.html (сторінки товарів)
   - фото: assets/img/p/<slug>-N.jpg (якщо передано --photos <папка>, бере звідти <img>_N.*)

Ціна продажу = дроп-ціна постачальника + markup, округлено вгору до сотні.
Запуск із кореня репозиторію:  python3 tools/build_catalog.py [--photos DIR]
"""
import json, math, os, sys, html, re, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
C = json.load(open('tools/catalog.json', encoding='utf-8'))
# наявність із tools/stock.json (оновлює tools/stock_check.py); немає файлу — усе в наявності
STOCK = json.load(open('tools/stock.json', encoding='utf-8'))['variants'] if os.path.exists('tools/stock.json') else {}
E = html.escape
SITE = 'https://warmhome.in.ua'
PREPAY = 200
ADDED = '2026-11-16T19:00'

NAME = {
    'varena': 'Комплект із вареної бавовни · {c}',
    'stripe': 'Комплект зі страйп-сатину · {c}',
    'satin': 'Комплект з однотонного сатину · {c}',
    'plaid': 'Флісовий плед · {c}',
    'gold': 'Комплект з бязі Gold · {c}',
    'stripe_a': 'Комплект зі страйп-сатину · {c}',
    'toy': 'Іграшка-плед «Ведмедик» · {c}',
    'teddy': 'Плед-покривало «Тедді» · {c}',
    'sharpei': 'Плед-покривало «Королівський шарпей» · {c}',
    'ovchyna': 'Плед з еко-овчини · {c}',
    'luxe': 'Комплект з бязі Gold Lux · {c}',
    'flannel': 'Комплект з байки · {c}',
    'stripe_r': 'Страйп-сатин з простирадлом на резинці · {c}',
    'velour': 'Велюровий комплект «Шарпей» · {c}',
    'velour_m': 'Велюровий комплект «Моніка» · {c}',
}
CAT = {'varena': 'sets', 'stripe': 'sets', 'satin': 'sets', 'plaid': 'plaids', 'gold': 'sets', 'stripe_a': 'sets',
       'teddy': 'plaids', 'sharpei': 'plaids', 'ovchyna': 'plaids', 'toy': 'toys',
       'luxe': 'sets', 'flannel': 'sets', 'stripe_r': 'sets', 'velour': 'sets', 'velour_m': 'sets'}
DEPT = {'sets': ('Постільна білизна', 'bedding'), 'plaids': ('Пледи', 'plaids'), 'toys': ('Іграшки з пледом', 'toys')}
SIZE_ORDER = ['15', '2', 'e', 's', 't70']


def sell(drop):
    return int(math.ceil((drop + C['markup']) / 100.0) * 100)


def photos(p, src):
    os.makedirs('assets/img/p', exist_ok=True)
    out = []
    if src:
        from PIL import Image
        files = sorted(glob.glob(os.path.join(src, p['img'] + '_*')))
        main = p.get('main', 0)
        files = sorted(files, key=lambda f: (int(re.search(r'_(\d+)\.', f).group(1)) != main, f))
        files = files[:p.get('maxphotos', 4)]
        for i, f in enumerate(files, 1):
            im = Image.open(f).convert('RGB')
            im.thumbnail((1000, 1000))
            dst = 'assets/img/p/%s-%d.jpg' % (p['slug'], i)
            im.save(dst, quality=86, optimize=True, progressive=True)
    for i in range(1, 10):
        f = 'assets/img/p/%s-%d.jpg' % (p['slug'], i)
        if os.path.exists(f):
            out.append('/' + f)
    return out


def thumb(img):
    """Мініатюра 480px WebP для карток (у ~4 рази легша за основне фото)."""
    from PIL import Image
    src = img.lstrip('/')
    dst = 'assets/img/t/' + os.path.basename(src).rsplit('.', 1)[0] + '.webp'
    os.makedirs('assets/img/t', exist_ok=True)
    if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src):
        im = Image.open(src).convert('RGB')
        w, h = im.size
        k = min(w, h)
        im = im.crop(((w - k) // 2, (h - k) // 2, (w + k) // 2, (h + k) // 2)).resize((480, 480), Image.LANCZOS)
        im.save(dst, 'WEBP', quality=78, method=6)
    return '/' + dst


def live(vs):
    return [v for v in vs if not v.get('out')]


def variants(p):
    vs = []
    for sku, table, size in p['variants']:
        drop = C['prices'][table][size]
        lace = table.endswith('_lace')
        label = C['sizes'][size] + (' з мереживом' if lace else '')
        vid = size + ('l' if lace else '')
        v = {'id': vid, 'size': size, 'label': label, 'sku': sku, 'price': sell(drop)}
        if STOCK.get('%s|%s' % (sku, vid), 1) < 1:
            v['out'] = True
        vs.append(v)
    vs.sort(key=lambda v: (SIZE_ORDER.index(v['size']), v['id'].endswith('l')))
    return vs


ICON = {
    'truck': '<path d="M3 6h11v10H3zM14 9h4l3 3.5V16h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    'wallet': '<path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3"/><path d="M4 7.5V17a2 2 0 0 0 2 2h14V9H6.5A2.5 2.5 0 0 1 4 7.5Z"/><circle cx="16" cy="14" r="1"/>',
    'eye': '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.8"/>',
}


def ico(n):
    return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">%s</svg>' % ICON[n]


def page(p, prod, imgs, related):
    f = C['fabrics'][p['fabric']]
    name = prod['name']
    vs = prod['variants']
    minp = min(v['price'] for v in (live(vs) or vs))
    bedding = CAT[p['fabric']] == 'sets'
    toy = CAT[p['fabric']] == 'toys'
    dept = DEPT[CAT[p['fabric']]]
    dname = ('Флісовий плед «%s»' % p['color']) if p['fabric'] == 'plaid' else name.replace(' · ', ', колір: ').replace(p['color'], p['color'].lower())
    desc = '%s. %s Ціна від %d грн. Доставка Новою Поштою.' % (dname, f['lead'], minp)
    specs = list(f['props']) + [['Колір', p['color']], ['Артикул', ', '.join(sorted(set(v['sku'] for v in vs)))]]
    dims = []
    for s in SIZE_ORDER:
        if any(v['size'] == s for v in vs) and s in f['dims']:
            dims.append([C['sizes'][s], f['dims'][s]])
    lace = f.get('lace_note') if any(v['id'].endswith('l') for v in vs) else None
    gal_th = ''.join('<button type="button" data-src="%s" aria-current="%s"><img src="%s" alt="" loading="lazy"></button>' % (E(u), 'true' if i == 0 else 'false', E(u)) for i, u in enumerate(imgs)) if len(imgs) > 1 else ''
    rel = ''.join('<a class="card" href="%s"><img src="%s" alt="%s" width="480" height="480" loading="lazy"><span class="b"><span class="n">%s</span><span class="pr">від %s грн</span></span></a>' % (E(r['url']), E(r['thumb']), E(r['name']), E(r['name']), money(r['price'])) for r in related)
    return TPL.format(
        title=E(name), desc=E(desc), url=SITE + prod['url'], og=SITE + imgs[0],
        ld=ld_product(prod, desc) + ld_crumbs([('Головна', '/'), (dept[0], '/catalog/%s/' % dept[1]), (name, prod['url'])]),
        dept=dept[0], deptid=dept[1], fabric=E(f['title']), name=E(name), lead=E(f['lead']), about=E(f['about']),
        main=E(imgs[0]), thumbs=gal_th, slug=p['slug'], minp=minp,
        opt_label='Розмір комплекту' if bedding else 'Розмір',
        pillow_block=pillow_block(f) if bedding else '',
        specs=''.join('<tr><td>%s</td><td>%s</td></tr>' % (E(a), E(b)) for a, b in specs),
        dims=''.join('<tr><td>%s</td><td>%s</td></tr>' % (E(a), E(b)) for a, b in dims),
        lace=('<p>%s</p>' % E(lace)) if lace else '',
        related=rel, prepay=PREPAY,
        returns=('Якщо іграшка має брак або не відповідає опису — обміняємо чи повернемо гроші. Іграшку належної якості можна повернути протягом 14 днів, якщо збережено товарний вигляд і упаковку.' if toy else 'Постільна білизна належної якості за законом обміну та поверненню не підлягає, тому уважно оглядайте комплект у відділенні до оплати. Якщо знайдете брак або невідповідність розміру чи кольору — обміняємо.' if bedding else 'Якщо плед має брак або не відповідає опису — обміняємо чи повернемо гроші. Плед належної якості можна повернути протягом 14 днів, якщо збережено товарний вигляд і упаковку.'),
        head=HEADER, foot=FOOTER, icons=SPRITE,
        i_truck=ico('truck'), i_wallet=ico('wallet'), i_eye=ico('eye'),
        content_id='%s-%s' % ((live(vs) or vs)[0]['sku'], (live(vs) or vs)[0]['id']),
    )


def pillow_block(f):
    opts = f.get('pillows', ['70×70', '50×70'])
    if not opts:
        return ''
    btns = ''.join('<button type="button" data-p="%s" aria-pressed="%s">%s см</button>' % (o, 'true' if i == 0 else 'false', o) for i, o in enumerate(opts))
    return '<div class="opt-l">Наволочки</div>\n          <div class="opts" id="pillow">%s</div>' % btns


PILLOW = '''<div class="opt-l">Наволочки</div>
          <div class="opts" id="pillow"><button type="button" data-p="70×70" aria-pressed="true">70×70 см</button><button type="button" data-p="50×70" aria-pressed="false">50×70 см</button></div>'''

SPRITE = '''<svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <symbol id="i-phone" viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></symbol>
    <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10"/></symbol>
    <symbol id="i-bag" viewBox="0 0 24 24"><path d="M6 8h12l-1 12H7Z"/><path d="M9 8a3 3 0 0 1 6 0"/></symbol>
    <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
  </svg>'''

LOGO = '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="{bg}"/><path d="M13 22.5 24 13l11 9.5V34a1.5 1.5 0 0 1-1.5 1.5h-19A1.5 1.5 0 0 1 13 34Z" fill="none" stroke="#8B6B55" stroke-width="2.4" stroke-linejoin="round"/><path d="M24 31.5s-5-3-5-6.6a2.7 2.7 0 0 1 5-1.5 2.7 2.7 0 0 1 5 1.5c0 3.6-5 6.6-5 6.6Z" fill="#C9A88A"/></svg>'

HEADER = '''<div class="topbar">Відправка за 2–3 дні · Передоплата 200 грн, решта при отриманні</div>
  <header class="head">
    <div class="wrap">
      <a href="/" class="brand" aria-label="WarmHome UA — на головну">
        %s
        <span>WarmHome <em>UA</em></span>
      </a>
      <nav class="nav" aria-label="Розділи">
        <a href="/catalog/bedding/">Постільна білизна</a>
        <a href="/catalog/plaids/">Пледи</a>
        <a href="/catalog/toys/">Іграшки</a>
        <a href="/#how">Доставка</a>
      </nav>
      <div class="head-r">
        <a class="phone" href="tel:+380990227684"><svg class="ico"><use href="#i-phone"/></svg>+38 (099) 022-76-84</a>
        <button type="button" class="cart-btn js-cart-open" aria-label="Кошик"><svg class="ico"><use href="#i-bag"/></svg><span class="n js-cart-count" hidden>0</span></button>
        <button class="burger" id="burger" aria-label="Меню" aria-expanded="false" aria-controls="mnav"><svg class="ico" style="width:24px;height:24px"><use href="#i-menu"/></svg></button>
      </div>
    </div>
    <nav class="mnav" id="mnav" aria-label="Меню">
      <a href="/catalog/bedding/">Постільна білизна</a>
      <a href="/catalog/plaids/">Пледи</a>
      <a href="/catalog/toys/">Іграшки з пледом</a>
      <a href="/#how">Доставка та оплата</a>
      <a href="/#faq">Часті питання</a>
      <a href="tel:+380990227684">+38 (099) 022-76-84</a>
    </nav>
  </header>''' % LOGO.format(bg='#EDE1D2')

FOOTER = '''<footer class="foot">
    <div class="wrap">
      <div class="cols">
        <div>
          <a href="/" class="brand" aria-label="WarmHome UA">%s<span>WarmHome <em>UA</em></span></a>
          <p style="margin-top:12px;max-width:22em">Постільна білизна та пледи для затишного дому.</p>
        </div>
        <div>
          <h4>Контакти</h4>
          <p><a href="tel:+380990227684" style="font-weight:700;text-decoration:none">+38 (099) 022-76-84</a></p>
          <p style="margin-top:6px">Пн–Нд: 09:00–21:00</p>
          <p>Заявки на сайті — цілодобово</p>
        </div>
        <div class="links">
          <h4>Покупцям</h4>
          <a href="/#how">Доставка та оплата</a>
          <a href="/#faq">Часті запитання</a>
          <a href="/#privacy">Політика конфіденційності</a>
          <a href="/#returns">Умови повернення та обміну</a>
        </div>
      </div>
      <div class="fine">
        <span>© 2026 WarmHome UA</span>
        <span>Колір виробу на фото може трохи відрізнятися від реального</span>
      </div>
    </div>
  </footer>''' % LOGO.format(bg='#FFFBF6')

TPL = open(os.path.join(ROOT, 'tools', 'product_template.html'), encoding='utf-8').read()
CTPL = open(os.path.join(ROOT, 'tools', 'category_template.html'), encoding='utf-8').read()

# Сторінки категорій: /catalog/<id>/
CATEGORIES = [
    {'id': 'bedding', 'cat': 'sets', 'name': 'Постільна білизна',
     'text': 'Бавовна, сатин, теплі байка й велюр — від півтораспальних до сімейних комплектів.',
     'art': '<svg viewBox="0 0 400 300"><ellipse cx="200" cy="272" rx="160" ry="10" fill="#D9C7B1" opacity=".6"/>'
            '<rect x="70" y="190" width="260" height="74" rx="22" fill="#C9A88A"/><path d="M92 228h216" stroke="#B9977A" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/>'
            '<rect x="80" y="122" width="240" height="72" rx="22" fill="#FFFBF6"/><path d="M104 144h192M104 158h192M104 172h192" stroke="#EADBC9" stroke-width="3" stroke-linecap="round"/>'
            '<rect x="92" y="56" width="216" height="70" rx="22" fill="#EBCFC0"/><path d="M120 72c9 7 9 31 0 38M150 72c9 7 9 31 0 38M180 72c9 7 9 31 0 38M210 72c9 7 9 31 0 38M240 72c9 7 9 31 0 38" fill="none" stroke="#DDB9A7" stroke-width="3" stroke-linecap="round"/>'
            '<rect x="262" y="56" width="18" height="208" fill="#8B6B55" opacity=".85"/></svg>'},
    {'id': 'plaids', 'cat': 'plaids', 'name': 'Пледи',
     'text': 'Флісові, плюшеві та двосторонні пледи-покривала для ліжка й дивана.',
     'art': '<svg viewBox="0 0 400 300"><ellipse cx="200" cy="272" rx="160" ry="10" fill="#D9C7B1" opacity=".6"/>'
            '<rect x="60" y="150" width="280" height="104" rx="28" fill="#FFFBF6"/><path d="M92 150v104M124 150v104M156 150v104M188 150v104M220 150v104M252 150v104M284 150v104M316 150v104M60 186h280M60 220h280" stroke="#F0DFD5" stroke-width="6"/>'
            '<path d="M74 254v12M90 254v12M106 254v12M122 254v12M138 254v12M154 254v12M170 254v12M186 254v12M202 254v12M218 254v12M234 254v12M250 254v12M266 254v12M282 254v12M298 254v12M314 254v12M330 254v12" stroke="#D8B3A0" stroke-width="3" stroke-linecap="round"/>'
            '<rect x="96" y="70" width="208" height="86" rx="43" fill="#C9A88A"/><circle cx="139" cy="113" r="30" fill="#D8BCA2"/><circle cx="139" cy="113" r="16" fill="#C9A88A"/><circle cx="139" cy="113" r="5" fill="#B9977A"/></svg>'},
    {'id': 'toys', 'cat': 'toys', 'name': 'Іграшки з пледом',
     'text': 'Мʼякі ведмедики, усередині яких захований теплий плед 100×150 см.',
     'art': '<svg viewBox="0 0 400 300"><ellipse cx="200" cy="276" rx="150" ry="10" fill="#D9C7B1" opacity=".6"/>'
            '<circle cx="146" cy="70" r="28" fill="#C9A88A"/><circle cx="146" cy="70" r="14" fill="#E3D3BF"/><circle cx="254" cy="70" r="28" fill="#C9A88A"/><circle cx="254" cy="70" r="14" fill="#E3D3BF"/>'
            '<ellipse cx="200" cy="208" rx="92" ry="72" fill="#C9A88A"/><circle cx="200" cy="112" r="66" fill="#D2B193"/>'
            '<ellipse cx="200" cy="132" rx="28" ry="21" fill="#EADBC9"/><ellipse cx="200" cy="124" rx="9" ry="7" fill="#6F5241"/><path d="M200 131v8M191 141c5 4 13 4 18 0" fill="none" stroke="#6F5241" stroke-width="3" stroke-linecap="round"/>'
            '<circle cx="176" cy="100" r="6" fill="#6F5241"/><circle cx="224" cy="100" r="6" fill="#6F5241"/>'
            '<path d="M128 196h144v70a14 14 0 0 1-14 14H142a14 14 0 0 1-14-14Z" fill="#FFFBF6"/><path d="M152 196v84M176 196v84M200 196v84M224 196v84M248 196v84M128 224h144M128 252h144" stroke="#F0DFD5" stroke-width="5"/>'
            '<ellipse cx="116" cy="214" rx="22" ry="30" fill="#D2B193"/><ellipse cx="284" cy="214" rx="22" ry="30" fill="#D2B193"/></svg>'},
]


SHORT = {'15': '1,5-сп', '2': '2-сп', 'e': 'Євро', 's': 'Сімейний', 't70': '70 см'}


def sizes_line(vs):
    lv = live(vs) or vs
    out = []
    for z in SIZE_ORDER:
        if any(v['size'] == z for v in lv):
            out.append(SHORT[z])
    if any(v['id'].endswith('l') for v in lv):
        out.append('є з мереживом')
    return ' · '.join(out)


def money(n):
    return '{:,}'.format(n).replace(',', '\u00a0')


def word(n):
    return 'товар' if n % 10 == 1 and n % 100 != 11 else 'товари' if 2 <= n % 10 <= 4 and not 12 <= n % 100 <= 14 else 'товарів'


def card(r):
    many = len([v for v in r['variants'] if not v.get('out')]) > 1
    sizes = ' '.join(sorted({v['size'] for v in r['variants'] if not v.get('out')}))
    return ('<a class="card" href="%s" data-f="%s" data-s="' + sizes + '" data-p="' + str(r['price']) + '" data-n="' + r['added'] + '"><img src="%s" alt="%s" width="480" height="480" loading="lazy"><span class="b"><span class="n">%s</span>'
            '<span style="font-size:13px;color:var(--muted)">%s</span><span class="pr">%s%s грн</span></span></a>') % (
        E(r['url']), E(r['short']), E(r['thumb']), E(r['name']), E(r['name']), E(r['sizes']),
        'від ' if many else '', '{:,}'.format(r['price']).replace(',', '\u00a0'))


def ld(obj):
    return '<script type="application/ld+json">%s</script>' % json.dumps(obj, ensure_ascii=False).replace('</', '<\\/')


def ld_crumbs(items):
    return ld({'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': i, 'name': n, 'item': SITE + u} for i, (n, u) in enumerate(items, 1)]})


def ld_product(prod, desc):
    lv = live(prod['variants'])
    prices = [v['price'] for v in (lv or prod['variants'])]
    return ld({'@context': 'https://schema.org', '@type': 'Product', 'name': prod['name'], 'sku': prod['sku'],
               'image': [SITE + i for i in prod['images']], 'description': desc, 'brand': {'@type': 'Brand', 'name': 'WarmHome UA'},
               'offers': {'@type': 'AggregateOffer', 'priceCurrency': 'UAH', 'lowPrice': min(prices), 'highPrice': max(prices),
                          'offerCount': len(lv or prod['variants']), 'url': SITE + prod['url'],
                          'availability': 'https://schema.org/' + ('InStock' if lv else 'OutOfStock')}})


def sitemap(prods):
    urls = ['/'] + ['/catalog/%s/' % c['id'] for c in CATEGORIES] + [r['url'] for r in prods if r['inStock']]
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    xml += ''.join('  <url><loc>%s%s</loc></url>\n' % (SITE, u) for u in urls) + '</urlset>\n'
    open('sitemap.xml', 'w', encoding='utf-8').write(xml)
    open('robots.txt', 'w', encoding='utf-8').write('User-agent: *\nAllow: /\nDisallow: /feed/\n\nSitemap: %s/sitemap.xml\n' % SITE)


def category_pages(prods):
    for c in CATEGORIES:
        items = [r for r in prods if c['cat'] in r['cat'] and r['inStock']]
        fabs = []                                   # фільтр за назвою тканини (страйп-сатин двох постачальників — одна кнопка)
        for r in items:
            if r['short'] not in fabs:
                fabs.append(r['short'])
        chips = ''
        if len(fabs) > 1:
            chips = '<div class="chips" id="chips"><button type="button" data-f="" aria-pressed="true">Усі</button>%s</div>' % ''.join(
                '<button type="button" data-f="%s" aria-pressed="false">%s</button>' % (E(f), E(f)) for f in fabs)
        sz = [z for z in SIZE_ORDER if any(v['size'] == z and not v.get('out') for r in items for v in r['variants'])]
        tools_ = ''
        if len(sz) > 1:
            tools_ += '<div class="ctl"><span>Розмір</span><div class="chips" id="szs"><button type="button" data-s="" aria-pressed="true">Будь-який</button>%s</div></div>' % ''.join(
                '<button type="button" data-s="%s" aria-pressed="false">%s</button>' % (z, E(C['sizes'][z])) for z in sz)
        if len(items) > 3:
            tools_ += ('<label class="sort"><span>Сортувати</span><select id="sort"><option value="">Спочатку популярні</option>'
                       '<option value="new">Спочатку нові</option><option value="asc">Дешевші</option><option value="desc">Дорожчі</option></select></label>')
        cnav = ''.join('<a href="/catalog/%s/"%s>%s</a>' % (x['id'], ' aria-current="page"' if x is c else '', E(x['name'])) for x in CATEGORIES)
        html_ = CTPL.format(
            id=c['id'], name=E(c['name']), text=E(c['text']), desc=E(c['name'] + ' — ' + c['text'] + ' Доставка Новою Поштою, передоплата 200 грн.'),
            url='%s/catalog/%s/' % (SITE, c['id']), og=SITE + (items[0]['image'] if items else '/assets/logo/og.png'),
            count=('%d %s' % (len(items), word(len(items)))) if items else 'Скоро в наявності',
            art=c['art'], cnav=cnav, chips=chips, tools=tools_, ld=ld_crumbs([('Головна', '/'), (c['name'], '/catalog/%s/' % c['id'])]),
            cards=''.join(card(r) for r in items) or '<div class="empty"><b>Скоро тут зʼявляться товари</b>Зазирніть трохи пізніше.</div>',
            icons=SPRITE, head=HEADER, foot=FOOTER)
        os.makedirs('catalog/' + c['id'], exist_ok=True)
        open('catalog/%s/index.html' % c['id'], 'w', encoding='utf-8').write(html_)


def main():
    src = sys.argv[sys.argv.index('--photos') + 1] if '--photos' in sys.argv else None
    prods = []
    for p in C['products']:
        imgs = photos(p, src)
        assert imgs, 'немає фото для ' + p['slug']
        vs = variants(p)
        prods.append({
            'slug': p['slug'], 'sku': vs[0]['sku'], 'name': NAME[p['fabric']].format(c=p['color']),
            'short': C['fabrics'][p['fabric']]['title'], 'fabric': p['fabric'],
            'price': min(v['price'] for v in (live(vs) or vs)), 'oldPrice': None, 'inStock': bool(live(vs)),
            'image': imgs[0], 'thumb': thumb(imgs[0]), 'images': imgs, 'url': '/products/%s/' % p['slug'],
            'cat': [CAT[p['fabric']]], 'added': p.get('added', ADDED), 'variants': vs,
            'sup': C['suppliers'][p['supplier']]['code'], 'sizes': sizes_line(vs),
        })
    for p, prod in zip(C['products'], prods):
        same = [r for r in prods if r['fabric'] == prod['fabric'] and r is not prod and r['inStock']]
        other = [r for r in prods if r['fabric'] != prod['fabric'] and r['inStock']]
        related = (same + other)[:4]
        os.makedirs('products/' + p['slug'], exist_ok=True)
        open('products/%s/index.html' % p['slug'], 'w', encoding='utf-8').write(page(p, prod, prod['images'], related))
    category_pages(prods)
    sitemap(prods)
    # assets/products.js — лише блок PRODUCTS, решта файлу без змін
    js = open('assets/products.js', encoding='utf-8').read()
    body = json.dumps(prods, ensure_ascii=False, indent=1)
    js = re.sub(r'window\.PRODUCTS = \[.*?\n\];', lambda m: 'window.PRODUCTS = ' + body + ';', js, count=1, flags=re.S)
    open('assets/products.js', 'w', encoding='utf-8').write(js)
    print('товарів:', len(prods))
    for r in prods:
        print(' ', r['slug'], ', '.join('%s %d%s' % (v['label'], v['price'], ' (немає)' if v.get('out') else '') for v in r['variants']))


if __name__ == '__main__':
    main()
