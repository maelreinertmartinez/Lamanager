<?php

namespace App\Http\Controllers;

use App\Models\Promo;
use App\Models\CaseTableau;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PromoController extends Controller
{
    public function index($annee_id): JsonResponse
    {
        $promos = Promo::where('annee_id', $annee_id)
                      ->select('id', 'nom','alternant','alternant_id')
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

    public function updatePromos(Request $request): JsonResponse
    {
        try {
            $promos = $request->input('promos');
            foreach ($promos as $promoData) {
                $promo = Promo::find($promoData['id']);
                if ($promo) {
                    $promo->update([
                        'nom' => $promoData['nom'],
                        'nombre_td' => $promoData['nombre_td'],
                        'nombre_tp' => $promoData['nombre_tp']
                    ]);
                }
            }
            return response()->json(['message' => 'Promos updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        $promo = Promo::find($id);
        if ($promo) {
            // Vérifiez si la promo est associée à un cours
            $associatedCourses = DB::table('case_tableau')
                ->join('enseignements', 'case_tableau.enseignement_id', '=', 'enseignements.id')
                ->where('enseignements.promo_id', $id)
                ->exists();

            if ($associatedCourses) {
                return response()->json(['error' => 'La promo est associée à un cours et ne peut pas être supprimée'], 400);
            }

            $promo->delete();
            return response()->json(['message' => 'Promo supprimée avec succès']);
        }
        return response()->json(['error' => 'Promo non trouvée'], 404);
    }


}
