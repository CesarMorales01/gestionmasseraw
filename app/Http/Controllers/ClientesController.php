<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\GlobalVars;
use App\Traits\MetodosGenerales;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use stdClass;

class ClientesController extends Controller
{
    public $global = null;
    use MetodosGenerales;

    public function __construct()
    {
        $this->global = new GlobalVars();
    }

    public function listar($state)
    {
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $clientes = DB::table('clientes')->paginate(100);
        foreach ($clientes as $cliente) {
            $telefonos = [];
            $phones = DB::table('telefonos_clientes')->where('cedula', '=', $cliente->id)->get();
            foreach ($phones as $tel) {
                $telefonos[] = $tel;
            }
            // GET TELS de tabla clientes...
            if ($cliente->telefono != '') {
                $objeTel = new stdClass();
                $objeTel->id = '';
                $objeTel->cedula = $cliente->cedula;
                $objeTel->telefono = $cliente->telefono;
                $telefonos[] = $objeTel;
            }
            $cliente->telefonos = $telefonos;
            $getEmail = DB::table('keys')->where('id_cliente', '=', $cliente->id)->first();
            if ($getEmail != null) {
                $cliente->email = $getEmail->email;
            }
        }
        $estado = '';
        if ($state != 'nothing') {
            $estado = $state;
        }
        return Inertia::render('Customer/Customers', compact('auth', 'clientes', 'globalVars', 'estado'));
    }

    public function create()
    {
        $auth = Auth()->user();
        $cliente = ['id' => '', 'cedula' => '', 'email' => ''];
        $deptos = DB::table('departamentos')->get();
        $municipios = DB::table('municipios')->get();
        $token = csrf_token();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $estado = '';
        return Inertia::render('Customer/NewClient', compact('auth', 'cliente', 'globalVars', 'deptos', 'municipios', 'token', 'estado'));
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
        $validarCedula = DB::getPdo()->lastInsertId();
        // SE DEBE ENVIAR EL ID QUE SE REGISTRO COMO CEDULA ..
        $newRequest = new stdClass();
        $newRequest->id = $validarCedula;
        $newRequest->cedulaAnterior = '';
        $newRequest->telefonos = $request->telefonos;
        $newRequest->usuario = $request->usuario;
        $newRequest->clave = $request->clave;
        $newRequest->correo = $request->correo;
        $this->ingresar_telefonos($newRequest);
        $this->ingresarCrearClave($newRequest);
        return Redirect::route('customer.list', 'Cliente registrado!');
    }

    public function ingresarCrearClave($request)
    {
        $contra = Hash::make($request->clave);
        DB::table('keys')->insert([
            'id_cliente' => $request->id,
            'name' => $request->usuario,
            'password' => $contra,
            'email' => $request->correo
        ]);
    }

    public function show(string $id)
    {
        // Eliminar en este metodo porque no se conseguido reescribir el method get por delete en el form react....
        $validarEliminar = DB::table('lista_compras')->where('cliente', '=', $id)->first();
        if ($validarEliminar != null) {
            $estado = "¡No puedes eliminar este cliente porque tiene algunas compras!";
        } else {
            DB::table('clientes')->where('id', '=', $id)->delete();
            DB::table('telefonos_clientes')->where('cedula', '=', $id)->delete();
            DB::table('keys')->where('id_cliente', '=', $id)->delete();
            $estado = "¡Cliente eliminado!";
        }
        return Redirect::route('customer.list', $estado);
    }

    public function edit(string $id)
    {
    }

    public function editar($id, $state)
    {
        $cliente = DB::table('clientes')->where('id', '=', $id)->first();
        $phones = DB::table('telefonos_clientes')->where('cedula', '=', $cliente->id)->get();
        $telefonos = [];
        foreach ($phones as $tel) {
            $telefonos[] = $tel;
        }
        // GET TELS de tabla clientes...
        if ($cliente->telefono != '') {
            $objeTel = new stdClass();
            $objeTel->id = '';
            $objeTel->cedula = $cliente->id;
            $objeTel->telefono = $cliente->telefono;
            $telefonos[] = $objeTel;
        }
        $cliente->telefonos = $telefonos;
        $usuario = DB::table('keys')->where('id_cliente', '=', $id)->first();
        $cliente->usuario = $usuario;
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $deptos = DB::table('departamentos')->get();
        $municipios = DB::table('municipios')->get();
        $token = csrf_token();
        $estado = '';
        if ($state != 'nothing') {
            $estado = $state;
        }
        return Inertia::render('Customer/NewClient', compact('auth', 'cliente', 'globalVars', 'deptos', 'municipios', 'token', 'estado'));
    }

    public function update(Request $request, string $id)
    {
    }

    public function destroy(string $id)
    {
    }

    public function actualizar(Request $request, string $id)
    {
        $update = DB::table('clientes')->where('id', '=', $id)->update([
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'cedula' => $request->cedula,
            'direccion' => $request->direccion,
            'info_direccion' => $request->info_direccion,
            'telefono' => '',
            'ciudad' => $request->codCiudad,
            'departamento' => $request->codDepto,
            'otros' => $request->otros,
            'email' => '',
            'nombre_usuario' => '',
            'clave' => ''
        ]);
        $this->ingresar_telefonos($request);
        $this->ActualizarCrearClave($request);
        //Si el cliente realizo compras, actualizar la cedula
        $validarComprasRealizadas = DB::table('lista_compras')->where('cliente', '=', $request->cedulaAnterior)->first();
        if ($validarComprasRealizadas != null) {
            DB::table('lista_compras')->where('cliente', '=', $request->cedulaAnterior)->update([
                'cliente' => $request->cedula
            ]);
        }

        return Redirect::route('customer.editar', [$request->id, 'Cliente actualizado!']);
    }

    public function ActualizarCrearClave($request)
    {
        $contra = '';
        if (strlen($request->clave) == 60) {
            $contra = $request->clave;
        } else {
            $contra = Hash::make($request->clave);
        }
        DB::table('keys')->where('id_cliente', '=', $request->id)->update([
            'cedula' => $request->id,
            'name' => $request->usuario,
            'password' => $contra,
            'email' => $request->correo
        ]);
    }

    public function getclient(string $ced, string $email)
    {
        $cliente = null;
        $usuario = null;
        $client = DB::table('clientes')->where('cedula', '=', $ced)->first();
        $user = DB::table('keys')->where('email', '=', $email)->first();
        if ($client != null) {
            $cliente = $client;
        }
        if ($user != null) {
            $usuario = $user;
        }

        $response = [
            'cliente' => $cliente,
            'usuario' => $usuario
        ];
        return response()->json($response, 200, []);
    }

    public function allclients()
    {
        return response()->json($this->all_clientes(), 200, []);
    }
}
