<?php

namespace App\Http\Controllers;

use App\Models\Enseignement;
use App\Models\Promo;
use Illuminate\Http\JsonResponse;

class EnseignementController extends Controller
{
    public function index($but_level = null): JsonResponse
    {
        $query = Enseignement::select('id', 'nom');
        
        if ($but_level) {
            // Récupère la promo correspondante pour l'année 1
            $promo = Promo::where('annee_id', 1)
                         ->where('nom', 'BUT' . $but_level)
                         ->first();
            
            if ($promo) {
                $query->where('promo_id', $promo->id);
            }
        }
        
        $enseignements = $query->get();
        return response()->json($enseignements);
    }
}