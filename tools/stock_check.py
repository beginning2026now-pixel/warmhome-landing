#!/usr/bin/env python3
"""Звіряє наявність товарів постачальників (Vanilla Textile, Arzy Shop) з їхніми таблицями.

Таблиця: https://docs.google.com/spreadsheets/d/1_McBnpFGO-onnVIqCCfoHM0M6DDMZn9N04jWY959XoQ (аркуш gid=1910900110)
Запуск із кореня репозиторію:
   python3 tools/stock_check.py --vanilla vanilla_rows.json --arzy arzy_rows.json
   (можна передати лише один файл — товари іншого постачальника не зміняться)
   Vanilla: аркуш «НАЯВНІСТЬ» (tools/stock_export.js); Arzy Shop: аркуші «ГОЛД», «САТИНИ/СТРАЙП» (tools/stock_export_arzy.js)
Пише tools/stock.json ({"sku|variantId": кількість}) і друкує, що змінилося.
Після цього: python3 tools/build_catalog.py && python3 tools/make_feed.py
"""
import csv, json, os, re, sys
from datetime import datetime, timezone, timedelta

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
C = json.load(open('tools/catalog.json', encoding='utf-8'))

# розділ таблиці -> (таблиця цін у catalog.json, {номер колонки: розмір})
BED = {2: '15', 3: '2', 4: 'e', 5: 's'}
SECTIONS = [
    (r'^варена бавовна з мереживом$', 'varena_lace', BED),
    (r'^варена бавовна$', 'varena', BED),
    (r'^страйп-сатин$', 'stripe', BED),
    (r'^сатин однотон+ий$', 'satin', BED),
    (r'^пледи флісові$', 'plaid', {3: '2', 4: 'e'}),
]


def norm(s):
    s = s.strip().lower().replace('c', 'с').replace('e', 'е').replace('i', 'і')  # латинські літери -> кирилиця
    return re.sub(r'\s+', ' ', s)


def qty(c):
    m = re.match(r'^\s*(\d+(?:[.,]\d+)?)', c or '')
    return float(m.group(1).replace(',', '.')) if m else 0.0


SUBHEADERS = {'нова бавовна', 'принт'}  # підрозділи всередині розділу «Варена бавовна»


def is_item(c):
    return bool(re.match(r'^\s*\d', c or ''))


def load_rows(path):
    if path.endswith('.json'):
        # компактний формат зі щоденної перевірки: [[колонка A, кількість C, D, E, F], ...]
        return [[str(r[0]), ''] + [str(x) for x in r[1:5]] + [''] * 8 for r in json.load(open(path, encoding='utf-8'))]
    return [r + [''] * 8 for r in csv.reader(open(path, encoding='utf-8'))]


def parse(path):
    rows = load_rows(path)
    found = {}   # (table, sku) -> {size: qty}
    seen = set()
    for i, r in enumerate(rows):
        h = norm(r[0])
        for pat, table, cols in SECTIONS:
            if table in seen or not re.match(pat, h):
                continue
            seen.add(table)
            j = i + 1
            while j < len(rows) and (not rows[j][0].strip() or is_item(rows[j][0]) or norm(rows[j][0]) in SUBHEADERS):
                rr = rows[j]
                if is_item(rr[0]):
                    sku = re.match(r'\s*(\d+)', rr[0]).group(1)
                    found.setdefault((table, sku), {})
                    for ci, size in cols.items():
                        found[(table, sku)][size] = found[(table, sku)].get(size, 0) + qty(rr[ci])
                j += 1
    return found, seen


def vkey(sku, table, size):
    return '%s|%s' % (sku, size + ('l' if table.endswith('_lace') else ''))


def products(sup):
    return [p for p in C['products'] if p.get('supplier', 'vanilla') == sup]


def check_vanilla(path, new, old, warn):
    found, seen = parse(path)
    missing = [t for _, t, _ in SECTIONS if t not in seen]
    if missing:
        warn.append('Vanilla: не знайдено розділи таблиці: %s (їхні товари не змінено)' % ', '.join(missing))
    for p in products('vanilla'):
        for sku, table, size in p['variants']:
            k = vkey(sku, table, size)
            if table in missing:
                new[k] = old.get(k, 1)
            elif (table, sku) not in found:
                warn.append('Vanilla: артикул %s не знайдено в таблиці (%s) — вважається відсутнім' % (k, p['slug']))
                new[k] = 0
            else:
                new[k] = found[(table, sku)].get(size, 0)
    return found


