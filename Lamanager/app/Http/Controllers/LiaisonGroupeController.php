<?php

namespace App\Http\Controllers;

use App\Models\CaseTableau;
use App\Models\LiaisonGroupe;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LiaisonGroupeController extends Controller
{


    public function store(Request $request)
    {
        $case = new LiaisonGroupe();
        $case->groupe_td_id = $request->groupe_td_id;
        $case->groupe_tp_id = $request->groupe_tp_id;
        $case->save();

        return response()->json($case);
    }

    public function getSubGroups($groupe_td_id)
    {
        $subGroups = LiaisonGroupe::where('groupe_td_id', $groupe_td_id)->get();
        return response()->json($subGroups);
    }

    public function index()
    {
        $liaisons = LiaisonGroupe::all();
        return response()->json($liaisons);
    }


}
