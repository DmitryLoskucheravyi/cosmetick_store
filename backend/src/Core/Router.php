<?php

declare(strict_types=1);

namespace Vt241\Backend\Core;

/**
 * Minimal request router: registers "METHOD /path/{param}" patterns and
 * dispatches a Request to the matching handler. Fixes bug #5 from
 * REVIEW.md — unmatched routes now get a real 404/405 instead of an
 * empty 200 response.
 */
final class Router
{
    /** @var array<int, array{method: string, regex: string, params: string[], handler: callable}> */
    private array $routes = [];

    public function add(string $method, string $pattern, callable $handler): void
    {
        $paramNames = [];

        $regex = preg_replace_callback(
            '#\{(\w+)\}#',
            function (array $matches) use (&$paramNames): string {
                $paramNames[] = $matches[1];

                return '([^/]+)';
            },
            $pattern
        );

        $this->routes[] = [
            'method' => strtoupper($method),
            'regex' => '#^' . $regex . '$#',
            'params' => $paramNames,
            'handler' => $handler,
        ];
    }

    public function dispatch(Request $request): Response
    {
        $method = $request->method();
        $path = rtrim($request->path(), '/');
        $path = $path === '' ? '/' : $path;

        $pathMatched = false;

        foreach ($this->routes as $route) {
            if (!preg_match($route['regex'], $path, $matches)) {
                continue;
            }

            $pathMatched = true;

            if ($route['method'] !== $method) {
                continue;
            }

            array_shift($matches);
            $params = array_combine($route['params'], $matches);

            return ($route['handler'])($request, $params);
        }

        return $pathMatched
            ? Response::error('Method not allowed', 405)
            : Response::error('Route not found', 404);
    }
}
