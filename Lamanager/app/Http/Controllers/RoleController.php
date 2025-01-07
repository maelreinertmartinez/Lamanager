<?php
namespace App\Http\Controllers;


use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller{
    
    public function index(){
        $roles = Role::all();
        return response()->json($roles);
    }

    public function update(Request $request, $id){
        $role = Role::find($id);
        $role->update($request->all());
        return response()->json($role);
    }

    public function store(Request $request){
        $role = Role::create([
            'nom' => $request->nom,
            'nombre_heure' => $request->nombre_heure 
        ]);
        return response()->json($role);
    }
}