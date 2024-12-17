<?php

namespace App\Http\Controllers;

use App\Models\Promo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
class PromoController extends Controller
{
    public function index($annee_id): JsonResponse
    {
        $promos = Promo::where('annee_id', $annee_id)
                      ->select('id', 'nom','alternant')
                      ->get();

        return response()->json($promos);
    }
    public function getPromo($id): JsonResponse
    {
        $promo = Promo::find($id);
        return response()->json($promo);
    }
    public function store(Request $request): JsonResponse
    {
        $promo = new Promo();
        $promo->id = $request->id;
        $promo->annee_id = $request->annee_id;
        $promo->alternant_id = $request->alternant_id;
        $promo->nom = $request->nom;
        $promo->nombre_td = $request->nombre_td;
        $promo->nombre_tp = $request->nombre_tp;
        $promo->alternant = $request->alternant;
        $promo->save();

        return response()->json($promo);
    }

    public function updateAlternantId(Request $request,$id): JsonResponse
    {
        
        $promo = Promo::find($id);
        if($promo) {
            $promo->alternant_id = $request->alternant_id;
            $promo->save();
        }else{
            var_dump($promo);
        }
        return response()->json($promo);
    }
}
