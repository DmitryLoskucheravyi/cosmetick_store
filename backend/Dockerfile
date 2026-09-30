FROM php:8.3-cli

RUN apt-get update && apt-get install -y --no-install-recommends unzip libzip-dev \
    && docker-php-ext-install pdo pdo_mysql zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

COPY . .

RUN mkdir -p uploads/products && chmod -R 755 uploads

# Render injects PORT at runtime; 10000 is only the local/default fallback.
ENV PORT=10000
EXPOSE 10000

CMD ["sh", "-c", "php -d display_errors=0 -d log_errors=1 -S 0.0.0.0:${PORT} server.php"]
