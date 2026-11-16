# WarmHome UA — постільна білизна та пледи

Сайт: https://warmhome.in.ua (GitHub Pages)

- `index.html` — головна: перший екран, категорії, картки товарів, доставка, питання
- `assets/home.css` — усі стилі (теплі бежеві кольори задані змінними на початку файлу)
- `assets/products.js` — список товарів і категорій; з нього будуються категорії й картки на головній
- `404.html` — сторінка «не знайдено» (сюди потрапляють і старі посилання на товари)
- `tools/make_feed.py` — фід для магазину Facebook/Instagram (`feed/facebook.csv`)
- `assets/cart.js` — кошик і відправка заявок у Google-таблицю + Telegram (підключається, коли зʼявляться сторінки товарів)

## Як додати товар

1. Створити сторінку `products/<slug>/index.html` з `<meta name="description">`.
2. Додати блок товару в `assets/products.js` (поле `cat`: `sets`, `sheets`, `pillowcases` або `plaids`).
3. Запустити `python3 tools/make_feed.py` і закомітити зміни.
