<?php

namespace App\Providers;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Remove the {"data": ...} wrapper from API Resources so the frontend
        // can parse responses directly as arrays/objects without unwrapping.
        JsonResource::withoutWrapping();

        // Suppress PHP 8.5 deprecation notices (e.g. PDO::MYSQL_ATTR_SSL_CA)
        // that would otherwise be injected as HTML into JSON responses.
        error_reporting(E_ALL & ~E_DEPRECATED);
    }
}
