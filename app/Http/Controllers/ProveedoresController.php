<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\GlobalVars;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use stdClass;

class ProveedoresController extends Controller
{
    public $global = null;

    public function __construct()
    {
        $this->global = new GlobalVars();
    }

    public function listar($state)
    {
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info=DB::table('info_pagina')->first();
        $estado = '';
        if ($state != 'nothing') {
            $estado = $state;
        }
        $date = now();
        $año = date_format($date, "Y");
        $mes = date_format($date, "m");
        $ffinal = date("Y-m-t", strtotime($date));
        $finicial = $año . "-" . $mes . "-" . '01';
        $categorias=DB::table('categorias_proveedores')->get();
        $proveedores=DB::table('proveedores')->whereBetween('fecha', [$finicial, $ffinal])->leftJoin('categorias_proveedores', 'proveedores.categoria', '=', 'categorias_proveedores.id')
        ->select('proveedores.*','categorias_proveedores.nombre as categoria')
        ->orderBy('proveedores.id', 'desc')->get();
        $totalProveedores=DB::table('proveedores')->select(DB::raw('SUM(valor) AS suma'))->whereBetween('fecha', [$finicial, $ffinal])->get();
        if($totalProveedores){
            $totalProveedores=$totalProveedores[0]->suma;
        }
        $token = csrf_token();
        return Inertia::render('Provider/Providers', compact('auth', 'globalVars', 'estado', 'categorias', 'token', 'proveedores', 'totalProveedores'));
    }

    public function listByDate($finicial, $ffinal, $category='')
    {
        $proveedores=null;
        if($category==''){
            $proveedores=DB::table('proveedores')->whereBetween('fecha', [$finicial, $ffinal])->leftJoin('categorias_proveedores', 'proveedores.categoria', '=', 'categorias_proveedores.id')
            ->select('proveedores.*','categorias_proveedores.nombre as categoria')
            ->orderBy('proveedores.id', 'desc')->get();
            $totalProveedores=DB::table('proveedores')->select(DB::raw('SUM(valor) AS suma'))->whereBetween('fecha', [$finicial, $ffinal])->get();
        }else{
            $proveedores=DB::table('proveedores')->where('categoria', '=', $category)->whereBetween('fecha', [$finicial, $ffinal])->leftJoin('categorias_proveedores', 'proveedores.categoria', '=', 'categorias_proveedores.id')
            ->select('proveedores.*','categorias_proveedores.nombre as categoria')
            ->orderBy('proveedores.id', 'desc')->get();
            $totalProveedores=DB::table('proveedores')->where('categoria', '=', $category)->select(DB::raw('SUM(valor) AS suma'))->whereBetween('fecha', [$finicial, $ffinal])->get();
        }
        $totalProveedores=$totalProveedores[0]->suma;
        $objeto=new stdClass();
        $objeto->totalProveedores=$totalProveedores;
        $objeto->proveedores=$proveedores;
        return response()->json($objeto, 200, []);
    }
   
    public function index()
    {
        //
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        DB::table('proveedores')->insert([
            'fecha'=>$request->fecha,
            'nombre'=>$request->nombre,
            'descripcion'=>$request->descripcion,
            'categoria'=>$request->categoria,
            'valor'=>$request->valor
        ]);
        return Redirect::route('provider.list', 'Nuevo proveedor registrado!');
    }

    public function show(string $id)
    {
        // Borrar aca porque method in react no se puede editar....
       DB::table('proveedores')->where('id', '=', $id)->delete();
       return Redirect::route('provider.list', 'Proveedor eliminado!');
    }

    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
