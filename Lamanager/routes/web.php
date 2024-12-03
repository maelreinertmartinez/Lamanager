<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EnseignementController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EnseignantController;
use App\Http\Controllers\SemaineController;
use App\Http\Controllers\CaseController;
use App\Models\Promo;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnneeController;
use App\Http\Controllers\PromoController;
use App\Http\Controllers\GroupeController;
use App\Models\Semaine;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home'); // Assurez-vous que la page Home.jsx existe
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/test', function () {
    return Inertia::render('Test');
})->name('test');



Route::get('/login', function () {
    return Inertia::render('Login');
})->name('login');

require __DIR__.'/auth.php';

Route::get('/api/enseignants', [EnseignantController::class, 'index'])->name('api.enseignants');
Route::get('/api/enseignant/{id}', [EnseignantController::class, 'showCode'])->name('api.enseignant.get');
Route::get('/api/semaines', [SemaineController::class, 'index'])->name('api.semaines');
Route::get('/api/annees', [AnneeController::class, 'index'])->name('api.annees');
Route::get('/api/promos/{annee_id}', [PromoController::class, 'index'])->name('api.promos');
Route::get('/groupes/{promo_id}', [GroupeController::class, 'show']);


Route::get('/api/enseignements/{promo_id}/{annee_id}', [EnseignementController::class, 'index']);
Route::get('/api/promo/{id}', [PromoController::class, 'getPromo'])->name('api.promo.get');
Route::get('/api/groupes/{promo_id}', [GroupeController::class, 'index'])->name('api.groupes');
Route::get('/cases/{enseignement_id}', [CaseController::class, 'index'])->name('api.cases');

Route::post('/api/annees', [AnneeController::class, 'store'])->name('api.annees.store');
Route::post('/api/cases', [CaseController::class, 'store'])->name('api.cases.store');
Route::post('/login', [AuthController::class, 'authenticate'])->name('authenticate');
Route::post('/api/promos', [PromoController::class, 'store'])->name('api.promos.store');
Route::post('/api/groupes', [GroupeController::class, 'store'])->name('api.groupes.store');

Route::delete('/api/cases', [CaseController::class, 'destroy'])->name('api.cases.destroy');


Route::post('/api/enseignements', [EnseignementController::class, 'store'])->name('api.enseignements.store');

// web.php
Route::post('/api/groupes', [GroupeController::class, 'store2'])->name('api.groupes.store');
// web.php
Route::delete('/api/groupes/{id}', [GroupeController::class, 'destroy'])->name('api.groupes.destroy');

Route::post('/update-promos', [PromoController::class, 'updatePromos'])->name('api.promos.update');

Route::post('/update-groupes', [GroupeController::class, 'update']);

