<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProxyController;

/*
|--------------------------------------------------------------------------
| API Gateway Catch-All Route
|--------------------------------------------------------------------------
|
| This single route captures all requests made to the /api/* endpoint.
| The ProxyController is now responsible for determining where to
| forward the request based on the URL path.
|
*/

Route::any('{any}', [ProxyController::class, 'proxy'])->where('any', '.*');
