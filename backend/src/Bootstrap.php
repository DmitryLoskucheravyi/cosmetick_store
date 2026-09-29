<?php

declare(strict_types=1);

namespace Vt241\Backend;

use Dotenv\Dotenv;
use Vt241\Backend\Core\Kernel;
use Vt241\Backend\Core\Response;
use Vt241\Backend\Core\Router;
use Vt241\Backend\Database\Database;
use Vt241\Backend\Http\Controllers\AdminController;
use Vt241\Backend\Http\Controllers\AuthController;
use Vt241\Backend\Http\Controllers\CartController;
use Vt241\Backend\Http\Controllers\CategoryController;
use Vt241\Backend\Http\Controllers\OrderController;
use Vt241\Backend\Http\Controllers\ProductController;
use Vt241\Backend\Http\Controllers\PromoController;
use Vt241\Backend\Http\Controllers\ReviewController;
use Vt241\Backend\Http\Middleware\AdminMiddleware;
use Vt241\Backend\Http\Middleware\AuthMiddleware;
use Vt241\Backend\Repositories\CartRepository;
use Vt241\Backend\Repositories\CategoryRepository;
use Vt241\Backend\Repositories\OrderRepository;
use Vt241\Backend\Repositories\ProductRepository;
use Vt241\Backend\Repositories\ReviewRepository;
use Vt241\Backend\Repositories\UserRepository;
use Vt241\Backend\Services\AuthService;
use Vt241\Backend\Services\CartService;
use Vt241\Backend\Services\CategoryService;
use Vt241\Backend\Services\ImageUploader;
use Vt241\Backend\Services\JwtService;
use Vt241\Backend\Services\OrderService;
use Vt241\Backend\Services\ProductService;
use Vt241\Backend\Services\PromoService;
use Vt241\Backend\Services\ReviewService;

/**
 * Composition root: loads config, wires every dependency through
 * constructors (no static singletons, see ООП table in REVIEW.md)
 * and registers all routes.
 */
final class Bootstrap
{
    public static function createKernel(string $backendRoot): Kernel
    {
        // safeLoad (not load): on hosts like Render, env vars are injected
        // directly by the platform and no .env file is shipped in the image.
        Dotenv::createImmutable($backendRoot)->safeLoad();

        self::sendCorsHeaders();

        $database = new Database(
            (string) $_ENV['DB_HOST'],
            (string) $_ENV['DB_PORT'],
            (string) $_ENV['DB_NAME'],
            (string) $_ENV['DB_USER'],
            (string) $_ENV['DB_PASSWORD']
        );

        $users = new UserRepository($database);
        $products = new ProductRepository($database);
        $categories = new CategoryRepository($database);
        $cart = new CartRepository($database);
        $orders = new OrderRepository($database);
        $reviews = new ReviewRepository($database);

        $jwt = new JwtService((string) $_ENV['JWT_SECRET']);
        $uploader = new ImageUploader($backendRoot);

        $authMiddleware = new AuthMiddleware($jwt, $users);
        $adminMiddleware = new AdminMiddleware($authMiddleware);

        $authController = new AuthController(new AuthService($users, $jwt), $authMiddleware);
        $productController = new ProductController(
            new ProductService($products, $categories, $uploader),
            $adminMiddleware
        );
        $categoryController = new CategoryController(new CategoryService($categories), $adminMiddleware);
        $cartController = new CartController(new CartService($cart, $products), $authMiddleware);
        $promoService = new PromoService();
        $orderController = new OrderController(
            new OrderService($database, $orders, $cart, $products, $promoService),
            $authMiddleware,
            $adminMiddleware
        );
        $adminController = new AdminController($adminMiddleware, $products, $categories, $users, $orders);
        $reviewController = new ReviewController(new ReviewService($reviews, $products), $authMiddleware);
        $promoController = new PromoController($promoService);

        return new Kernel(self::buildRouter(
            $authController,
            $productController,
            $categoryController,
            $cartController,
            $orderController,
            $adminController,
            $reviewController,
            $promoController
        ));
    }

    private static function buildRouter(
        AuthController $auth,
        ProductController $products,
        CategoryController $categories,
        CartController $cart,
        OrderController $orders,
        AdminController $admin,
        ReviewController $reviews,
        PromoController $promo
    ): Router {
        $router = new Router();

        $router->add('GET', '/api', fn () => Response::success([], 'Cosmetics Shop API Running'));

        $router->add('POST', '/api/auth/register', fn ($req) => $auth->register($req));
        $router->add('POST', '/api/auth/login', fn ($req) => $auth->login($req));
        $router->add('GET', '/api/auth/me', fn ($req) => $auth->me($req));

        $router->add('GET', '/api/products', fn ($req) => $products->index($req));
        $router->add('POST', '/api/products', fn ($req) => $products->store($req));
        // Registered before {id}: the router matches routes in registration
        // order and {id} would otherwise swallow "price-range" as its param.
        $router->add('GET', '/api/products/price-range', fn ($req) => $products->priceRange($req));
        $router->add('GET', '/api/products/{id}', fn ($req, $p) => $products->show($req, $p));
        // POST (not PUT) on purpose: PHP's built-in server only populates
        // $_POST/$_FILES for multipart bodies on POST requests.
        $router->add('POST', '/api/products/{id}', fn ($req, $p) => $products->update($req, $p));
        $router->add('DELETE', '/api/products/{id}', fn ($req, $p) => $products->destroy($req, $p));

        $router->add('GET', '/api/categories', fn ($req) => $categories->index($req));
        $router->add('POST', '/api/categories', fn ($req) => $categories->store($req));
        $router->add('PUT', '/api/categories/{id}', fn ($req, $p) => $categories->update($req, $p));
        $router->add('DELETE', '/api/categories/{id}', fn ($req, $p) => $categories->destroy($req, $p));

        $router->add('GET', '/api/cart', fn ($req) => $cart->index($req));
        $router->add('POST', '/api/cart', fn ($req) => $cart->store($req));
        $router->add('DELETE', '/api/cart', fn ($req) => $cart->clear($req));
        $router->add('PUT', '/api/cart/{productId}', fn ($req, $p) => $cart->update($req, $p));
        $router->add('DELETE', '/api/cart/{productId}', fn ($req, $p) => $cart->destroy($req, $p));

        $router->add('POST', '/api/orders', fn ($req) => $orders->store($req));
        $router->add('GET', '/api/orders/my', fn ($req) => $orders->myOrders($req));
        $router->add('GET', '/api/orders', fn ($req) => $orders->index($req));
        $router->add('PUT', '/api/orders/{id}/status', fn ($req, $p) => $orders->updateStatus($req, $p));
        $router->add('GET', '/api/orders/{id}', fn ($req, $p) => $orders->show($req, $p));

        $router->add('GET', '/api/admin/dashboard', fn ($req) => $admin->dashboard($req));

        $router->add('GET', '/api/products/{id}/reviews', fn ($req, $p) => $reviews->index($req, $p));
        $router->add('POST', '/api/products/{id}/reviews', fn ($req, $p) => $reviews->store($req, $p));

        $router->add('POST', '/api/promo/validate', fn ($req) => $promo->validate($req));

        return $router;
    }

    /** Fixes the "дрібниця" item: origin is configurable, '*' stays the default for local dev. */
    private static function sendCorsHeaders(): void
    {
        $allowedOrigin = $_ENV['ALLOWED_ORIGIN'] ?? '*';

        header("Access-Control-Allow-Origin: {$allowedOrigin}");
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

        if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
    }
}
