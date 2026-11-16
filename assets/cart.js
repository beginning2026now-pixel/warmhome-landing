/* ==========================================================
   WarmHome UA — КОШИК (спільний для всіх сторінок)
   - кнопки: .js-cart-open (відкрити кошик), .js-cart-count (лічильник),
             [data-add-to-cart="<slug>"] (додати товар)
   - товари беруться з window.PRODUCTS (assets/products.js)
   - оформлення надсилається в Google-таблицю + Telegram (той самий LEADS_URL)
   ========================================================== */
/* ==========================================================
   WarmHome UA — ПЕРЕВІРКА ЗАЯВОК НА ТЕСТ / ФЕЙК
   Замовлення ніколи не блокується: підозрілі отримують у Telegram
   позначку «⚠️ ПЕРЕВІРТЕ» зі списком причин, щоб не відправляти
   посилку без дзвінка-підтвердження.
   ========================================================== */
window.WHGuard = (function () {
  const KEY = 'wh_orders_v1', HOUR = 3600e3;
  let started = 0;                                   // коли відвідувач почав заповнювати форму
  document.addEventListener('input', function (e) {
    if (!started && e.target && e.target.closest && e.target.closest('form')) started = Date.now();
  }, true);
  const digits = s => String(s || '').replace(/\D/g, '').slice(-10);
  const norm = s => String(s || '').trim().toLowerCase().replace(/[ʼ'’`]/g, '');
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } };
  const store = a => { try { localStorage.setItem(KEY, JSON.stringify(a.slice(-10))); } catch (e) {} };

  function check(o) {
    const r = [], f = norm(o.firstName), l = norm(o.lastName), d = digits(o.phone), tail = d.slice(3), now = Date.now();
    if (f === 'олена' && l === 'коваленко') r.push('імʼя збігається з прикладом у формі («Олена Коваленко»)');
    if (f && f === l) r.push('імʼя і прізвище однакові');
    if (/\d/.test(f + l)) r.push('цифри в імені');
    if (/^[a-z\s-]+$/i.test(f + l)) r.push('імʼя латиницею');
    if (/^(\d)\1+$/.test(tail)) r.push('номер з однакових цифр');
    if (tail.length === 7 && ('0123456789'.includes(tail) || '9876543210'.includes(tail))) r.push('номер — цифри підряд');
    if (started && now - started < 6000) r.push('форму заповнено за ' + Math.round((now - started) / 1000) + ' с');
    load().filter(x => now - x.t < HOUR).forEach(x => {
      const mins = Math.max(1, Math.round((now - x.t) / 60000));
      if (x.d === d) { if (x.p === o.product) r.push('повтор: цей номер уже замовляв цей товар ' + mins + ' хв тому'); return; }
      r.push('з цього ж пристрою ' + mins + ' хв тому вже було замовлення: ' + x.n + ', +38 (' + x.d.slice(0, 3) + ') ' + x.d.slice(3, 6) + '-' + x.d.slice(6, 8) + '-' + x.d.slice(8));
      if (x.d.slice(0, 7) === d.slice(0, 7)) r.push('номер майже такий самий, як у попередньому замовленні');
      if (x.w && x.w === o.warehouse) r.push('те саме відділення НП, що й у попередньому замовленні');
    });
    return [...new Set(r)];
  }
  function record(o) {
    const a = load(); a.push({ t: Date.now(), d: digits(o.phone), n: String(o.name || '').slice(0, 60), w: o.warehouse || '', p: o.product || '' });
    store(a); started = 0;
  }
  // Блок для повідомлення в Telegram (HTML) і для таблиці (звичайний текст)
  function html(flags, esc) { return flags.length ? ['⚠️ <b>ПЕРЕВІРТЕ — схоже на тест або фейк:</b>', ...flags.map(x => '• ' + esc(x)), ''] : []; }
  function plain(flags) { return flags.length ? '⚠️ ПЕРЕВІРТЕ: ' + flags.join('; ') : ''; }
  return { check, record, html, plain };
})();

/* ==========================================================
   WarmHome UA — КОШИК (постільна білизна та пледи)
   - кнопки: .js-cart-open (відкрити), .js-cart-count (лічильник)
   - додати: window.Cart.add('<slug>|<розмір>|<наволочки>')
   - товари й розміри беруться з window.PRODUCTS (assets/products.js)
   - замовлення йде в Google-таблицю + Telegram (LEADS_URL)
   - оплата: передоплата PREPAY грн на карту, решта — при отриманні
   ========================================================== */
