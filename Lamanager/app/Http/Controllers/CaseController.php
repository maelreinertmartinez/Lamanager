<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CaseTableau;
use Illuminate\Http\JsonResponse;

class CaseController extends Controller
{
    public function index($enseignement_id): JsonResponse
    {
        $case = CaseTableau::where('enseignement_id', $enseignement_id)
            ->select('semaine_id', 'enseignant_id', 'groupe_id', 'nombre_heure', 'nombre_minute')
            ->get();

        return response()->json($case);
    }

    public function store(Request $request): JsonResponse
    {
        $case = new CaseTableau();
        $case->semaine_id = $request->semaine_id;
        $case->enseignant_id = $request->enseignant_id;
        $case->enseignement_id = $request->enseignement_id;
        $case->groupe_id = $request->groupe_id;
        $case->nombre_heure = $request->nombre_heure;
        $case->nombre_minute = $request->nombre_minute;
        $case->save();

        return response()->json($case);
    }

    public function destroy(Request $request): JsonResponse
    {
        $case = CaseTableau::where('semaine_id', $request->semaine_id)
                          ->where('groupe_id', $request->groupe_id)
                          ->where('enseignement_id', $request->enseignement_id)
                          ->delete();

        return response()->json(['message' => 'Case supprimée avec succès']);
    }

    public function listeCasesParEnseignant($annee_id, $enseignement_id, $enseignant_id): JsonResponse
    {
        $query = CaseTableau::select('semaine_id','nombre_heure','nombre_minute','enseignement_id','enseignements.nom','groupe_id','numero','type')
            ->join('semaines', 'case_tableau.semaine_id', '=', 'semaines.id')
            ->join('enseignements', 'case_tableau.enseignement_id', '=', 'enseignements.id')
            ->join('groupes', 'case_tableau.groupe_id', '=', 'groupes.id')
            ->join('promos', 'enseignements.promo_id', '=', 'promos.id')
            ->join('annees', 'promos.annee_id', '=', 'annees.id')
            ->where('annees.id', $annee_id)
            ->where('enseignant_id', $enseignant_id);
    
        if ($enseignement_id !== null) {
            $query->where('enseignement_id', $enseignement_id);
        }
    
        $cases = $query->get();
    
        return response()->json($cases);
    }
    public function listeEnseignement($annee_id, $enseignant_id): JsonResponse
    {
        $query = CaseTableau::select('semaine_id','nombre_heure','nombre_minute','enseignement_id','enseignements.nom','groupe_id','numero','type')
            ->join('semaines', 'case_tableau.semaine_id', '=', 'semaines.id')
            ->join('enseignements', 'case_tableau.enseignement_id', '=', 'enseignements.id')
            ->join('groupes', 'case_tableau.groupe_id', '=', 'groupes.id')
            ->join('promos', 'enseignements.promo_id', '=', 'promos.id')
            ->join('annees', 'promos.annee_id', '=', 'annees.id')
            ->where('annees.id', $annee_id)
            ->where('enseignant_id', $enseignant_id);
    
        $cases = $query->get();
    
        return response()->json($cases);
    }

}
