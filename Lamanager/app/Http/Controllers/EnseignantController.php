<?php

namespace App\Http\Controllers;

use App\Models\Enseignant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class EnseignantController extends Controller
{
    public function index(): JsonResponse
    {
        $enseignants = Enseignant::select('id', 'code', 'nom', 'prenom')->get();

        return response()->json($enseignants);
    }

    public function avoirInfo($id): JsonResponse
    {
        $enseignant = Enseignant::where('id', $id)
                                ->select( 'nom', 'prenom','mail')
                                ->first();
    
        return response()->json($enseignant);
    }
    public function showCode($id): JsonResponse
    {
        $enseignant = Enseignant::where('id', $id)
                                ->select('code')
                                ->first();
    
        return response()->json($enseignant);
    }

    public function changementMdp(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => ['required'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $enseignant = Enseignant::find($request->user()->id);

        if (!Hash::check($request->current_password, $enseignant->mot_de_passe)) {
            return response()->json(['error' => 'Current password is incorrect'], 400);
        }

        $enseignant->update(['mot_de_passe' => Hash::make($request->password)]);

        return response()->json(['message' => 'Password updated successfully']);
    }
    
}