(function () {
  const LEADS_URL = 'https://script.google.com/macros/s/AKfycbxV8jAtsjSV5_v5c-Ut88A3b4ymgJSWugq5SjGMv-I1SX_I65oECgysxCKZsab6ERq4/exec';
  const PREPAY = 200;
  const CODES = ['050','066','095','099','067','068','096','097','098','063','073','093','091','094'];
  const KEY = 'wh_cart_v2';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n) => Number(n).toLocaleString('uk-UA').replace(/\s/g, ' ');
  const SVG = (p) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
  const I = {
    bag: SVG('<path d="M6 8h12l-1 12H7Z"/><path d="M9 8a3 3 0 0 1 6 0"/>'),
    x: SVG('<path d="M6 6l12 12M18 6 6 18"/>'),
    minus: SVG('<path d="M6 12h12"/>'), plus: SVG('<path d="M12 6v12M6 12h12"/>'),
    trash: SVG('<path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/>'),
    back: SVG('<path d="M15 6l-6 6 6 6"/>'), check: SVG('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  };

  /* ---------- Товар за ключем «slug|розмір|наволочки» ---------- */
  function resolve(key) {
    const [slug, vid, pil] = String(key).split('|');
    const p = (window.PRODUCTS || []).find(x => x.slug === slug); if (!p) return null;
    const v = (p.variants || []).find(x => x.id === vid); if (!v || v.out) return null;
    return { key, p, v, pil: pil || '', name: p.name, opt: v.label + (pil ? ', наволочки ' + pil : ''), price: v.price, sku: v.sku, cid: v.sku + '-' + v.id, image: p.image, url: p.url };
  }

  /* ---------- UTM на весь візит ---------- */
  try {
    const q = new URLSearchParams(location.search);
    const utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].filter(k => q.get(k)).map(k => `${k}: ${q.get(k)}`).join('\n');
    if (utm) sessionStorage.setItem('wh_utm', utm);
  } catch (e) {}
  const getUTM = () => { try { return sessionStorage.getItem('wh_utm') || ''; } catch (e) { return ''; } };

  /* ---------- Сховище ---------- */
  let items = [];
  try { items = JSON.parse(localStorage.getItem(KEY) || '[]').filter(i => i && i.key && i.qty > 0); } catch (e) { items = []; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {} };
  const lines = () => items.map(i => ({ ...resolve(i.key), qty: i.qty })).filter(i => i.p);
  const count = () => lines().reduce((s, i) => s + i.qty, 0);
  const total = () => lines().reduce((s, i) => s + i.qty * i.price, 0);
  const updateBadges = () => { const n = count(); $$('.js-cart-count').forEach(el => { el.textContent = n; el.hidden = !n; }); };

  /* ---------- Розмітка ---------- */
  document.body.insertAdjacentHTML('beforeend', `
  <div class="cart-ov" id="cartOverlay" hidden></div>
  <aside class="cart" id="cartDrawer" aria-hidden="true" aria-label="Кошик">
    <div class="cart-h"><h2>${I.bag}<span id="cartTitle">Кошик</span></h2><button type="button" class="cart-x" id="cartClose" aria-label="Закрити">${I.x}</button></div>
    <div id="cartStepItems" class="cart-step">
      <div id="cartItems" class="cart-list"></div>
      <div id="cartEmpty" class="cart-empty" hidden><div class="cart-ic">${I.bag}</div><p>Кошик поки порожній</p><a href="/#catalog" class="js-cart-close">Перейти до каталогу</a></div>
      <div id="cartFooter" class="cart-f">
        <div class="cart-sum"><span>Разом</span><b><span class="js-cart-total">0</span> грн</b></div>
        <button type="button" id="cartCheckout" class="btn btn-main" style="width:100%">Оформити замовлення</button>
        <p class="cart-note">Передоплата ${PREPAY} грн, решта — при отриманні</p>
      </div>
    </div>
    <form id="cartForm" class="cart-step" hidden novalidate>
      <div class="cart-list">
        <button type="button" id="cartBack" class="cart-back">${I.back}До кошика</button>
        <input type="text" name="website" tabindex="-1" autocomplete="off" hidden aria-hidden="true">
        <label class="fld"><span>Імʼя *</span><input type="text" name="firstName" autocomplete="given-name"><em data-for="firstName" hidden>Вкажіть імʼя</em></label>
        <label class="fld"><span>Прізвище *</span><input type="text" name="lastName" autocomplete="family-name"><em data-for="lastName" hidden>Вкажіть прізвище</em></label>
        <label class="fld"><span>Номер телефону *</span><input type="tel" name="phone" inputmode="tel" autocomplete="tel" placeholder="+38 (0__) ___-__-__"><em data-for="phone" hidden>Введіть коректний український номер</em></label>
        <div class="fld"><span>Доставка Новою Поштою *</span>
          <div class="np"><input type="text" name="city" autocomplete="off" placeholder="Почніть вводити місто"><ul class="np-l" data-for="city" hidden></ul></div>
          <div class="np"><input type="text" name="warehouse" autocomplete="off" disabled placeholder="Спершу оберіть місто"><ul class="np-l" data-for="warehouse" hidden></ul></div>
          <em data-for="np" hidden>Оберіть місто та відділення</em></div>
        <label class="fld"><span>Коментар</span><textarea name="comment" rows="2" placeholder="Наприклад, побажання щодо доставки"></textarea></label>
        <div class="cart-pay"><b>Як оплатити</b>Після оформлення менеджер звʼяжеться з вами, підтвердить наявність і надішле реквізити для передоплати ${PREPAY} грн. Решту суми сплачуєте у відділенні Нової Пошти після огляду.</div>
      </div>
      <div class="cart-f">
        <button type="submit" id="cartSubmit" class="btn btn-main" style="width:100%"><span class="c-btn">Підтвердити замовлення на <span class="js-cart-total">0</span> грн</span></button>
        <p class="cart-err" hidden>Не вдалося надіслати. Спробуйте ще раз або зателефонуйте: <a href="tel:+380990227684">+38 (099) 022-76-84</a></p>
      </div>
    </form>
    <div id="cartDone" class="cart-step cart-empty" hidden><div class="cart-ic">${I.check}</div><h3>Дякуємо!</h3><p id="cartDoneText"></p><button type="button" class="btn btn-main js-cart-close">Добре</button></div>
  </aside>
  <div class="cart-toast" id="cartToast" hidden><span>${I.check} Додано в кошик</span><button type="button" class="js-cart-open">Оформити</button></div>`);

  const drawer = $('#cartDrawer'), overlay = $('#cartOverlay'), form = $('#cartForm');
  function show(step) {
    $('#cartStepItems').hidden = step !== 'items'; form.hidden = step !== 'form'; $('#cartDone').hidden = step !== 'done';
    $('#cartTitle').textContent = step === 'form' ? 'Оформлення' : 'Кошик';
  }
  function render() {
    const ls = lines();
    $('#cartItems').innerHTML = ls.map(i => `
      <div class="ci">
        <a href="${esc(i.url)}" class="ci-img"><img src="${esc(i.image)}" alt=""></a>
        <div class="ci-b"><a href="${esc(i.url)}" class="ci-n">${esc(i.name)}</a><span class="ci-o">${esc(i.opt)}</span>
          <div class="ci-r"><div class="qty"><button type="button" data-dec="${esc(i.key)}" aria-label="Менше">${I.minus}</button><span>${i.qty}</span><button type="button" data-inc="${esc(i.key)}" aria-label="Більше">${I.plus}</button></div>
          <b>${fmt(i.qty * i.price)} грн</b></div></div>
        <button type="button" class="ci-del" data-del="${esc(i.key)}" aria-label="Видалити">${I.trash}</button>
      </div>`).join('');
    const empty = !ls.length;
    $('#cartItems').hidden = empty; $('#cartFooter').hidden = empty; $('#cartEmpty').hidden = !empty;
    $$('.js-cart-total').forEach(el => el.textContent = fmt(total()));
    updateBadges();
  }
  function open(step = 'items') {
    show(step); render(); overlay.hidden = false; drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; $('#cartToast').hidden = true;
  }
  function close() { overlay.hidden = true; drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
  function add(key, qty = 1) {
    const r = resolve(key); if (!r) return false;
    const it = items.find(i => i.key === key); if (it) it.qty += qty; else items.push({ key, qty });
    save(); render();
    if (typeof fbq === 'function') fbq('track', 'AddToCart', { content_ids: [r.cid], content_type: 'product', value: r.price, currency: 'UAH' });
    const t = $('#cartToast'); t.hidden = false; clearTimeout(add._t); add._t = setTimeout(() => { t.hidden = true; }, 3500);
    return true;
  }
  function setQty(key, d) { const it = items.find(i => i.key === key); if (!it) return; it.qty += d; if (it.qty <= 0) items = items.filter(i => i !== it); save(); render(); }

  document.addEventListener('click', e => {
    if (e.target.closest('.js-cart-open')) { e.preventDefault(); open('items'); return; }
    if (e.target.closest('.js-cart-close') || e.target === overlay || e.target.closest('#cartClose')) { close(); return; }
    const inc = e.target.closest('[data-inc]'); if (inc) return setQty(inc.dataset.inc, 1);
    const dec = e.target.closest('[data-dec]'); if (dec) return setQty(dec.dataset.dec, -1);
    const del = e.target.closest('[data-del]'); if (del) { items = items.filter(i => i.key !== del.dataset.del); save(); render(); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) close(); });
  $('#cartCheckout').addEventListener('click', () => {
    show('form');
    if (typeof fbq === 'function') fbq('track', 'InitiateCheckout', { content_ids: lines().map(i => i.cid), content_type: 'product', value: total(), currency: 'UAH', num_items: count() });
  });
  $('#cartBack').addEventListener('click', () => show('items'));

  /* ---------- Телефон ---------- */
  const digits = (v) => { let d = (v.startsWith('+38 (') ? v.slice(5) : v).replace(/\D/g, ''); if (d.length >= 12) d = d.slice(-10); if (d.startsWith('38')) d = d.slice(2); if (d && d[0] !== '0') d = '0' + d; return d.slice(0, 10); };
  const fmtPhone = (v) => { const d = digits(v); if (!d) return ''; let o = '+38 (' + d.slice(0, 3); if (d.length > 3) o += ') ' + d.slice(3, 6); if (d.length > 6) o += '-' + d.slice(6, 8); if (d.length > 8) o += '-' + d.slice(8, 10); return o; };
  const phoneOk = (v) => { const d = digits(v); return d.length === 10 && CODES.includes(d.slice(0, 3)); };
  const ph = form.phone;
  ph.addEventListener('input', () => { ph.value = fmtPhone(ph.value); });
  ph.addEventListener('focus', () => { if (!ph.value) ph.value = '+38 (0'; });
  ph.addEventListener('blur', () => { if (digits(ph.value).length <= 1) ph.value = ''; });

  /* ---------- Нова Пошта (підказки міст і відділень) ---------- */
  let cityRef = '', whPicked = false, npOk = true;
  async function np(modelName, calledMethod, methodProperties) {
    const r = await fetch('https://api.novaposhta.ua/v2.0/json/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ apiKey: '', modelName, calledMethod, methodProperties }) });
    const j = await r.json(); if (!j.success) throw new Error('NP'); return j.data;
  }
  function auto(input, search, pick) {
    const list = $(`.np-l[data-for="${input.name}"]`, form); let t, seq = 0, res = [];
    const hide = () => { list.hidden = true; };
    async function run() {
      const my = ++seq;
      try {
        res = await search(input.value.trim()); if (my !== seq) return;
        list.innerHTML = res.length ? res.map((r, i) => `<li data-i="${i}">${r.html}</li>`).join('') : '<li class="np-no">Нічого не знайдено</li>';
        list.hidden = false;
      } catch (e) { npOk = false; hide(); form.warehouse.disabled = false; form.warehouse.placeholder = 'Номер відділення або адреса'; }
    }
    input.addEventListener('input', () => {
      if (!npOk) return; clearTimeout(t);
      if (input === form.city) { cityRef = ''; whPicked = false; form.warehouse.value = ''; form.warehouse.disabled = true; form.warehouse.placeholder = 'Спершу оберіть місто'; if (input.value.trim().length < 2) return hide(); }
      else whPicked = false;
      t = setTimeout(run, 300);
    });
    input.addEventListener('focus', () => { if (npOk && input === form.warehouse && cityRef) run(); });
    list.addEventListener('pointerdown', e => { const li = e.target.closest('li[data-i]'); if (!li) return; e.preventDefault(); pick(res[+li.dataset.i]); hide(); });
    input.addEventListener('blur', () => setTimeout(hide, 150));
  }
  auto(form.city, async q => {
    const d = await np('Address', 'searchSettlements', { CityName: q, Limit: '20', Page: '1' });
    return ((d[0] && d[0].Addresses) || []).filter(a => +a.Warehouses > 0).map(a => ({ ref: a.DeliveryCity, value: a.Present, html: `<b>${esc(a.MainDescription)}</b><small>${esc(a.Present)}</small>` }));
  }, r => { form.city.value = r.value; cityRef = r.ref; whPicked = false; form.warehouse.disabled = false; form.warehouse.value = ''; form.warehouse.placeholder = 'Номер або адреса відділення / поштомату'; form.warehouse.focus(); });
  auto(form.warehouse, async q => {
    const p = { CityRef: cityRef, Limit: '50', Page: '1', Language: 'UA' }; if (q) p.FindByString = q;
    const d = await np('AddressGeneral', 'getWarehouses', p);
    return d.map(w => ({ value: w.Description, html: esc(w.Description) }));
  }, r => { form.warehouse.value = r.value; whPicked = true; });

  /* ---------- Відправка ---------- */
  const err = (k, on) => { const el = $(`em[data-for="${k}"]`, form); if (el) el.hidden = !on; };
  let busy = false;
  form.addEventListener('submit', async e => {
    e.preventDefault(); if (busy || form.website.value) return;
    const firstName = form.firstName.value.trim(), lastName = form.lastName.value.trim(), name = `${firstName} ${lastName}`, phone = form.phone.value.trim(), city = form.city.value.trim(), wh = form.warehouse.value.trim(), comment = form.comment.value.trim();
    const ok = { firstName: firstName.length >= 2, lastName: lastName.length >= 2, phone: phoneOk(phone), np: city.length >= 2 && wh.length >= 1 && (!npOk || (cityRef && whPicked)) };
    Object.entries(ok).forEach(([k, v]) => err(k, !v));
    if (!ok.firstName) return form.firstName.focus(); if (!ok.lastName) return form.lastName.focus(); if (!ok.phone) return form.phone.focus(); if (!ok.np) return (cityRef ? form.warehouse : form.city).focus();
    const ls = lines(); if (!ls.length) return show('items');
    const sum = total();
    const list = ls.map(i => `• ${i.name} — ${i.opt} (арт. ${i.sku}) × ${i.qty} = ${i.qty * i.price} грн`).join('\n');
    const utm = getUTM();
    const flags = WHGuard.check({ firstName, lastName, phone, warehouse: `${city}, ${wh}`, product: ls.map(i => i.key).join(',') });
    const text = ['🛒 <b>Нове замовлення</b>', '', ...WHGuard.html(flags, esc), esc(list), '', `💰 <b>Разом:</b> ${sum} грн (передоплата ${PREPAY} грн, післяплата ${sum - PREPAY} грн)`, '', `👤 <b>Імʼя:</b> ${esc(name)}`, `📞 <b>Телефон:</b> ${esc(phone)}`, `🚚 <b>НП:</b> ${esc(city)}, ${esc(wh)}`,
      comment ? `💬 <b>Коментар:</b> ${esc(comment)}` : '', '☎️ Зателефонувати, підтвердити наявність і надіслати реквізити для передоплати',
      '', `🕒 ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })}`, utm ? `\n📊 <b>UTM:</b>\n${esc(utm)}` : ''].join('\n');
    busy = true; const btn = $('#cartSubmit'), lbl = $('.c-btn', btn), orig = lbl.innerHTML;
    btn.disabled = true; lbl.textContent = 'Відправляємо...'; $('.cart-err', form).hidden = true;
    try {
      const r = await fetch(LEADS_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ text, page: location.href, fields: { type: 'Замовлення (кошик)', name, phone, city, warehouse: wh, message: [WHGuard.plain(flags), list, comment ? 'Коментар: ' + comment : ''].filter(Boolean).join('\n'), product: ls.map(i => `${i.name} (${i.opt}) × ${i.qty}`).join('; '), price: sum, utm } }) });
      const j = await r.json().catch(() => ({})); if (!r.ok || !j.ok) throw new Error(j.error || 'send');
      WHGuard.record({ name, phone, warehouse: `${city}, ${wh}`, product: ls.map(i => i.key).join(',') });
      const eid = 'cart_' + Date.now();
      if (typeof fbq === 'function') {
        const data = { value: sum, currency: 'UAH', content_ids: ls.map(i => i.cid), content_type: 'product', num_items: count() };
        fbq('track', 'Lead', data, { eventID: 'lead_' + eid });
        fbq('track', 'Purchase', data, { eventID: 'purchase_' + eid });
      }
      items = []; save(); form.reset(); cityRef = ''; whPicked = false; form.warehouse.disabled = npOk;
      $('#cartDoneText').textContent = `Замовлення прийнято. Менеджер звʼяжеться з вами, підтвердить наявність і надішле реквізити для передоплати ${PREPAY} грн.`;
      render(); show('done');
    } catch (e2) { console.error(e2); $('.cart-err', form).hidden = false; }
    finally { setTimeout(() => { busy = false; btn.disabled = false; lbl.innerHTML = orig; $$('.js-cart-total').forEach(el => el.textContent = fmt(total())); }, 1200); }
  });

  render();
  window.Cart = { add, open, close, count, resolve };
})();
