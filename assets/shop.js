/* WarmHome UA — картки товарів для каталогу і блоку «Дивіться також» */
(function () {
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n) => Number(n).toLocaleString('uk-UA').replace(/ /g, ' ');
  const inStock = (p) => p.inStock !== false;

  function productCard(p) {
    const discount = p.oldPrice && p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

    // Товару немає в наявності: сіра картка без сторінки і без кнопок покупки
    if (!inStock(p)) {
      return `
      <div class="oos-card flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden" aria-disabled="true">
        <div class="relative block aspect-square bg-white overflow-hidden">
          <img src="${esc(p.image)}" alt="${esc(p.name)}" width="600" height="600" loading="lazy" class="img-fade w-full h-full object-cover grayscale opacity-50">
          <span class="absolute top-3 left-3 bg-slate-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">Немає в наявності</span>
        </div>
        <div class="flex flex-col flex-1 p-3 sm:p-5">
          <p class="font-display font-bold text-[15px] sm:text-lg text-slate-400 leading-snug hyphens-auto [overflow-wrap:anywhere]">${esc(p.name)}</p>
          ${p.short ? `<p class="mt-1.5 text-sm text-slate-400">${esc(p.short)}</p>` : ''}
          <div class="mt-auto pt-4">
            <span class="font-display font-extrabold text-xl min-[400px]:text-2xl text-slate-400 whitespace-nowrap">${fmt(p.price)} грн</span>
          </div>
          <div class="mt-4 flex items-center justify-center min-h-[44px] rounded-xl bg-slate-100 text-slate-400 font-bold text-sm sm:text-base">Немає в наявності</div>
        </div>
      </div>`;
    }

    return `
      <div class="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition">
        <a href="${esc(p.url)}" class="relative block aspect-square bg-white overflow-hidden">
          <img src="${esc(p.image)}" alt="${esc(p.name)}" width="600" height="600" loading="lazy" class="img-fade w-full h-full object-cover group-hover:scale-[1.03] transition duration-300">
          ${discount ? `<span class="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-fire-600 text-white text-[13px] sm:text-sm font-display font-extrabold px-2.5 py-1 rounded-lg shadow">-${discount}%</span>` : ''}
          <span class="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 flex flex-col items-start gap-1 sm:gap-1.5">
            ${p.badge ? `<span class="max-w-full truncate bg-graphite/90 text-white text-[11px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">${esc(p.badge)}</span>` : ''}
            ${p.ending ? `<span class="max-w-full truncate bg-amber-500 text-white text-[11px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">⏳ Закінчується</span>` : ''}
          </span>
        </a>
        <div class="flex flex-col flex-1 p-3 sm:p-5">
          <a href="${esc(p.url)}" class="font-display font-bold text-[15px] sm:text-lg text-graphite leading-snug hover:text-fire-600 hyphens-auto [overflow-wrap:anywhere]">${esc(p.name)}</a>
          ${p.short ? `<p class="mt-1.5 text-sm text-slate-500">${esc(p.short)}</p>` : ''}
          <div class="mt-auto pt-4 flex items-end gap-2 flex-wrap">
            <span class="font-display font-extrabold text-xl min-[400px]:text-2xl text-fire-600 whitespace-nowrap">${fmt(p.price)} грн</span>
            ${discount ? `<span class="text-sm text-slate-400 line-through mb-1">${fmt(p.oldPrice)} грн</span>` : ''}
          </div>
          <div class="mt-4 flex gap-2">
            <a href="${esc(p.url)}" class="flex-1 flex items-center justify-center min-h-[44px] rounded-xl bg-buy-600 hover:bg-buy-700 text-white font-bold transition text-sm sm:text-base">Детальніше</a>
            <button type="button" data-add-to-cart="${esc(p.slug)}" class="shrink-0 grid place-items-center w-11 min-h-[44px] rounded-xl border border-slate-200 text-graphite hover:text-fire-600 hover:border-fire-500 transition" aria-label="Додати в кошик" title="Додати в кошик"><i data-lucide="shopping-cart" class="w-5 h-5"></i></button>
          </div>
        </div>
      </div>`;
  }

  // Вивести картки в контейнер; повертає кількість показаних товарів.
  // Каталог (без exclude): усі товари, спершу ті, що є в наявності.
  // «Дивіться також» (з exclude): лише товари в наявності, у випадковому порядку.
  window.renderProducts = function (container, { exclude = null, limit = 0, cat = '' } = {}) {
    if (!container) return 0;
    let list = (window.PRODUCTS || []).filter(p => p.slug !== exclude && (!cat || (cat === 'ending' ? p.ending && p.inStock !== false : (p.cat || []).includes(cat))));
    if (exclude) {
      list = list.filter(inStock);
      for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
    } else {
      list = list.filter(inStock).concat(list.filter(p => !inStock(p)));
    }
    if (limit) list = list.slice(0, limit);
    container.innerHTML = list.map(productCard).join('');
    if (window.lucide) lucide.createIcons();
    return list.length;
  };
})();
