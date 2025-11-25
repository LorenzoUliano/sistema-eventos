FROM php:8.2-fpm-alpine AS base

RUN apk add --no-cache bash git unzip libpq icu-dev zlib-dev libzip-dev oniguruma-dev mysql-client
RUN docker-php-ext-install pdo pdo_mysql mbstring zip intl

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-scripts --no-autoloader --prefer-dist

COPY . .
RUN composer dump-autoload --optimize

FROM node:20-alpine AS frontend
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm install || true
COPY resources ./resources
COPY vite.config.js ./
RUN npm run build

FROM php:8.2-fpm-alpine AS production

RUN apk add --no-cache bash git unzip libpq icu-dev zlib-dev libzip-dev oniguruma-dev mysql-client
RUN docker-php-ext-install pdo pdo_mysql mbstring zip intl

# PHP-FPM na porta 9000
RUN sed -i 's|listen = .*|listen = 9000|' /usr/local/etc/php-fpm.d/www.conf

WORKDIR /var/www/html

COPY --from=base /var/www/html /var/www/html

CMD ["php-fpm"]
