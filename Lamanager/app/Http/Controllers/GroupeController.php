<?php

namespace App\Http\Controllers;

use App\Models\Groupe;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
class GroupeController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $case = new Groupe();
        $case->promo_id = $request->promo_id;
        $case->nom = $request->nom;
        $case->type = $request->type;
        $case->save();

        return response()->json($case);
    }
}
