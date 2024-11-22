<?php

use App\Http\Controllers\EnseignementController;
use App\Http\Controllers\GroupeController;
use App\Http\Controllers\ProfileController;
use App\Models\Promo;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnneeController;
use App\Http\Controllers\PromoController;
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


Route::post('/update-promos', function (Request $request) {
    $promos = $request->input('promos');
    foreach ($promos as $promoData) {
        $promo = Promo::find($promoData['id']);
        if ($promo) {
            $promo->nom = $promoData['nom'];
            $promo->nombre_td = $promoData['nombre_td'];
            $promo->nombre_tp = $promoData['nombre_tp'];
            $promo->save();
        }
    }
    return response()->json(['message' => 'Promos updated successfully']);
});





require __DIR__.'/auth.php';

Route::get('/api/enseignements/{promo_id?}', [EnseignementController::class, 'index'])->name('api.enseignements');
Route::get('/api/annees', [AnneeController::class, 'index'])->name('api.annees');
Route::get('/api/promos/{annee_id}', [PromoController::class, 'index'])->name('api.promos');
Route::get('/groupes/{promo_id}', [GroupeController::class, 'show']);
