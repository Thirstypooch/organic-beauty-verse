<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProxyController;

/*
|--------------------------------------------------------------------------
| API Gateway Routes
|--------------------------------------------------------------------------
|
| These routes act as a proxy, forwarding requests to the appropriate
| microservice. The '{any}' parameter captures the entire path.
|
*/


Route::any('register/{any?}', [ProxyController::class, 'proxy'])
    ->where('any', '.*')->defaults('service', 'user');

Route::any('login/{any?}', [ProxyController::class, 'proxy'])
    ->where('any', '.*')->defaults('service', 'user');


Route::any('user/{any?}', [ProxyController::class, 'proxy'])
    ->where('any', '.*')->defaults('service', 'user');



Route::any('products/{any?}', [ProxyController::class, 'proxy'])
    ->where('any', '.*')->defaults('service', 'product');

Route::any('categories/{any?}', [ProxyController::class, 'proxy'])
    ->where('any', '.*')->defaults('service', 'product');
