<?php

namespace App\Http\Controllers;

use App\Models\Enseignement;
use Illuminate\Http\JsonResponse;

class EnseignementController extends Controller
{
    public function index($promo_id = null): JsonResponse
    {
        $query = Enseignement::select('id', 'nom');
        
        if ($promo_id) {
            $query->where('promo_id', $promo_id);
        }
        
        $enseignements = $query->get();
        return response()->json($enseignements);
    }
}