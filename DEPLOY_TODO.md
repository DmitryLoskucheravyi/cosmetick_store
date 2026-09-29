# Deploy TODO — cosmetics-shop

Статус: **задеплоєно і перевірено, живе в проді.**

## Живі адреси

- Frontend: https://frontend-dmitryloskucheravyi.vercel.app
- Backend: https://cosmetics-backend-wk8k.onrender.com (API під `/api`)
- MySQL: Aiven, сервіс `cosmetics-shop-db` (регіон `do-fra`), база `cosmetics_shop`

## Зроблено

- [x] `backend/Dockerfile` — образ на `php:8.3-cli`, ставить `pdo_mysql` + `zip`, composer install, слухає `$PORT`.
- [x] `backend/.dockerignore` — виключає `vendor`, `.env`, `.env.production`; продуктові зображення (`uploads/products`) навмисно **включені** в образ, бо диск на Render free tier ефемерний — усе, що не в образі, не переживе рестарт контейнера.
- [x] `backend/src/Bootstrap.php` — `Dotenv::load()` → `Dotenv::safeLoad()` (Render передає env-змінні напряму, без `.env`-файлу в контейнері).
- [x] `frontend/src/api/axios.js` — **виправлено баг**: `baseURL` був захардкоджений на `/api` (розраховував на vite-проксі, якого немає в проді). Тепер читає `import.meta.env.VITE_API_URL`, фолбек `/api` для локальної розробки.
- [x] Образ запушено в GHCR (`ghcr.io/dmitryloskucheravyi/cosmetics-backend:latest`), приватний — Render тягне його через registry credential (`rgc-datnv69srm7s739f3c4g`), публікацію пакета свідомо не робили (заблоковано захистом, і так безпечніше).
- [x] Render web service `cosmetics-backend` (free plan, Frankfurt) створено через API, env vars виставлені (DB_*, JWT_SECRET, ALLOWED_ORIGIN).
- [x] Aiven MySQL `free-1-1gb` створено через API; схема (`scheme.sql`, без legacy-міграційного блоку `ALTER ... ADD COLUMN IF NOT EXISTS`, який не приймався на MySQL 8.4) накачена.
- [x] Дані каталогу (91 товар, 9 категорій) перенесено з локальної БД на Aiven.
- [x] Vercel-проєкт `frontend` створено й задеплоєно (CLI, без git-інтеграції — не вдалось підключити GitHub автоматично, не критично).
- [x] `VITE_API_URL` виставлено на Vercel (production+preview) = `https://cosmetics-backend-wk8k.onrender.com/api`.
- [x] Deployment Protection (Vercel SSO-заглушка) вимкнено вручну користувачем — сайт публічний.
- [x] Наскрізна перевірка через Playwright: головна сторінка рендериться, каталог/категорії підвантажуються з продового бекенда, 0 помилок у консолі, зображення (локальні + Unsplash) віддаються 200.

## Пост-деплой баги, знайдені і виправлені на живому сайті

- [x] `frontend/vercel.json` (новий файл) — Vercel без рерайту віддавав **404 на будь-якому прямому переході/оновленні сторінки**, крім `/` (напр. `/catalog`, `/products/63` напряму чи по F5). Додано `{"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]}`, щоб SPA-роутинг React Router обробляв усі шляхи.
- [x] `frontend/src/redux/product/productSlice.js` + `frontend/src/pages/Home.jsx` — Home і Catalog ділили один Redux-стан (`state.products.products`). При переході Home → Catalog компонент Catalog встигав відрендеритись зі старим списком Home ще до власного ефекту скидання/перезавантаження — саме цей проміжний кадр потрапляв у вікно знімка View Transition API і викликав `Unexpected duplicate view-transition-name`. Винесено окремий стан `homeProducts`/`getHomeProducts`, повністю ізольований від Catalog.
- [x] `frontend/src/hooks/useViewTransitionLocation.js` — додано guard проти паралельних transition (швидка подвійна навігація) і `.catch()` на `transition.finished`, щоб очікувані аборти не спливали як необроблені Promise-помилки в консолі.
- [x] Перевірено Playwright: Home → Catalog → 3 різні товари → прямий deep-link + reload → назад на Home — 0 помилок у консолі.
- Пояснено користувачу окремо: помилки `Cannot read properties of undefined (reading 'M_ID')` з файлу `200.js` — це НЕ код застосунку (Vite ніколи не генерує файл з такою назвою), а ін'єкція одного з браузерних розширень (шопінг/трекінг), що хукає `XMLHttpRequest`.
- [x] `frontend/src/hooks/useViewTransitionLocation.js` — react-router сам по собі не скролить сторінку нагору при навігації (типова SPA-пастка). Додано `window.scrollTo(0, 0)` при зміні `pathname` (навмисно НЕ при зміні самих query-параметрів, щоб не збивати скрол під час фільтрування в Catalog). Заразом з'ясувалось, що секція "New arrivals" на Home насправді підвантажувалась коректно — просто reveal-on-scroll анімація (`opacity: 0` до появи у в'юпорті) ніколи не спрацьовувала, якщо користувач потрапляв на Home вже проскрольненим вглиб (типово після навігації без скидання скролу) і фізично не проскролював через потрібну секцію. Скидання скролу на кожній навігації прибирає і цю проблему.
- [x] `frontend/src/components/common/ProductCardSkeleton.jsx` + `ProductGridSkeleton.jsx` (нові) — на першому заході на сайт Bestsellers і New Arrivals не мали зарезервованого місця, тож коли products підвантажувались (мережа + холодний старт Render), контент "стрибав" вставляючись у макет. Тепер `Home.jsx` показує скелетон-сітку (6 карток, повторює розмітку `ProductCard`) поки `homeLoading` true або дані ще не прийшли, тому висота секцій стабільна з першого пейнту. Перевірено зі штучним затримуванням `/api/products` через Playwright network route — скелетони показуються під час завантаження і чисто заміняються реальними картками без стрибка.

## Свідомо НЕ перенесено (рішення користувача)

- **Таблиці `users`, `cart`, `orders`, `reviews`** з локальної БД — дамп users заблокував захисний механізм (чутливі дані: email + хеші паролів вирушали б у зовнішню хмару). Перенесли лише `categories` + `products`.
  - Наслідок: на проді немає жодного акаунта (в т.ч. адмінського). Потрібно зареєструватись заново на живому сайті, і вручну підняти роль до `admin` в БД (через Aiven console або дати мені дозвіл підключитись).
  - Якщо потрібно перенести старих користувачів/відгуки — скажи явно, це свідома дія з чутливими даними.

## Відомі обмеження безкоштовних тарифів

- Render free web service «засинає» після ~15 хв без трафіку, перший запит після сну ~30-50с.
- Aiven free MySQL (`free-1-1gb`) — 1GB диска, вимикається при тривалій неактивності проєкту.
- Нові зображення товарів, завантажені через адмінку на проді, **не переживуть рестарт/редеплой контейнера** (ефемерний диск Render free tier) — для повноцінного продакшена варто винести аплоади в S3-сумісне сховище (напр. Cloudflare R2 free tier) — не робили, бо не просили.

## Токени, що використовувались у сесії

GitHub PAT, Render API key, Vercel API token, Aiven API token — усі передані користувачем напряму в чат. **Рекомендація: відкликати/перевипустити їх**, якщо більше не потрібні для подальших правок деплою.
