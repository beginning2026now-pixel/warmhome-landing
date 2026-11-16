// Запускати в браузері на вкладці docs.google.com (будь-яка сторінка таблиці постачальника).
// Повертає компактний JSON рядків аркуша «НАЯВНІСТЬ»: заголовки розділів + рядки з артикулами сайту.
// SKUS_HERE замінити на артикули через кому (python3 tools/stock_check.py --skus).
(async () => {
  const skus = new Set('SKUS_HERE'.split(','));
  const r = await fetch('/spreadsheets/d/1_McBnpFGO-onnVIqCCfoHM0M6DDMZn9N04jWY959XoQ/gviz/tq?tqx=out:csv&gid=1910900110&_=' + Date.now());
  if (!r.ok) return 'HTTP ' + r.status;
  const t = await r.text(), rows = [];
  let row = [], f = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (q) { if (ch === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += ch; }
    else if (ch === '"') q = true;
    else if (ch === ',') { row.push(f); f = ''; }
    else if (ch === '\n') { row.push(f); rows.push(row); row = []; f = ''; }
    else if (ch !== '\r') f += ch;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  const num = c => { const m = String(c || '').match(/^\s*(\d+(?:[.,]\d+)?)/); return m ? +m[1].replace(',', '.') : 0; };
  const out = [];
  for (const x of rows) {
    const c = (x[0] || '').trim(); if (!c) continue;
    const m = c.match(/^\d+/);
    if (!m) out.push([c.slice(0, 40)]);
    else if (skus.has(m[0])) out.push([m[0], num(x[2]), num(x[3]), num(x[4]), num(x[5])]);
  }
  return JSON.stringify(out);
})()
