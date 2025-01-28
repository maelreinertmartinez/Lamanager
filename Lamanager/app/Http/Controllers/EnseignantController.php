<?php

namespace App\Http\Controllers;

use App\Models\Enseignant;
use App\Http\Requests\EnseignantRequest;
use App\Http\Resources\EnseignantResource;
use App\Services\EnseignantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Log;

class EnseignantController extends Controller
{
    protected $enseignantService;

    public function __construct(EnseignantService $enseignantService)
    {
        $this->enseignantService = $enseignantService;
    }

    public function index(): AnonymousResourceCollection
    {
        $enseignants = Enseignant::with('role')->get();
        return EnseignantResource::collection($enseignants);
    }

    public function avoirInfo($id): JsonResponse
    {
        $enseignant = Enseignant::where('id', $id)
                                ->select( 'nom', 'prenom','mail')
                                ->first();
    
        return response()->json($enseignant);
    }

    public function listeEnseignant(): JsonResponse
    {
        $enseignants = Enseignant::select('id', 'nom', 'prenom','mail','role_id','actif','admin')->get();

        return response()->json($enseignants);
    }

    public function showCode($id): JsonResponse
    {
        $enseignant = Enseignant::where('id', $id)
                                ->select('code')
                                ->first();
    
        return response()->json($enseignant);
    }

    public function show($id): EnseignantResource
    {
        $enseignant = Enseignant::with('role')->findOrFail($id);
        return new EnseignantResource($enseignant);
    }

    public function store(EnseignantRequest $request): EnseignantResource
    {
        $enseignant = $this->enseignantService->createEnseignant($request->validated());
        return new EnseignantResource($enseignant);
    }

    public function update(EnseignantRequest $request, Enseignant $enseignant): EnseignantResource
    {
        $enseignant = $this->enseignantService->updateEnseignant($enseignant, $request->validated());
        return new EnseignantResource($enseignant);
    }

    public function changementMdp(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => ['required'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $enseignant = Enseignant::findOrFail($request->user()->id);

        if (!$this->enseignantService->verifyCurrentPassword($enseignant, $request->current_password)) {
            return response()->json(['error' => 'Le mot de passe actuel est incorrect'], 400);
        }

        $this->enseignantService->updatePassword($enseignant, $request->password);

        return response()->json(['message' => 'Mot de passe mis à jour avec succès']);
    }

    public function destroy(Enseignant $enseignant): JsonResponse
    {
        $enseignant->delete();
        return response()->json(['message' => 'Enseignant supprimé avec succès']);
    }

    public function listeEnseignementParEnseignant($annee_id, $enseignant_id): JsonResponse
    {
        $enseignant = Enseignant::select('enseignements.id','enseignements.nom')
                            ->join('case_tableau', 'case_tableau.enseignant_id', '=', 'enseignants.id')
                            ->join('enseignements', 'case_tableau.enseignement_id', '=', 'enseignements.id')
                            ->join('promos', 'enseignements.promo_id', '=', 'promos.id')
                            ->join('annees', 'promos.annee_id', '=', 'annees.id')
                            ->where('annees.id', $annee_id)
                            ->where('enseignant_id', $enseignant_id)
                            ->distinct()
                            ->get();

        return response()->json($enseignant);
    }
}