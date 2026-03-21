<?php

use Illuminate\Support\Facades\Route;

Route::fallback(function () {
    $spaPath = public_path('index.html');
    if (file_exists($spaPath)) {
        return response()->file($spaPath, ['Content-Type' => 'text/html']);
    }
    return response('YouOrganic API is running.', 200);
});
