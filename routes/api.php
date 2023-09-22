<?php

use App\Http\Controllers\ClientesController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShoppingController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/product/allproducts', [ProductController::class, 'allproducts']);
Route::get('/product/getimages/{id}', [ProductController::class, 'getimages'])->name('product.getimages');
Route::get('/customer/getclient/{ced}/{email}', [ClientesController::class, 'getclient']);
Route::get('/customer/allclients', [ClientesController::class, 'allclients']);
Route::get('/registerincomplete/allclients', [ClientesImcompletosController::class, 'allclients']);
Route::get('/shopping/allshopping', [ShoppingController::class, 'allshopping']);
