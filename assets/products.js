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
 {
  "slug": "varena-bavovna-bilyi",
  "sku": "8734",
  "name": "Комплект із вареної бавовни · Білий",
  "short": "Варена бавовна",
  "fabric": "varena",
  "price": 2600,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/varena-bavovna-bilyi-1.jpg",
  "images": [
   "/assets/img/p/varena-bavovna-bilyi-1.jpg"
  ],
  "url": "/products/varena-bavovna-bilyi/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T19:00",
  "variants": [
   {
    "id": "2",
    "size": "2",
    "label": "Двоспальний",
    "sku": "8734",
    "price": 2600
   },
   {
    "id": "2l",
    "size": "2",
    "label": "Двоспальний з мереживом",
    "sku": "8834",
    "price": 3200
   },
   {
    "id": "e",
    "size": "e",
    "label": "Євро",
    "sku": "8734",
    "price": 2800
   },
   {
    "id": "el",
    "size": "e",
    "label": "Євро з мереживом",
    "sku": "8834",
    "price": 3500
   }
  ],
  "sup": "VT"
 },
 {
  "slug": "varena-bavovna-nizhno-rozhevyi",
  "sku": "88111",
  "name": "Комплект із вареної бавовни · Ніжно-рожевий",
  "short": "Варена бавовна",
  "fabric": "varena",
  "price": 2800,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/varena-bavovna-nizhno-rozhevyi-1.jpg",
  "images": [
   "/assets/img/p/varena-bavovna-nizhno-rozhevyi-1.jpg",
   "/assets/img/p/varena-bavovna-nizhno-rozhevyi-2.jpg"
  ],
  "url": "/products/varena-bavovna-nizhno-rozhevyi/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T19:00",
  "variants": [
   {
    "id": "2l",
    "size": "2",
    "label": "Двоспальний з мереживом",
    "sku": "88111",
    "price": 3200
   },
   {
    "id": "e",
    "size": "e",
    "label": "Євро",
    "sku": "87111",
    "price": 2800
   },
   {
    "id": "el",
    "size": "e",
    "label": "Євро з мереживом",
    "sku": "88111",
    "price": 3500
   }
  ],
  "sup": "VT"
 },
 {
  "slug": "varena-bavovna-rozhevyi",
  "sku": "87113",
  "name": "Комплект із вареної бавовни · Рожевий",
  "short": "Варена бавовна",
  "fabric": "varena",
  "price": 2600,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/varena-bavovna-rozhevyi-1.jpg",
  "images": [
   "/assets/img/p/varena-bavovna-rozhevyi-1.jpg",
   "/assets/img/p/varena-bavovna-rozhevyi-2.jpg"
  ],
  "url": "/products/varena-bavovna-rozhevyi/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T19:00",
  "variants": [
   {
    "id": "2",
    "size": "2",
    "label": "Двоспальний",
    "sku": "87113",
    "price": 2600
   },
   {
    "id": "e",
    "size": "e",
    "label": "Євро",
    "sku": "87113",
    "price": 2800
   },
   {
    "id": "el",
    "size": "e",
    "label": "Євро з мереживом",
    "sku": "88113",
    "price": 3500
   }
  ],
  "sup": "VT"
 },
 {
  "slug": "varena-bavovna-pisochnyi",
  "sku": "88123",
  "name": "Комплект із вареної бавовни · Пісочний",
  "short": "Варена бавовна",
  "fabric": "varena",
  "price": 3200,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/varena-bavovna-pisochnyi-1.jpg",
  "images": [
   "/assets/img/p/varena-bavovna-pisochnyi-1.jpg",
   "/assets/img/p/varena-bavovna-pisochnyi-2.jpg"
  ],
  "url": "/products/varena-bavovna-pisochnyi/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T19:00",
  "variants": [
   {
    "id": "2l",
    "size": "2",
    "label": "Двоспальний з мереживом",
    "sku": "88123",
    "price": 3200
   }
  ],
  "sup": "VT"
 },
 {
  "slug": "varena-bavovna-nyudovyi",
  "sku": "8812",
  "name": "Комплект із вареної бавовни · Нюдовий",
  "short": "Варена бавовна",
  "fabric": "varena",
  "price": 3500,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/varena-bavovna-nyudovyi-1.jpg",
  "images": [
   "/assets/img/p/varena-bavovna-nyudovyi-1.jpg",
   "/assets/img/p/varena-bavovna-nyudovyi-2.jpg",
   "/assets/img/p/varena-bavovna-nyudovyi-3.jpg"
  ],
  "url": "/products/varena-bavovna-nyudovyi/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T19:00",
  "variants": [
   {
    "id": "el",
    "size": "e",
    "label": "Євро з мереживом",
    "sku": "8812",
    "price": 3500
   }
  ],
  "sup": "VT"
 },
 {
  "slug": "varena-bavovna-metalik",
  "sku": "8722",
  "name": "Комплект із вареної бавовни · Металік",
  "short": "Варена бавовна",
  "fabric": "varena",
  "price": 2600,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/varena-bavovna-metalik-1.jpg",
  "images": [
   "/assets/img/p/varena-bavovna-metalik-1.jpg",
   "/assets/img/p/varena-bavovna-metalik-2.jpg"
  ],
  "url": "/products/varena-bavovna-metalik/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T19:00",
  "variants": [
   {
    "id": "2",
    "size": "2",
    "label": "Двоспальний",
    "sku": "8722",
    "price": 2600
   },
   {
    "id": "2l",
    "size": "2",
    "label": "Двоспальний з мереживом",
    "sku": "8822",
    "price": 3200
   },
   {
    "id": "el",
    "size": "e",
    "label": "Євро з мереживом",
    "sku": "8822",
    "price": 3500
   }
  ],
  "sup": "VT"
 },
 {
  "slug": "varena-bavovna-siryi",
  "sku": "8721",
  "name": "Комплект із вареної бавовни · Сірий",
  "short": "Варена бавовна",
  "fabric": "varena",
  "price": 2600,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/varena-bavovna-siryi-1.jpg",
  "images": [
   "/assets/img/p/varena-bavovna-siryi-1.jpg",
   "/assets/img/p/varena-bavovna-siryi-2.jpg"
  ],
  "url": "/products/varena-bavovna-siryi/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T19:00",
  "variants": [
   {
    "id": "2",
    "size": "2",
    "label": "Двоспальний",
    "sku": "8721",
    "price": 2600
   },
   {
    "id": "2l",
    "size": "2",
    "label": "Двоспальний з мереживом",
    "sku": "8821",
    "price": 3200
   },
   {
    "id": "e",
    "size": "e",
    "label": "Євро",
    "sku": "8721",
    "price": 2800
   },
   {
    "id": "el",
    "size": "e",
    "label": "Євро з мереживом",
    "sku": "8821",
    "price": 3500
   }
  ],
  "sup": "VT"
 },
 {
  "slug": "varena-bavovna-svitlo-siryi",
  "sku": "88119",
  "name": "Комплект із вареної бавовни · Світло-сірий",
  "short": "Варена бавовна",
  "fabric": "varena",
  "price": 3500,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/varena-bavovna-svitlo-siryi-1.jpg",
  "images": [
   "/assets/img/p/varena-bavovna-svitlo-siryi-1.jpg",
   "/assets/img/p/varena-bavovna-svitlo-siryi-2.jpg"
  ],
  "url": "/products/varena-bavovna-svitlo-siryi/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T19:00",
  "variants": [
   {
    "id": "el",
    "size": "e",
    "label": "Євро з мереживом",
    "sku": "88119",
    "price": 3500
   }
  ],
  "sup": "VT"
 },
 {
  "slug": "varena-bavovna-temno-siryi",
  "sku": "8714",
  "name": "Комплект із вареної бавовни · Темно-сірий",
  "short": "Варена бавовна",
  "fabric": "varena",
  "price": 2600,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/varena-bavovna-temno-siryi-1.jpg",
  "images": [
   "/assets/img/p/varena-bavovna-temno-siryi-1.jpg",
   "/assets/img/p/varena-bavovna-temno-siryi-2.jpg"
  ],
  "url": "/products/varena-bavovna-temno-siryi/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T19:00",
  "variants": [
   {
    "id": "2",
    "size": "2",
    "label": "Двоспальний",
    "sku": "8714",
    "price": 2600
   },
   {
    "id": "2l",
    "size": "2",
    "label": "Двоспальний з мереживом",
    "sku": "8814",
    "price": 3200
   },
   {
    "id": "e",
    "size": "e",
    "label": "Євро",
    "sku": "8714",
    "price": 2800
   },
   {
    "id": "el",
    "size": "e",
    "label": "Євро з мереживом",
    "sku": "8814",
    "price": 3500
   }
  ],
  "sup": "VT"
 },
 {
  "slug": "varena-bavovna-slyvovyi",
  "sku": "88118",
  "name": "Комплект із вареної бавовни · Сливовий",
  "short": "Варена бавовна",
  "fabric": "varena",
  "price": 3200,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/varena-bavovna-slyvovyi-1.jpg",
  "images": [
   "/assets/img/p/varena-bavovna-slyvovyi-1.jpg",
   "/assets/img/p/varena-bavovna-slyvovyi-2.jpg"
  ],
  "url": "/products/varena-bavovna-slyvovyi/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T19:00",
  "variants": [
   {
    "id": "2l",
    "size": "2",
    "label": "Двоспальний з мереживом",
    "sku": "88118",
    "price": 3200
   }
  ],
  "sup": "VT"
 },
 {
  "slug": "varena-bavovna-blakytnyi",
  "sku": "88121",
  "name": "Комплект із вареної бавовни · Блакитний",
  "short": "Варена бавовна",
  "fabric": "varena",
  "price": 3200,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/varena-bavovna-blakytnyi-1.jpg",
  "images": [
   "/assets/img/p/varena-bavovna-blakytnyi-1.jpg",
   "/assets/img/p/varena-bavovna-blakytnyi-2.jpg"
  ],
  "url": "/products/varena-bavovna-blakytnyi/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T19:00",
  "variants": [
   {
    "id": "2l",
    "size": "2",
    "label": "Двоспальний з мереживом",
    "sku": "88121",
    "price": 3200
   },
   {
    "id": "el",
    "size": "e",
    "label": "Євро з мереживом",
    "sku": "88121",
    "price": 3500
   }
  ],
  "sup": "VT"
 },
 {
  "slug": "straip-satyn-bezhevyi",
  "sku": "541209",
  "name": "Комплект зі страйп-сатину · Бежевий",
  "short": "Страйп-сатин",
  "fabric": "stripe",
  "price": 2300,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/straip-satyn-bezhevyi-1.jpg",
  "images": [
   "/assets/img/p/straip-satyn-bezhevyi-1.jpg",
   "/assets/img/p/straip-satyn-bezhevyi-2.jpg",
   "/assets/img/p/straip-satyn-bezhevyi-3.jpg"
  ],
  "url": "/products/straip-satyn-bezhevyi/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T19:00",
  "variants": [
   {
    "id": "2",
    "size": "2",
    "label": "Двоспальний",
    "sku": "541209",
    "price": 2300
   },
   {
    "id": "e",
    "size": "e",
    "label": "Євро",
    "sku": "541209",
    "price": 2500
   },
   {
    "id": "s",
    "size": "s",
    "label": "Сімейний",
    "sku": "541209",
    "price": 2900
   }
  ],
  "sup": "VT"
 },
 {
  "slug": "straip-satyn-molochnyi",
  "sku": "54001",
  "name": "Комплект зі страйп-сатину · Молочний",
  "short": "Страйп-сатин",
  "fabric": "stripe",
  "price": 2100,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/straip-satyn-molochnyi-1.jpg",
  "images": [
   "/assets/img/p/straip-satyn-molochnyi-1.jpg"
  ],
  "url": "/products/straip-satyn-molochnyi/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T19:00",
  "variants": [
   {
    "id": "15",
    "size": "15",
    "label": "Півтораспальний",
    "sku": "54001",
    "price": 2100
   },
   {
    "id": "2",
    "size": "2",
    "label": "Двоспальний",
    "sku": "54001",
    "price": 2300
   },
   {
    "id": "e",
    "size": "e",
    "label": "Євро",
    "sku": "54001",
    "price": 2500
   }
  ],
  "sup": "VT"
 },
 {
  "slug": "straip-satyn-pudrovyi",
  "sku": "54005",
  "name": "Комплект зі страйп-сатину · Пудровий",
  "short": "Страйп-сатин",
  "fabric": "stripe",
  "price": 2300,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/straip-satyn-pudrovyi-1.jpg",
  "images": [
   "/assets/img/p/straip-satyn-pudrovyi-1.jpg"
  ],
  "url": "/products/straip-satyn-pudrovyi/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T19:00",
  "variants": [
   {
    "id": "2",
    "size": "2",
    "label": "Двоспальний",
    "sku": "54005",
    "price": 2300
   }
  ],
  "sup": "VT"
 },
 {
  "slug": "straip-satyn-bilyi",
  "sku": "54321",
  "name": "Комплект зі страйп-сатину · Білий",
  "short": "Страйп-сатин",
  "fabric": "stripe",
  "price": 2300,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/straip-satyn-bilyi-1.jpg",
  "images": [
   "/assets/img/p/straip-satyn-bilyi-1.jpg",
   "/assets/img/p/straip-satyn-bilyi-2.jpg"
  ],
  "url": "/products/straip-satyn-bilyi/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T19:00",
  "variants": [
   {
    "id": "2",
    "size": "2",
    "label": "Двоспальний",
    "sku": "54321",
    "price": 2300
   },
   {
    "id": "e",
    "size": "e",
    "label": "Євро",
    "sku": "54321",
    "price": 2500
   }
  ],
  "sup": "VT"
 },
 {
  "slug": "straip-satyn-olyvkovyi",
  "sku": "54020",
  "name": "Комплект зі страйп-сатину · Оливковий",
  "short": "Страйп-сатин",
  "fabric": "stripe",
  "price": 2300,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/straip-satyn-olyvkovyi-1.jpg",
  "images": [
   "/assets/img/p/straip-satyn-olyvkovyi-1.jpg"
  ],
  "url": "/products/straip-satyn-olyvkovyi/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T19:00",
  "variants": [
   {
    "id": "2",
    "size": "2",
    "label": "Двоспальний",
    "sku": "54020",
    "price": 2300
   },
   {
    "id": "s",
    "size": "s",
    "label": "Сімейний",
    "sku": "54020",
    "price": 2900
   }
  ],
  "sup": "VT"
 },
 {
  "slug": "straip-satyn-shokoladnyi",
  "sku": "54024",
  "name": "Комплект зі страйп-сатину · Шоколадний",
  "short": "Страйп-сатин",
  "fabric": "stripe",
  "price": 2300,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/straip-satyn-shokoladnyi-1.jpg",
  "images": [
   "/assets/img/p/straip-satyn-shokoladnyi-1.jpg"
  ],
  "url": "/products/straip-satyn-shokoladnyi/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T19:00",
  "variants": [
   {
    "id": "2",
    "size": "2",
    "label": "Двоспальний",
    "sku": "54024",
    "price": 2300
   }
  ],
  "sup": "VT"
 },
 {
  "slug": "straip-satyn-buzkovyi",
  "sku": "54021",
  "name": "Комплект зі страйп-сатину · Бузковий",
  "short": "Страйп-сатин",
  "fabric": "stripe",
  "price": 2300,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/straip-satyn-buzkovyi-1.jpg",
  "images": [
   "/assets/img/p/straip-satyn-buzkovyi-1.jpg"
  ],
  "url": "/products/straip-satyn-buzkovyi/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T19:00",
  "variants": [
   {
    "id": "2",
    "size": "2",
    "label": "Двоспальний",
    "sku": "54021",
    "price": 2300
   }
  ],
  "sup": "VT"
 },
 {
  "slug": "satyn-odnotonnyi-pudra",
  "sku": "191605",
  "name": "Комплект з однотонного сатину · Пудра",
  "short": "Однотонний сатин",
  "fabric": "satin",
  "price": 2300,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/satyn-odnotonnyi-pudra-1.jpg",
  "images": [
   "/assets/img/p/satyn-odnotonnyi-pudra-1.jpg",
   "/assets/img/p/satyn-odnotonnyi-pudra-2.jpg"
  ],
  "url": "/products/satyn-odnotonnyi-pudra/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T19:00",
  "variants": [
   {
    "id": "2",
    "size": "2",
    "label": "Двоспальний",
    "sku": "191605",
    "price": 2300
   },
   {
    "id": "e",
    "size": "e",
    "label": "Євро",
    "sku": "191605",
    "price": 2500
   }
  ],
  "sup": "VT"
 },
 {
  "slug": "pled-flisovyi-zaichyky",
  "sku": "1151",
  "name": "Флісовий плед · Зайчики",
  "short": "Флісовий плед",
  "fabric": "plaid",
  "price": 1300,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/pled-flisovyi-zaichyky-1.jpg",
  "images": [
   "/assets/img/p/pled-flisovyi-zaichyky-1.jpg"
  ],
  "url": "/products/pled-flisovyi-zaichyky/",
  "cat": [
   "plaids"
  ],
  "added": "2026-11-16T19:00",
  "variants": [
   {
    "id": "2",
    "size": "2",
    "label": "Двоспальний",
    "sku": "1151",
    "price": 1300
   }
  ],
  "sup": "VT"
 },
 {
  "slug": "pled-flisovyi-sertsia",
  "sku": "11100",
  "name": "Флісовий плед · Сердечка",
  "short": "Флісовий плед",
  "fabric": "plaid",
  "price": 1300,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/pled-flisovyi-sertsia-1.jpg",
  "images": [
   "/assets/img/p/pled-flisovyi-sertsia-1.jpg",
   "/assets/img/p/pled-flisovyi-sertsia-2.jpg"
  ],
  "url": "/products/pled-flisovyi-sertsia/",
  "cat": [
   "plaids"
  ],
  "added": "2026-11-16T19:00",
  "variants": [
   {
    "id": "2",
    "size": "2",
    "label": "Двоспальний",
    "sku": "11100",
    "price": 1300
   }
  ],
  "sup": "VT"
 },
 {
  "slug": "biaz-gold-smuzhka-sira",
  "sku": "AZ-G01",
  "name": "Комплект з бязі Gold · Смужка сіра",
  "short": "Бязь Gold",
  "fabric": "gold",
  "price": 1300,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/biaz-gold-smuzhka-sira-1.jpg",
  "images": [
   "/assets/img/p/biaz-gold-smuzhka-sira-1.jpg",
   "/assets/img/p/biaz-gold-smuzhka-sira-2.jpg",
   "/assets/img/p/biaz-gold-smuzhka-sira-3.jpg",
   "/assets/img/p/biaz-gold-smuzhka-sira-4.jpg"
  ],
  "url": "/products/biaz-gold-smuzhka-sira/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T20:00",
  "variants": [
   {
    "id": "15",
    "size": "15",
    "label": "Півтораспальний",
    "sku": "AZ-G01",
    "price": 1300
   },
   {
    "id": "2",
    "size": "2",
    "label": "Двоспальний",
    "sku": "AZ-G01",
    "price": 1400
   },
   {
    "id": "e",
    "size": "e",
    "label": "Євро",
    "sku": "AZ-G01",
    "price": 1400
   },
   {
    "id": "s",
    "size": "s",
    "label": "Сімейний",
    "sku": "AZ-G01",
    "price": 1600
   }
  ],
  "sup": "AZ"
 },
 {
  "slug": "biaz-gold-smuzhka-chorno-sira",
  "sku": "AZ-G02",
  "name": "Комплект з бязі Gold · Смужка чорно-сіра",
  "short": "Бязь Gold",
  "fabric": "gold",
  "price": 1300,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/biaz-gold-smuzhka-chorno-sira-1.jpg",
  "images": [
   "/assets/img/p/biaz-gold-smuzhka-chorno-sira-1.jpg",
   "/assets/img/p/biaz-gold-smuzhka-chorno-sira-2.jpg",
   "/assets/img/p/biaz-gold-smuzhka-chorno-sira-3.jpg",
   "/assets/img/p/biaz-gold-smuzhka-chorno-sira-4.jpg"
  ],
  "url": "/products/biaz-gold-smuzhka-chorno-sira/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T20:00",
  "variants": [
   {
    "id": "15",
    "size": "15",
    "label": "Півтораспальний",
    "sku": "AZ-G02",
    "price": 1300
   },
   {
    "id": "2",
    "size": "2",
    "label": "Двоспальний",
    "sku": "AZ-G02",
    "price": 1400
   },
   {
    "id": "e",
    "size": "e",
    "label": "Євро",
    "sku": "AZ-G02",
    "price": 1400
   },
   {
    "id": "s",
    "size": "s",
    "label": "Сімейний",
    "sku": "AZ-G02",
    "price": 1600
   }
  ],
  "sup": "AZ"
 },
 {
  "slug": "biaz-gold-smuzhka-bezh",
  "sku": "AZ-G03",
  "name": "Комплект з бязі Gold · Смужка бежева",
  "short": "Бязь Gold",
  "fabric": "gold",
  "price": 1300,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/biaz-gold-smuzhka-bezh-1.jpg",
  "images": [
   "/assets/img/p/biaz-gold-smuzhka-bezh-1.jpg",
   "/assets/img/p/biaz-gold-smuzhka-bezh-2.jpg",
   "/assets/img/p/biaz-gold-smuzhka-bezh-3.jpg",
   "/assets/img/p/biaz-gold-smuzhka-bezh-4.jpg"
  ],
  "url": "/products/biaz-gold-smuzhka-bezh/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T20:00",
  "variants": [
   {
    "id": "15",
    "size": "15",
    "label": "Півтораспальний",
    "sku": "AZ-G03",
    "price": 1300
   },
   {
    "id": "2",
    "size": "2",
    "label": "Двоспальний",
    "sku": "AZ-G03",
    "price": 1400
   },
   {
    "id": "e",
    "size": "e",
    "label": "Євро",
    "sku": "AZ-G03",
    "price": 1400
   },
   {
    "id": "s",
    "size": "s",
    "label": "Сімейний",
    "sku": "AZ-G03",
    "price": 1600
   }
  ],
  "sup": "AZ"
 },
 {
  "slug": "biaz-gold-smuzhka-temno-zelena",
  "sku": "AZ-G04",
  "name": "Комплект з бязі Gold · Смужка темно-зелена",
  "short": "Бязь Gold",
  "fabric": "gold",
  "price": 1300,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/biaz-gold-smuzhka-temno-zelena-1.jpg",
  "images": [
   "/assets/img/p/biaz-gold-smuzhka-temno-zelena-1.jpg",
   "/assets/img/p/biaz-gold-smuzhka-temno-zelena-2.jpg",
   "/assets/img/p/biaz-gold-smuzhka-temno-zelena-3.jpg",
   "/assets/img/p/biaz-gold-smuzhka-temno-zelena-4.jpg"
  ],
  "url": "/products/biaz-gold-smuzhka-temno-zelena/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T20:00",
  "variants": [
   {
    "id": "15",
    "size": "15",
    "label": "Півтораспальний",
    "sku": "AZ-G04",
    "price": 1300
   },
   {
    "id": "2",
    "size": "2",
    "label": "Двоспальний",
    "sku": "AZ-G04",
    "price": 1400
   },
   {
    "id": "e",
    "size": "e",
    "label": "Євро",
    "sku": "AZ-G04",
    "price": 1400
   },
   {
    "id": "s",
    "size": "s",
    "label": "Сімейний",
    "sku": "AZ-G04",
    "price": 1600
   }
  ],
  "sup": "AZ"
 },
 {
  "slug": "biaz-gold-karat-siryi",
  "sku": "AZ-G05",
  "name": "Комплект з бязі Gold · Карат сірий",
  "short": "Бязь Gold",
  "fabric": "gold",
  "price": 1300,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/biaz-gold-karat-siryi-1.jpg",
  "images": [
   "/assets/img/p/biaz-gold-karat-siryi-1.jpg",
   "/assets/img/p/biaz-gold-karat-siryi-2.jpg",
   "/assets/img/p/biaz-gold-karat-siryi-3.jpg",
   "/assets/img/p/biaz-gold-karat-siryi-4.jpg"
  ],
  "url": "/products/biaz-gold-karat-siryi/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T20:00",
  "variants": [
   {
    "id": "15",
    "size": "15",
    "label": "Півтораспальний",
    "sku": "AZ-G05",
    "price": 1300
   },
   {
    "id": "2",
    "size": "2",
    "label": "Двоспальний",
    "sku": "AZ-G05",
    "price": 1400
   },
   {
    "id": "e",
    "size": "e",
    "label": "Євро",
    "sku": "AZ-G05",
    "price": 1400
   },
   {
    "id": "s",
    "size": "s",
    "label": "Сімейний",
    "sku": "AZ-G05",
    "price": 1600
   }
  ],
  "sup": "AZ"
 },
 {
  "slug": "biaz-gold-karat-zelenyi",
  "sku": "AZ-G06",
  "name": "Комплект з бязі Gold · Карат зелений",
  "short": "Бязь Gold",
  "fabric": "gold",
  "price": 1300,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/biaz-gold-karat-zelenyi-1.jpg",
  "images": [
   "/assets/img/p/biaz-gold-karat-zelenyi-1.jpg",
   "/assets/img/p/biaz-gold-karat-zelenyi-2.jpg",
   "/assets/img/p/biaz-gold-karat-zelenyi-3.jpg",
   "/assets/img/p/biaz-gold-karat-zelenyi-4.jpg"
  ],
  "url": "/products/biaz-gold-karat-zelenyi/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T20:00",
  "variants": [
   {
    "id": "15",
    "size": "15",
    "label": "Півтораспальний",
    "sku": "AZ-G06",
    "price": 1300
   },
   {
    "id": "2",
    "size": "2",
    "label": "Двоспальний",
    "sku": "AZ-G06",
    "price": 1400
   },
   {
    "id": "e",
    "size": "e",
    "label": "Євро",
    "sku": "AZ-G06",
    "price": 1400
   },
   {
    "id": "s",
    "size": "s",
    "label": "Сімейний",
    "sku": "AZ-G06",
    "price": 1600
   }
  ],
  "sup": "AZ"
 },
 {
  "slug": "straip-satyn-siryi",
  "sku": "AZ-S01",
  "name": "Комплект зі страйп-сатину · Сірий",
  "short": "Страйп-сатин",
  "fabric": "stripe_a",
  "price": 1200,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/straip-satyn-siryi-1.jpg",
  "images": [
   "/assets/img/p/straip-satyn-siryi-1.jpg",
   "/assets/img/p/straip-satyn-siryi-2.jpg"
  ],
  "url": "/products/straip-satyn-siryi/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T20:00",
  "variants": [
   {
    "id": "15",
    "size": "15",
    "label": "Півтораспальний",
    "sku": "AZ-S01",
    "price": 1200
   },
   {
    "id": "2",
    "size": "2",
    "label": "Двоспальний",
    "sku": "AZ-S01",
    "price": 1300
   },
   {
    "id": "e",
    "size": "e",
    "label": "Євро",
    "sku": "AZ-S01",
    "price": 1300
   },
   {
    "id": "s",
    "size": "s",
    "label": "Сімейний",
    "sku": "AZ-S01",
    "price": 1500
   }
  ],
  "sup": "AZ"
 },
 {
  "slug": "straip-satyn-svitlo-siryi",
  "sku": "AZ-S02",
  "name": "Комплект зі страйп-сатину · Світло-сірий",
  "short": "Страйп-сатин",
  "fabric": "stripe_a",
  "price": 1300,
  "oldPrice": null,
  "inStock": true,
  "image": "/assets/img/p/straip-satyn-svitlo-siryi-1.jpg",
  "images": [
   "/assets/img/p/straip-satyn-svitlo-siryi-1.jpg",
   "/assets/img/p/straip-satyn-svitlo-siryi-2.jpg"
  ],
  "url": "/products/straip-satyn-svitlo-siryi/",
  "cat": [
   "sets"
  ],
  "added": "2026-11-16T20:00",
  "variants": [
   {
    "id": "2",
    "size": "2",
    "label": "Двоспальний",
    "sku": "AZ-S02",
    "price": 1300
   },
   {
    "id": "e",
    "size": "e",
    "label": "Євро",
    "sku": "AZ-S02",
    "price": 1300
   },
   {
    "id": "s",
    "size": "s",
    "label": "Сімейний",
    "sku": "AZ-S02",
    "price": 1500
   }
  ],
  "sup": "AZ"
 }
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
