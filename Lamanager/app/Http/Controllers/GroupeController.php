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

    public function stored(Request $request): JsonResponse
    {
        // Validation des données
        $validatedData = $request->validate([
            'promo_id' => 'required|integer',
            'type' => 'required|string|max:255',
            'nom' => 'nullable|string|max:255', // Ajout du champ 'nom' optionnel
        ]);

        // Création du groupe
        $groupe = new Groupe();
        $groupe->promo_id = $validatedData['promo_id'];
        $groupe->type = $validatedData['type'];
        $groupe->nom = $validatedData['nom'] ?? 'Nom par défaut'; // Utilisation d'un nom par défaut si non fourni
        $groupe->save();

        return response()->json($groupe, 201);
    }
    public function update(Request $request, $id)
    {
        $groupe = Groupe::findOrFail($id);
        $groupe->nom = $request->input('nom');
        $groupe->save();

        return response()->json($groupe, 200);
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

    public function destroy($id)
    {
        $groupe = Groupe::findOrFail($id);
        $groupe->delete();
        return response()->json(['message' => 'Group deleted successfully']);
    }

    public function show($promo_id): JsonResponse
    {
        $groupes = Groupe::where('promo_id', $promo_id)
            ->select('id', 'nom', 'type', 'promo_id')
            ->get();

        return response()->json($groupes);
    }
}
