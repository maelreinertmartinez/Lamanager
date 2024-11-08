<?php

namespace App\Http\Controllers;

use App\Models\Enseignement;
use Illuminate\Http\JsonResponse;

class EnseignementController extends Controller
{
    public function index(): JsonResponse
    {
        $enseignements = Enseignement::select('id', 'nom')->get();
        return response()->json($enseignements);
    }
}