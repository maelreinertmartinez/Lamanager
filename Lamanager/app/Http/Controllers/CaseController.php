<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CaseTableau;
use Illuminate\Http\JsonResponse;

class CaseController extends Controller
{
    public function index($semaine_id, $enseignant_id, $groupe_id): JsonResponse
    {
        $case = CaseTableau::where('semaine_id', $semaine_id)
                                ->where('enseignant_id', $enseignant_id)
                                ->where('groupe_id', $groupe_id)
                                ->select('nombre_heure')
                                ->get();

        return response()->json($case);
    }

    public function store(Request $request): JsonResponse
    {
        $case = new CaseTableau();
        $case->semaine_id = $request->semaine_id;
        $case->enseignant_id = $request->enseignant_id;
        $case->groupe_id = $request->groupe_id;
        $case->nombre_heure = $request->nombre_heure;
        $case->save();

        return response()->json($case);
    }
}