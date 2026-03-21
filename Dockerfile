FROM node:20-slim AS frontend-build
WORKDIR /frontend
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html vite.config.ts tailwind.config.ts tsconfig*.json components.json postcss.config.js ./
COPY src/ src/
COPY public/ public/
ENV VITE_API_URL=/api
RUN npm run build

FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    unzip \
    && docker-php-ext-install pdo pdo_pgsql zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY backend/user-service/ .

RUN composer install --no-dev --optimize-autoloader --no-interaction \
    && mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache \
    && chmod -R 777 storage bootstrap/cache

# Copy SPA build into Laravel's public directory
COPY --from=frontend-build /frontend/dist/ /app/public/

# Don't cache config at build time — secrets are injected at runtime by Fly.io
RUN php artisan route:cache

EXPOSE 8080

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8080"]
