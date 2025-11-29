<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PixController;
use App\Http\Controllers\PixPaymentController;

Route::post('/pix/generate-qr', [PixController::class, 'generateQrCode']);
Route::post('/pix/process-qr', [PixController::class, 'processQrCode']);
// Novas rotas REST Pix persistente
Route::post('/pix/payments', [PixPaymentController::class, 'store']);
Route::get('/pix/payments/{id}', [PixPaymentController::class, 'show']);
Route::post('/pix/payments/{id}/confirm', [PixPaymentController::class, 'confirm']);
// Simulacao de leitura do QR: GET para facilitar scan via navegador
Route::get('/pix/payments/{id}/scan', function (string $id) {
    // Chama confirm e retorna resultado
    return app(PixPaymentController::class)->confirm($id);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


