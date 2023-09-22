<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\GlobalVars;
use App\Traits\MetodosGenerales;
use Illuminate\Support\Facades\Hash;

class ClientesImcompletosController extends Controller
{
    use MetodosGenerales;
    public $global = null;

    public function __construct()
    {
        $this->global = new GlobalVars();
    }

    public function index()
    {
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info=DB::table('info_pagina')->first();
        $clientes = DB::table('keys')->where('cedula', '=', null)->orWhere('cedula', '=', '')->paginate(100);
        return Inertia::render('Incompleteregister/List', compact('auth', 'clientes', 'globalVars'));
    }

    public function create()
    {
    }


    public function store(Request $request)
    {
        DB::table('clientes')->insert([
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'cedula' => $request->cedula,
            'direccion' => $request->direccion,
            'info_direccion' => $request->info_direccion,
            'ciudad' => $request->codCiudad,
            'departamento' => $request->codDepto,
            'otros' => $request->otros,
            'fecha_ingreso' => $request->fecha
        ]);
        $this->ingresar_telefonos($request);
        $this->ActualizarCrearClave($request);
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info=DB::table('info_pagina')->first();
        $clientes = DB::table('clientes')->paginate(100);
        foreach ($clientes as $cliente) {
            $telefono = DB::table('telefonos_clientes')->where('cedula', '=', $cliente->cedula)->get();
            $cliente->telefonos = $telefono;
        }
        $estado = "¡Nuevo cliente registrado!";
        return Inertia::render('Customer/Customers', compact('auth', 'clientes', 'globalVars', 'estado'));
    }

    public function ActualizarCrearClave($request)
    {
        $contra = '';
        if (strlen($request->clave) == 60) {
            $contra = $request->clave;
        } else {
            $contra = Hash::make($request->clave);
        }
        DB::table('keys')->where('email', '=', $request->correo)->update([
            'cedula' => $request->cedula,
            'name' => $request->usuario,
            'password' => $contra
        ]);
    }

    public function show(string $id)
    {
    }

    public function edit(string $id)
    {
        $cliente = DB::table('keys')->where('email', '=', $id)->first();
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info=DB::table('info_pagina')->first();
        $deptos = DB::table('departamentos')->get();
        $municipios = DB::table('municipios')->get();
        $token = csrf_token();
        return Inertia::render('Incompleteregister/EditClient', compact('auth', 'cliente', 'globalVars', 'deptos', 'municipios', 'token'));
    }

    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function allclients()
    {
        $clientes = DB::table('keys')->get();
        $filter=[];
        foreach($clientes as $item){
            if($item->cedula==''){
                $filter[]=$item;
            }
        }
        return response()->json($filter, 200, []);
    }
}

