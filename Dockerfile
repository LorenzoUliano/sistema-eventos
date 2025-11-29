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
# copie apenas package files para cachê de camada
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
# instale dependências de frontend
RUN npm ci --silent || npm install --silent
# copie os sources do frontend
COPY resources ./resources
COPY vite.config.js ./
# Se sua app tem outra pasta (ex: src, public) copie também
COPY . .
# build de produção do Vite (Laravel: gera /app/public/build por padrão com laravel-vite-plugin)
RUN npm run build

FROM php:8.2-fpm-alpine AS production

RUN apk add --no-cache bash git unzip libpq icu-dev zlib-dev libzip-dev oniguruma-dev mysql-client
RUN docker-php-ext-install pdo pdo_mysql mbstring zip intl

# PHP-FPM na porta 9000
RUN sed -i 's|listen = .*|listen = 9000|' /usr/local/etc/php-fpm.d/www.conf

WORKDIR /var/www/html

# copie a aplicação PHP (incluindo vendor gerado na stage base)
COPY --from=base /var/www/html /var/www/html

# copie o build do frontend para public/build (saída padrão do laravel-vite-plugin)
COPY --from=frontend /app/public/build /var/www/html/public/build

CMD ["php-fpm"]
