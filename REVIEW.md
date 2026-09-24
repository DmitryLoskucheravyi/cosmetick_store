> ✅ Усе нижче виправлено. Новий код — у `backend/src/` (суворе ООП: класи, DI, репозиторії, сервіси, enum, винятки), старі процедурні файли (`backend/controllers`, `middleware`, `helpers`, `routes`, `config`) більше не використовуються.

# Огляд бекенду pomu: баги, недоліки, ООП

## Критичні

### 1. Через завантаження картинки можна залити і виконати PHP-файл
[backend/helpers/uploadHelper.php](backend/helpers/uploadHelper.php#L18-L30)

- **Проблема:** розширення береться з імені файлу і не перевіряється. Файл `shell.php` збережеться, і на Apache виконається як код.
- **Як виправити:**
  - дозволити лише розширення зі списку `jpg`, `jpeg`, `png`, `webp`;
  - перевіряти реальний тип файлу через `finfo_file()`;
  - перевіряти `$file['error'] === UPLOAD_ERR_OK` і результат `move_uploaded_file`;
  - ставити права `0755`, а не `0777`;
  - покласти в `uploads/` файл `.htaccess` з рядком `php_flag engine off`.

### 2. Замовлення створюється без транзакції
[backend/controllers/orderController.php](backend/controllers/orderController.php#L39-L104)

- **Проблема:** якщо запит впаде посередині, лишиться замовлення без позицій. Два одночасні замовлення можуть загнати залишок у мінус.
- **Як виправити:**
  - обгорнути все в `beginTransaction()` / `commit()`, а при помилці робити `rollBack()`;
  - читати кошик через `SELECT ... FOR UPDATE`;
  - списувати залишок запитом `UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?` і перевіряти `rowCount()`.

### 3. Видалення товару стирає історію замовлень
[scheme.sql](scheme.sql#L34)

- **Проблема:** у `order_items.productId` стоїть `ON DELETE CASCADE`.
- **Як виправити:** замінити на `ON DELETE RESTRICT` і додати м'яке видалення: поле `products.isActive` замість `DELETE`.

### 4. Авторизація працює лише із заголовком `Authorization` з великої літери
[backend/middleware/authMiddleware.php](backend/middleware/authMiddleware.php#L24-L32)

- **Проблема:** повторна перевірка `isset($headers['Authorization'])` відкидає заголовок `authorization` у нижньому регістрі.
- **Як виправити:** видалити рядки 24–32 і використовувати вже знайдений `$authHeader`. Для вилучення токена краще `preg_match('/^Bearer\s+(.+)$/i', ...)`.

## Суттєві

### 5. Невідомі маршрути повертають порожній `200`
[backend/server.php](backend/server.php#L45-L90), [backend/routes/userRoutes.php](backend/routes/userRoutes.php)

- **Як виправити:** у кінці кожного файлу роутів викликати `ResponseHelper::error("Route not found", 404)`. Порожній `userRoutes.php` видалити або заповнити.

### 6. Необроблені винятки PDO дають 500 з порожнім тілом
Приклади: видалення категорії, в якій є товари; додавання в кошик товару, якого не існує.

- **Як виправити:** у `server.php` додати `set_exception_handler()`, який віддає JSON. `PDOException` з кодом `23000` віддавати як 409 або 400.

### 7. Помилка підключення до БД виводиться через `die()`
[backend/config/database.php](backend/config/database.php#L33)

- **Проблема:** відповідь приходить з кодом 200, це не JSON, і в тексті видно хост і користувача бази.
- **Як виправити:** кидати виняток, а в обробнику повертати `500 "Database unavailable"`.

### 8. Кількість у кошику не перевіряється
[backend/controllers/cartController.php](backend/controllers/cartController.php#L118-L140), [addToCart](backend/controllers/cartController.php#L51-L99)

- **Як виправити:**
  - кількість приводити до `int` і перевіряти, що вона від 1 до `stock`;
  - перед додаванням у кошик перевіряти, що товар існує і `stock > 0`.

### 9. Статус замовлення не перевіряється
[backend/controllers/orderController.php](backend/controllers/orderController.php#L230-L249)

- **Як виправити:**
  - дозволяти лише `pending`, `processing`, `shipped`, `delivered`, `cancelled`;
  - при переході в `cancelled` повертати товар на склад.

### 10. Створення товару без картинки записує шлях `xxx.` до файлу, якого немає
[backend/controllers/productController.php](backend/controllers/productController.php#L209)

- **Як виправити:** умову `isset($_FILES['image'])` замінити на `!empty($_FILES['image']['tmp_name'])`.

### 11. `updateProduct` майже нічого не перевіряє
[backend/controllers/productController.php](backend/controllers/productController.php#L272-L316)

- **Як виправити:**
  - перевіряти поля так само, як у `createProduct`: `price > 0`, `stock >= 0`, `categoryId` існує;
  - ID брати з URL: `$productId` з роуту, а не `$_POST['id']`.

### 12. Параметр `limit` у каталозі нічим не обмежений
[backend/controllers/productController.php](backend/controllers/productController.php#L22)

- **Як виправити:**
  - обмежити значення: `min(50, max(1, (int)$limit))`;
  - запит на загальну кількість будувати окремо, а не через `str_replace` по тексту SQL;
  - `pages` повертати як `(int) ceil(...)`.

### 13. Роль береться з JWT, а не з БД
[backend/middleware/adminMiddleware.php](backend/middleware/adminMiddleware.php#L11)

- **Проблема:** якщо забрати в користувача права адміна, його токен ще 7 днів дає доступ до адмінки.
- **Як виправити:** в `AdminMiddleware` читати роль з БД за `id`, або скоротити час життя токена.

### 14. Пароль обрізається через `trim()`, мінімальної довжини немає
[backend/controllers/authController.php](backend/controllers/authController.php#L21)

- **Як виправити:** не застосовувати `trim` до пароля і вимагати довжину щонайменше 8 символів.

## Дрібні

| Що | Де | Як виправити |
|---|---|---|
| `autoload.php` підключається двічі | [server.php](backend/server.php#L21-L22) | прибрати дубль |
| `.env` завантажується двічі | [database.php](backend/config/database.php#L13) | завантажувати один раз у `server.php` |
| Блок `getOrder` дублюється | [orderRoutes.php](backend/routes/orderRoutes.php#L45-L55) | видалити другий блок |
| Зайві node-пакети в PHP-бекенді (`mongodb`, `multer`…) | [backend/package.json](backend/package.json) | прибрати `dependencies` |
| Непослідовні URL (`/categories/create`, `?id=` тощо) | [routes/](backend/routes/) | перейти на REST: `POST /categories`, `PUT /categories/{id}`, `DELETE /categories/{id}` |
| `sales` рахує й скасовані замовлення | [adminController.php](backend/controllers/adminController.php#L31) | додати `WHERE status != 'cancelled'` |
| CORS `*` разом із токеном у `localStorage` | [cors.php](backend/config/cors.php#L3) | дозволити конкретний origin |
| Розвалені відступи | `getProducts`, `getCart`, `getOrder`, `AuthMiddleware` | прогнати форматер (PHP-CS-Fixer) |

## ООП

Зараз це процедурний код, розкладений по класах: жоден об'єкт не створюється, всі методи статичні.

| Проблема | Як виправити |
|---|---|
| Усе статичне, класи жорстко зв'язані між собою | Звичайні класи з методами екземпляра; залежності передавати через конструктор (DI) |
| Контролер сам читає запит, перевіряє дані, пише SQL і формує відповідь | Розділити на шари: `Controller` → `Service` → `Repository` → `Entity` |
| Замість об'єктів скрізь асоціативні масиви | Сутності `Product`, `Order`, `User`, `CartItem`; value object `Money` |
| Статуси замовлення — довільні рядки | `enum OrderStatus: string` |
| Роути — процедурні `if` у файлах | Класи `Router`, `Request`, `Response` |
| `file_get_contents('php://input')` скопійовано в кожен метод | Метод `Request::json()` |
| `ResponseHelper` викликає `exit()` посеред логіки | Контролер повертає об'єкт `Response`, відправляє його один `Kernel` |
| Немає інтерфейсів | `ProductRepositoryInterface` тощо; контролери й сервіси залежать від інтерфейсів |
| Помилки через `die()` та `exit()` | Власні винятки `NotFoundException`, `ValidationException`, `ForbiddenException` + глобальний обробник |
| PSR-4 налаштований, але `src/` порожня, скрізь `require_once` | Перенести код у `src/` з простором імен `Vt241\Backend\...` |
| Немає типізації | `declare(strict_types=1)`, типи параметрів, повернення й властивостей |
| `Database` — статичний сінглтон, який сам читає `.env` | Клас `Database`, який отримує конфігурацію ззовні і створюється один раз у контейнері |
| Middleware — статичні методи | `interface Middleware { handle(Request $r, callable $next) }`, ланцюжок обробників |

### Цільова структура `src/`

```
src/
  Core/        Router, Request, Response, Kernel, Container
  Http/
    Controllers/  ProductController, OrderController, ...
    Middleware/   AuthMiddleware, AdminMiddleware
  Services/    AuthService, OrderService, CartService, ImageUploader
  Repositories/ ProductRepository, OrderRepository, ...
  Entities/    Product, Order, OrderItem, User
  Enums/       OrderStatus, UserRole
  Exceptions/  HttpException, NotFoundException, ValidationException
```
