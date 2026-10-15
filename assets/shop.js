/* WarmHome UA — картки товарів для каталогу і блоку «Дивіться також» */
(function () {
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n) => Number(n).toLocaleString('uk-UA').replace(/ /g, ' ');

  function productCard(p) {
    const discount = p.oldPrice && p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    return `
      <a href="${esc(p.url)}" class="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition">
        <div class="relative aspect-square bg-white overflow-hidden">
          <img src="${esc(p.image)}" alt="${esc(p.name)}" width="600" height="600" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
          ${discount ? `<span class="absolute top-3 right-3 bg-fire-600 text-white text-sm font-display font-extrabold px-2.5 py-1 rounded-lg shadow">-${discount}%</span>` : ''}
        </div>
        <div class="flex flex-col flex-1 p-4 sm:p-5">
          <h3 class="font-display font-bold text-base sm:text-lg text-graphite leading-snug">${esc(p.name)}</h3>
          ${p.short ? `<p class="mt-1.5 text-sm text-slate-500">${esc(p.short)}</p>` : ''}
          <div class="mt-auto pt-4 flex items-end gap-2 flex-wrap">
            <span class="font-display font-extrabold text-2xl text-fire-600">${fmt(p.price)} грн</span>
            ${discount ? `<span class="text-sm text-slate-400 line-through mb-1">${fmt(p.oldPrice)} грн</span>` : ''}
          </div>
          <span class="mt-4 flex items-center justify-center gap-2 min-h-[44px] rounded-xl bg-buy-600 group-hover:bg-buy-700 text-white font-bold transition">Детальніше</span>
        </div>
      </a>`;
  }

  // Вивести картки в контейнер; повертає кількість показаних товарів
  window.renderProducts = function (container, { exclude = null, limit = 0 } = {}) {
    if (!container) return 0;
    let list = (window.PRODUCTS || []).filter(p => p.slug !== exclude);
    if (limit) list = list.slice(0, limit);
    container.innerHTML = list.map(productCard).join('');
    return list.length;
  };
})();
