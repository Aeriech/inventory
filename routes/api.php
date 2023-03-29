<?php

use App\Http\Controllers\ItemController;
use App\Http\Controllers\ReceiptController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/add-item',[ItemController::class, 'addNewItem']);
Route::get('/view-items',[ItemController::class, 'viewItems']);
Route::get('/get-item/{id}',[ItemController::class, 'getItem']);
Route::post('/update-item/{id}',[ItemController::class, 'updateItem']);
Route::get('/view-archives',[ItemController::class, 'viewArchives']);
Route::post('/archive-item/{id}',[ItemController::class, 'archive']);
Route::post('/unarchive-item/{id}',[ItemController::class, 'unarchive']);
Route::post('/use-item/{id}',[ItemController::class, 'useItem']);

Route::post('/add-receipt',[ReceiptController::class, 'addReceipt']);
Route::get('/view-receipts',[ReceiptController::class, 'viewReceipts']);