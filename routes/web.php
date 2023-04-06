<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/view-receipts', function () {
    return view('welcome');
});

Route::get('/new-item', function () {
    return view('welcome');
});

Route::get('/new-receipt', function () {
    return view('welcome');
});

Route::get('/view-archives', function () {
    return view('welcome');
});

Route::get('/get-item/{id}', function () {
    return view('welcome');
});

Route::get('/use-item/{id}', function () {
    return view('welcome');
});

Route::get('/new-purchase', function () {
    return view('welcome');
});

Route::get('/view-purchases', function () {
    return view('welcome');
});