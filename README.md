# WarmHome UA — лендинг

Сайт: https://warmhome.in.ua (GitHub Pages)

- `index.html` — сторінка
- `assets/tw.css` — зібраний Tailwind CSS (генерується, руками не редагувати)
- `assets/icons.js` — лише ті іконки Lucide, що використовуються на сторінці

## Перезбірка стилів після зміни класів у HTML

```
npx tailwindcss@3 -c tailwind.config.js -i assets/tw.src.css -o assets/tw.css --minify
```