def check_arzy(path, new, old, warn):
    """Файл зі stock_export_arzy.js: [[аркуш, назва, 1.5, 2, євро, сімейний], ...]"""
    rows = json.load(open(path, encoding='utf-8'))
    sheets = {r[0] for r in rows if r[0].startswith('#')}
    found = {}
    for r in rows:
        if r[0].startswith('#'):
            continue
        k = (r[0], norm(r[1]))
        if k not in found:               # перший рядок із назвою — звичайний комплект (нижче йдуть «з пр 220/250»)
            found[k] = dict(zip(['15', '2', 'e', 's'], [float(x or 0) for x in r[2:6]]))
    for p in products('arzy'):
        src = p['src']
        k = (src['sheet'], norm(src['name']))
        for sku, table, size in p['variants']:
            vk = vkey(sku, table, size)
            if '#' + src['sheet'] not in sheets:
                new[vk] = old.get(vk, 1)
                warn.append('Arzy: аркуш «%s» не завантажено — %s не змінено' % (src['sheet'], p['slug']))
            elif k not in found:
                new[vk] = 0
                warn.append('Arzy: «%s» не знайдено на аркуші %s (%s) — вважається відсутнім' % (src['name'], src['sheet'], p['slug']))
            else:
                new[vk] = found[k].get(size, 0)


def arg(name):
    return sys.argv[sys.argv.index(name) + 1] if name in sys.argv else None


def main():
    if '--skus' in sys.argv:          # артикули Vanilla для stock_export.js
        print(','.join(sorted({s for p in products('vanilla') for s, _, _ in p['variants']})))
        return
    if '--names' in sys.argv:         # назви Arzy для stock_export_arzy.js
        print(json.dumps(sorted({(p['src']['sheet'], p['src']['name']) for p in products('arzy')}), ensure_ascii=False))
        return
    van = arg('--vanilla')
    if not van and len(sys.argv) > 1 and not sys.argv[1].startswith('--'):
        van = sys.argv[1]
    arz = arg('--arzy')
    old = {}
    if os.path.exists('tools/stock.json'):
        old = json.load(open('tools/stock.json', encoding='utf-8')).get('variants', {})
    new, warn = {}, []
    for p in C['products']:                       # постачальник без свіжого файлу — лишаємо як було
        for sku, table, size in p['variants']:
            k = vkey(sku, table, size)
            new[k] = old.get(k, 1)
    found = check_vanilla(van, new, old, warn) if van else {}
    if arz:
        check_arzy(arz, new, old, warn)
    name = {}
    for p in C['products']:
        sup = C['suppliers'][p.get('supplier', 'vanilla')]['name']
        for sku, table, size in p['variants']:
            k = vkey(sku, table, size)
            name[k] = '%s — %s%s [%s]' % (p['slug'], C['sizes'][size], ' з мереживом' if k.endswith('l') else '', sup)
    gone = [name[k] for k in new if new[k] < 1 and old.get(k, 1) >= 1]
    back = [name[k] for k in new if new[k] >= 1 and k in old and old[k] < 1]
    now = datetime.now(timezone(timedelta(hours=2))).strftime('%Y-%m-%d %H:%M')
    json.dump({'checked': now, 'variants': new}, open('tools/stock.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    inst = sum(1 for q in new.values() if q >= 1)
    print('Перевірено %s (%s): у наявності %d з %d варіантів' % (now, ', '.join(x for x, f in [('Vanilla', van), ('Arzy', arz)] if f), inst, len(new)))
    for w in warn: print('УВАГА:', w)
    if gone: print('Закінчилися:\n  ' + '\n  '.join(gone))
    if back: print('Знову в наявності:\n  ' + '\n  '.join(back))
    if '--extra' in sys.argv and found:
        known = {(t, s) for p in products('vanilla') for s, t, _ in p['variants']}
        extra = sorted('%s %s' % (t, s) for (t, s), v in found.items() if (t, s) not in known and any(q >= 1 for q in v.values()))
        print('Vanilla: є в наявності, але не на сайті:\n  ' + '\n  '.join(extra))
    if not (gone or back): print('Змін у наявності немає.')


if __name__ == '__main__':
    main()
