# WarmHome UA — лендинг

Сайт: https://warmhome.in.ua (GitHub Pages)

- `index.html` — сторінка
- `assets/tw.css` — зібраний Tailwind CSS (генерується, руками не редагувати)
- `assets/icons.js` — лише ті іконки Lucide, що використовуються на сторінці

## Перезбірка стилів після зміни класів у HTML

```
npx tailwindcss@3 -c tailwind.config.js -i assets/tw.src.css -o assets/tw.css --minify
```

Після перезбірки оновіть `?v=...` у посиланнях на `assets/tw.css` та `assets/icons.js` в `index.html`, щоб браузери не брали стару версію з кешу.

## Каталог і нові товари

- `assets/products.js` — список усіх товарів. З нього автоматично будуються сторінка **/catalog/** і блок **«Дивіться також»**.
- Головна сторінка (`/`) — це сторінка обігрівача (`slug: obigrivach-kamin-900`).
- Новий товар: окрема сторінка `products/<slug>.html` (на основі `index.html`, у секції `#related` вказати `data-current="<slug>"`) + рядок у `assets/products.js`.
- Блок «Дивіться також» прихований, поки на сайті лише один товар.
