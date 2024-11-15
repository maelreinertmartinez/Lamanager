<?php

namespace App\Http\Controllers;

use App\Models\Enseignant;
use Illuminate\Http\JsonResponse;

class EnseignantController extends Controller
{
    public function index(): JsonResponse
    {
        $enseignants = Enseignant::select('id', 'code', 'nom', 'prenom')->get();

        return response()->json($enseignants);
    }
    public function showCode($id): JsonResponse
    {
        $enseignant = Enseignant::where('id', $id)
                                ->select('code')
                                ->first();
    
        return response()->json($enseignant);
    }
    
}