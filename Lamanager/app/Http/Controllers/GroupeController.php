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


    public function update(Request $request)
    {
        $groupes = $request->input('groupes');

        foreach ($groupes as $groupeData) {
            $groupe = Groupe::find($groupeData['id']);
            if ($groupe) {
                $groupe->nom = $groupeData['nom'];
                $groupe->save();
            }
        }

        return response()->json(['message' => 'Groupes updated successfully']);
    }


    public function updateGroupes(Request $request)
    {
        $groupes = $request->input('groupes');
        foreach ($groupes as $groupeData) {
            $groupe = Groupe::findOrFail($groupeData['id']);
            $groupe->nom = $groupeData['nom'];
            $groupe->save();
        }

        return response()->json(['message' => 'Groupes updated successfully'], 200);
    }

    // GroupeController.php
    public function destroy($id): JsonResponse
    {
        $groupe = Groupe::find($id);
        if ($groupe) {
            $groupe->delete();
            return response()->json(['message' => 'Group deleted successfully']);
        }
        return response()->json(['message' => 'Group not found'], 404);
    }

    public function show($promo_id): JsonResponse
    {
        $groupes = Groupe::where('promo_id', $promo_id)
            ->select('id', 'nom', 'type', 'promo_id')
            ->get();



        return response()->json($groupes);
    }
}



