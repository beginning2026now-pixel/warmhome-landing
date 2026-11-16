/* ==========================================================
   КАТАЛОГ ТОВАРІВ WarmHome UA — постільна білизна та пледи
   Один блок = один товар. З цього списку будуються головна (категорії
   й картки), кошик і фід для магазину Facebook/Instagram.

   slug     — коротка унікальна назва латиницею (= папка сторінки в /products/)
   sku      — артикул постачальника
   name     — назва товару
   short    — 1 рядок про головне (показується в картці)
   price    — ціна продажу, грн
   oldPrice — стара ціна, грн (лише якщо справді була; інакше null)
   image    — головне фото
   url      — адреса сторінки товару
   inStock  — false: немає в наявності
   cat      — підкатегорії (див. SUBCATS нижче)
   added    — коли додано, 'YYYY-MM-DDTHH:MM' (для сортування «Новинки»)
   ========================================================== */
window.PRODUCTS = [
];

window.DEPARTMENTS = [
  { id: 'bedding', name: 'Постільна білизна', text: 'Комплекти, простирадла й наволочки — мʼякі, приємні до тіла', cats: ['sets', 'sheets', 'pillowcases'] },
  { id: 'plaids', name: 'Пледи', text: 'Теплі й легкі — для дивана, ліжка та вечорів із книжкою', cats: ['plaids'] },
];
window.SUBCATS = {
  sets: ['Комплекти'], sheets: ['Простирадла'], pillowcases: ['Наволочки'], plaids: ['Пледи'],
};
// Група товару (перша, до якої належить хоча б одна його підкатегорія)
window.deptOf = function (p) { return window.DEPARTMENTS.find(function (d) { return (p.cat || []).some(function (c) { return d.cats.indexOf(c) >= 0; }); }) || null; };
// Чи належить товар до групи / підкатегорії ('' — усі товари)
window.matchCat = function (p, c) {
  if (!c) return true;
  var d = window.DEPARTMENTS.find(function (x) { return x.id === c; });
  return d ? (p.cat || []).some(function (x) { return d.cats.indexOf(x) >= 0; }) : (p.cat || []).indexOf(c) >= 0;
};
