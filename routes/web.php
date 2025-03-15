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
use App\Http\Controllers\PromoterController;

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
    Route::get('/events/create', [EventController::class, 'create'])->name('event.create');
    Route::post('/events', [EventController::class, 'store'])->name('event.store');
    Route::get('/events/{id}', [EventController::class, 'show'])->name('event.show');
    Route::delete('/events/{id}', [EventController::class, 'destroy'])->name('event.destroy');

    // Rotas para Empresas
    Route::get('/companies', [CompanyController::class, 'index'])->name('company.index');
    Route::get('/companies/create', [CompanyController::class, 'create'])->name('company.create');
    Route::post('/companies', [CompanyController::class, 'store'])->name('company.store');
    Route::get('/companies/{id}', [CompanyController::class, 'show'])->name('company.show');
    Route::delete('/companies/{id}', [CompanyController::class, 'destroy'])->name('company.destroy');

});
Route::get('/', [HomeController::class, 'index'])->name('home.index');




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
});


require __DIR__.'/auth.php';
