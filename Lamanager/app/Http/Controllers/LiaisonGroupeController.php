<?php

namespace App\Http\Controllers;

use App\Models\LiaisonGroupe;
use Illuminate\Http\Request;

class LiaisonGroupeController extends Controller
{


    public function store(Request $request)
    {
        $liaison = new LiaisonGroupe();
        $liaison->groupe_td_id = $request->input('groupe_td_id');
        $liaison->groupe_tp_id = $request->input('groupe_tp_id');
        $liaison->save();

        return response()->json($liaison, 201);
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
