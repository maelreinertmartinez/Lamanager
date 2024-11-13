<?php

namespace App\Http\Controllers;

use App\Models\Enseignement;
use App\Models\Promo;
use Illuminate\Http\JsonResponse;

class EnseignementController extends Controller
{
    public function index($but_level = null, $annee_id = null): JsonResponse
    {
        $query = Enseignement::select('enseignements.id', 'enseignements.nom')
            ->join('promos', 'enseignements.promo_id', '=', 'promos.id')
            ->where('promos.annee_id', $annee_id)
            ->where('promos.nom', 'BUT' . $but_level);
        
        $enseignements = $query->get();
        return response()->json($enseignements);
    }
}