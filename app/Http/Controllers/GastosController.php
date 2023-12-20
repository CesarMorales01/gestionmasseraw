<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\GlobalVars;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use stdClass;

class GastosController extends Controller
{
    public $global = null;

    public function __construct()
    {
        $this->global = new GlobalVars();
    }

    public function index()
    {
        
    }

    public function listar($state)
    {
        $date = now();
        $año = date_format($date, "y");
        $mes = date_format($date, "m");
        $ffinal = date("Y-m-t", strtotime($date));
        $finicial = $año . "-" . $mes . "-" . '01';
        $getGastos=DB::table('gastos')->select(DB::raw('SUM(valor) AS suma'))->whereBetween('fecha', [$finicial, $ffinal])->get();
        $gastos=$getGastos[0]->suma;
        $listaGastos=DB::table('gastos')->whereBetween('fecha', [$finicial, $ffinal])->leftJoin('categorias_gastos', 'gastos.category_id', '=', 'categorias_gastos.id')
        ->select('gastos.*','categorias_gastos.nombre as categoria')
        ->orderBy('gastos.id', 'desc')->get();
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info=DB::table('info_pagina')->first();
        $categorias = DB::table('categorias_gastos')->get();
        $token = csrf_token();
        $estado = '';
        if ($state != 'nothing') {
            $estado = $state;
        }
        return Inertia::render('Spend/Spend', compact('auth', 'globalVars', 'gastos', 'categorias', 'token', 'estado', 'listaGastos'));
    }

    public function create()
    {
        
    }

    public function listByDate($finicial, $ffinal, $category='')
    {
        $gastos=null;
        $listaGastos=null;
        if($category==''){
            $listaGastos=DB::table('gastos')->whereBetween('fecha', [$finicial, $ffinal])->leftJoin('categorias_gastos', 'gastos.category_id', '=', 'categorias_gastos.id')
            ->select('gastos.*','categorias_gastos.nombre as categoria')
            ->orderBy('gastos.id', 'desc')->get();
            $gastos=DB::table('gastos')->select(DB::raw('SUM(valor) AS suma'))->whereBetween('fecha', [$finicial, $ffinal])->get();
        }else{
            $listaGastos=DB::table('gastos')->where('category_id', '=', $category)->whereBetween('fecha', [$finicial, $ffinal])->leftJoin('categorias_gastos', 'gastos.category_id', '=', 'categorias_gastos.id')
            ->select('gastos.*','categorias_gastos.nombre as categoria')
            ->orderBy('gastos.id', 'desc')->get();
            $gastos=DB::table('gastos')->where('category_id', '=', $category)->select(DB::raw('SUM(valor) AS suma'))->whereBetween('fecha', [$finicial, $ffinal])->get();
        }
        $gastos=$gastos[0]->suma;
        $objeto=new stdClass();
        $objeto->gastos=$gastos;
        $objeto->listaGastos=$listaGastos;
        return response()->json($objeto, 200, []);
    }

    public function store(Request $request)
    {
        DB::table('gastos')->insert([
            'fecha'=>$request->fecha,
            'category_id'=>$request->categoria,
            'valor'=>$request->valor,
            'comentario'=>$request->comentario
           ]);
           return Redirect::route('spend.list', 'Gasto registrado!');
    }

    public function show(string $id)
    {
        // Borrar aca porque method in react no se puede editar....
       DB::table('gastos')->where('id', '=', $id)->delete();
       return Redirect::route('spend.list', 'Gasto eliminado!');
    }

    public function edit(string $id)
    {
        
    }

    public function update(Request $request, string $id)
    {
        
    }

    public function destroy(string $id)
    {
        
    }
}
