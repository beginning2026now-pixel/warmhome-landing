#!/usr/bin/env python3
"""Звіряє наявність товарів Vanilla Textile з аркушем «НАЯВНІСТЬ» таблиці постачальника.

Таблиця: https://docs.google.com/spreadsheets/d/1_McBnpFGO-onnVIqCCfoHM0M6DDMZn9N04jWY959XoQ (аркуш gid=1910900110)
Запуск із кореня репозиторію:  python3 tools/stock_check.py <НАЯВНІСТЬ.csv> [--extra]
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


def parse(path):
    rows = [r + [''] * 8 for r in csv.reader(open(path, encoding='utf-8'))]
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


def main():
    found, seen = parse(sys.argv[1])
    missing_sec = [t for _, t, _ in SECTIONS if t not in seen]
    old = {}
    if os.path.exists('tools/stock.json'):
        old = json.load(open('tools/stock.json', encoding='utf-8')).get('variants', {})
    new, notfound = {}, []
    for p in C['products']:
        for sku, table, size in p['variants']:
            vid = size + ('l' if table.endswith('_lace') else '')
            key = '%s|%s' % (sku, vid)
            if (table, sku) not in found:
                notfound.append('%s (%s)' % (key, p['slug']))
            new[key] = found.get((table, sku), {}).get(size, 0)
    # якщо розділ не знайдено (таблицю перебудували) — не чіпаємо його товари, щоб не сховати все помилково
    if missing_sec:
        for p in C['products']:
            for sku, table, size in p['variants']:
                if table in missing_sec:
                    vid = size + ('l' if table.endswith('_lace') else '')
                    k = '%s|%s' % (sku, vid)
                    new[k] = old.get(k, 1)
    name = {}
    for p in C['products']:
        for sku, table, size in p['variants']:
            vid = size + ('l' if table.endswith('_lace') else '')
            name['%s|%s' % (sku, vid)] = '%s — %s%s' % (p['slug'], C['sizes'][size], ' з мереживом' if vid.endswith('l') else '')
    gone = [name[k] for k in new if new[k] < 1 and old.get(k, 1) >= 1]
    back = [name[k] for k in new if new[k] >= 1 and k in old and old[k] < 1]
    known = {(t, s) for p in C['products'] for s, t, _ in p['variants']}
    extra = sorted('%s %s: %s' % (t, s, ', '.join('%s=%g' % (C['sizes'].get(z, z), q) for z, q in v.items() if q >= 1))
                   for (t, s), v in found.items() if (t, s) not in known and any(q >= 1 for q in v.values()))
    now = datetime.now(timezone(timedelta(hours=2))).strftime('%Y-%m-%d %H:%M')
    json.dump({'checked': now, 'variants': new}, open('tools/stock.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    inst = sum(1 for q in new.values() if q >= 1)
    print('Перевірено %s: у наявності %d з %d варіантів' % (now, inst, len(new)))
    if missing_sec: print('УВАГА: не знайдено розділи таблиці:', ', '.join(missing_sec), '(їхні товари не змінено)')
    if gone: print('Закінчилися:\n  ' + '\n  '.join(gone))
    if back: print('Знову в наявності:\n  ' + '\n  '.join(back))
    if notfound: print('Артикул не знайдено в таблиці (вважається відсутнім):\n  ' + '\n  '.join(notfound))
    if extra and '--extra' in sys.argv: print('Є в наявності, але не на сайті (для інформації):\n  ' + '\n  '.join(extra))
    if not (gone or back): print('Змін у наявності немає.')


if __name__ == '__main__':
    main()
