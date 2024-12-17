<?php

namespace App\Http\Controllers;

use App\Models\CaseTableau;
use App\Models\LiaisonGroupe;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LiaisonGroupeController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $case = new LiaisonGroupe();
        $case->groupe_td_id = $request->groupe_td_id;
        $case->groupe_tp_id = $request->groupe_tp_id;
        $case->save();

        return response()->json($case);
    }
}
