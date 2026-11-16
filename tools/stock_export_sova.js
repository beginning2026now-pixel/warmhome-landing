// Наявність DropSOVA (SOVA hometex) — їхній каталог в EasyDrop показує лише товари, що є в наявності.
// Запускати в браузері на вкладці https://easydrop.one/ (будь-яка сторінка).
// IDS_HERE замінити на вивід  python3 tools/stock_check.py --sova-ids  (id товарів EasyDrop через кому).
// Повертає JSON: [["#ok", кількість товарів у каталозі], [id, 1|0], ...] — 1 = є в наявності.
(async () => {
  const want = new Set('IDS_HERE'.split(','));
  const TOKEN = '08756247473706';
  const home = new DOMParser().parseFromString(await (await fetch('/supplier-catalog/' + TOKEN + '/0/')).text(), 'text/html');
  const cats = [...home.querySelectorAll('#brand-select option')].map(o => o.value).filter(v => v && v !== '0');
  const seen = {}; let total = 0;
  for (const c of cats) {
    const doc = new DOMParser().parseFromString(await (await fetch('/supplier-catalog/' + TOKEN + '/' + c + '/')).text(), 'text/html');
    for (const t of doc.querySelectorAll('table.item-table')) {
      const g = t.querySelector('[onclick*=showItemImageGallery]'); if (!g) continue;
      const id = (g.getAttribute('onclick').match(/\d+/) || [''])[0]; total++;
      const row = t.closest('.row');
      const ok = [...row.querySelectorAll('.size-option')].some(o => /available-True/.test(o.className)) ? 1 : 0;
      if (want.has(id)) seen[id] = Math.max(seen[id] || 0, ok);
    }
  }
  if (!total) return 'EMPTY';
  return JSON.stringify([['#ok', total], ...[...want].map(id => [id, seen[id] || 0])]);
})()
