<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PromoterDashboardController;
use Inertia\Inertia;
use App\Http\Controllers\Auth\PromoterAuthenticatedSessionController;
use App\Http\Controllers\Auth\PromoterRegisteredController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\PromoterController;
use App\Http\Controllers\TicketController;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/events', [EventController::class, 'index'])->name('event.index');

    Route::post('/cart/continue', [CartController::class, 'addToCart']);

});

Route::get('/', [HomeController::class, 'index'])->name('home.index');
Route::get('/event/{id}', [EventController::class, 'show'])->name('event.show');

Route::get('/company/{id}', [CompanyController::class, 'show'])->name('company.show');



// ROTAS PÚBLICAS - Login e Logout do Promoter
Route::prefix('promoter')->middleware('guest:promoter')->group(function () {
    Route::get('/login', [PromoterAuthenticatedSessionController::class, 'create'])->name('promoter.login');
    Route::post('/login', [PromoterAuthenticatedSessionController::class, 'store']);
});

// ROTAS PROTEGIDAS PARA PROMOTERS AUTENTICADOS
Route::prefix('promoter')->middleware('auth:promoter')->group(function () {
    // Dashboard do Promoter
    Route::get('/dashboard', [PromoterDashboardController::class, 'index'])->name('promoter.dashboard');

    // Logout do Promoter
    Route::post('/logout', [PromoterAuthenticatedSessionController::class, 'destroy'])->name('promoter.logout');

    // Rotas para Criar Novos Promoters (somente promoters autenticados podem criar)
    Route::get('/register', [PromoterRegisteredController::class, 'create'])->name('promoter.register');
    Route::post('/register', [PromoterRegisteredController::class, 'store']);

    // Rotas para Gerenciar Promoters
    Route::get('/list', [PromoterController::class, 'index'])->name('promoter.index');
    Route::get('/{id}', [PromoterController::class, 'show'])->name('promoter.show');
    Route::delete('/{id}', [PromoterController::class, 'destroy'])->name('promoter.destroy');

    // Página para gerenciar evento específico
    Route::get('/event/create', [EventController::class, 'create'])->name('promoter.event.create');
    Route::post('/event/store', [EventController::class, 'store'])->name('promoter.event.store');
    Route::get('/event/{id}', [EventController::class, 'manage'])->name('promoter.event.manage');
    Route::put('/event/{id}', [EventController::class, 'update'])->name(name: 'promoter.event.update');

    // TicketsEvento
    Route::get('/event/{id}/tickets', [EventController::class, 'tickets'])->name('promoter.event.tickets');

    Route::post('/events/{event}/tickets', [TicketController::class, 'store'])->name('promoter.tickets.store');
    Route::delete('/events/{event}/tickets/{ticket}', [TicketController::class, 'destroy'])->name('promoter.tickets.destroy');

    // Logout do Promoter
    Route::post('/logout', [PromoterAuthenticatedSessionController::class, 'destroy'])->name('promoter.logout');
});


require __DIR__.'/auth.php';
