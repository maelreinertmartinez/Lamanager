<?php

namespace App\Http\Controllers;

use App\Models\Groupe;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
class GroupeController extends Controller
{
    public function index($promo_id): JsonResponse
    {
        $groupes = Groupe::where('promo_id', $promo_id)
                      ->select('id', 'nom', 'type')
                      ->get();
        
        return response()->json($groupes);
    }
    public function store(Request $request): JsonResponse
    {
        $case = new Groupe();
        $case->promo_id = $request->promo_id;
        $case->nom = $request->nom;
        $case->type = $request->type;
        $case->save();

        return response()->json($case);
    }

    public function show($promo_id): JsonResponse
    {
        $groupes = Groupe::where('promo_id', $promo_id)

            ->get();



        return response()->json($groupes);
    }
}



