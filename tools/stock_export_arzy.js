// Наявність Arzy Shop. Запускати в браузері на вкладці docs.google.com (будь-яка сторінка Google Таблиць).
// NAMES_HERE замінити на вивід  python3 tools/stock_check.py --names  (JSON-масив [аркуш, назва]).
// Повертає JSON: ["#аркуш"] для кожного завантаженого аркуша + [аркуш, назва, 1.5, 2, євро, сімейний] для товарів сайту.
(async () => {
  const ID = '138kGrGBaQEtqbHwxIPPLM82mKcGFApsXpJGrea2tTp8';
  const want = NAMES_HERE;
  const norm = s => String(s || '').trim().toLowerCase().replace(/c/g, 'с').replace(/e/g, 'е').replace(/i/g, 'і').replace(/\s+/g, ' ');
  const csv = t => {
    const rows = []; let row = [], f = '', q = false;
    for (let i = 0; i < t.length; i++) {
      const ch = t[i];
      if (q) { if (ch === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += ch; }
      else if (ch === '"') q = true;
      else if (ch === ',') { row.push(f); f = ''; }
      else if (ch === '\n') { row.push(f); rows.push(row); row = []; f = ''; }
      else if (ch !== '\r') f += ch;
    }
    if (f || row.length) { row.push(f); rows.push(row); }
    return rows;
  };
  const num = c => { const m = String(c || '').match(/^\s*(\d+(?:[.,]\d+)?)/); return m ? +m[1].replace(',', '.') : 0; };
  const out = [];
  for (const sheet of [...new Set(want.map(w => w[0]))]) {
    const names = new Set(want.filter(w => w[0] === sheet).map(w => norm(w[1])));
    const r = await fetch('/spreadsheets/d/' + ID + '/gviz/tq?tqx=out:csv&sheet=' + encodeURIComponent(sheet) + '&_=' + Date.now());
    if (!r.ok) continue;
    const rows = csv(await r.text());
    if (rows.length < 5) continue;
    const hit = rows.filter(x => names.has(norm(x[2])));
    // невідомий аркуш gviz мовчки підміняє першим — якщо жодної назви не знайдено, аркуш не зараховуємо
    if (!hit.length) continue;
    out.push(['#' + sheet]);
    for (const x of hit) out.push([sheet, x[2].trim(), num(x[3]), num(x[4]), num(x[5]), num(x[6])]);
  }
  return JSON.stringify(out);
})()
