<?php

namespace App\Traits;

use Illuminate\Support\Facades\DB;
use stdClass;

trait MetodosGenerales
{

    public function all_products()
    {
        return DB::table('productos')->get();
    }

    public function all_clientes()
    {
        $clientes = DB::table('clientes')->get();
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
        return $clientes;
    }

    public function get_compra_n($cliente)
    {
        $compran = 1;
        $validarNCompra = DB::table('lista_compras')->where('cliente', '=', $cliente)->orderBy('compra_n', 'desc')->first();
        if ($validarNCompra) {
            $compran = $validarNCompra->compra_n + 1;
        }
        return $compran;
    }

    public function ingresar_telefonos($request)
    {
        if($request->cedulaAnterior!=''){
            DB::table('telefonos_clientes')->where('cedula', '=', $request->id)->delete();
        }
        for ($i = 0; $i < count($request->telefonos); $i++) {
            $token = strtok($request->telefonos[$i], ",");
            while ($token !== false) {
                DB::table('telefonos_clientes')->insert([
                    'cedula' => $request->id,
                    'telefono' => $token
                ]);
                $token = strtok(",");
            }
        }
    }

}