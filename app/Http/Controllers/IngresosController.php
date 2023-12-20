<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\GlobalVars;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use stdClass;

class IngresosController extends Controller
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
        $ventas=DB::table('lista_compras')->select(DB::raw('SUM(total_compra) AS suma'))->whereBetween('fecha', [$finicial, $ffinal])->get();
        $ventas=$ventas[0]->suma;
        $ingresos=DB::table('ingresos')->select(DB::raw('SUM(valor) AS suma'))->whereBetween('fecha', [$finicial, $ffinal])->get();
        $ingresos=$ingresos[0]->suma;
        $listaIngresos=DB::table('ingresos')->whereBetween('fecha', [$finicial, $ffinal])->leftJoin('categorias_ingresos', 'ingresos.category_id', '=', 'categorias_ingresos.id')
        ->select('ingresos.*','categorias_ingresos.nombre as categoria')
        ->orderBy('ingresos.id', 'desc')->get();
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info=DB::table('info_pagina')->first();
        $categorias = DB::table('categorias_ingresos')->get();
        $token = csrf_token();
        $estado = '';
        if ($state != 'nothing') {
            $estado = $state;
        }
        return Inertia::render('Income/Incomes', compact('auth', 'globalVars', 'ventas', 'categorias', 'token', 'estado', 'ingresos', 'listaIngresos'));
    }

    public function listByDate($finicial, $ffinal, $category='')
    {
        $ventas=DB::table('lista_compras')->select(DB::raw('SUM(total_compra) AS suma'))->whereBetween('fecha', [$finicial, $ffinal])->get();
        $ventas=$ventas[0]->suma;
        $ingresos=null;
        $listaIngresos=null;
        if($category==''){
            $listaIngresos=DB::table('ingresos')->whereBetween('fecha', [$finicial, $ffinal])->leftJoin('categorias_ingresos', 'ingresos.category_id', '=', 'categorias_ingresos.id')
            ->select('ingresos.*','categorias_ingresos.nombre as categoria')
            ->orderBy('ingresos.id', 'desc')->get();
            $ingresos=DB::table('ingresos')->select(DB::raw('SUM(valor) AS suma'))->whereBetween('fecha', [$finicial, $ffinal])->get();
        }else{
            $listaIngresos=DB::table('ingresos')->where('category_id', '=', $category)->whereBetween('fecha', [$finicial, $ffinal])->leftJoin('categorias_ingresos', 'ingresos.category_id', '=', 'categorias_ingresos.id')
            ->select('ingresos.*','categorias_ingresos.nombre as categoria')
            ->orderBy('ingresos.id', 'desc')->get();
            $ingresos=DB::table('ingresos')->where('category_id', '=', $category)->select(DB::raw('SUM(valor) AS suma'))->whereBetween('fecha', [$finicial, $ffinal])->get();
        }
        $ingresos=$ingresos[0]->suma;
        $objeto=new stdClass();
        $objeto->ventas=$ventas;
        $objeto->ingresos=$ingresos;
        $objeto->listaIngresos=$listaIngresos;
        return response()->json($objeto, 200, []);
    }

    public function create()
    {
    }

    public function store(Request $request)
    {
       DB::table('ingresos')->insert([
        'fecha'=>$request->fecha,
        'category_id'=>$request->categoria,
        'valor'=>$request->valor,
        'comentario'=>$request->comentario
       ]);
       return Redirect::route('income.list', 'Ingreso registrado!');
    }

    public function show(string $id)
    {
       // Borrar aca porque method in react no se puede editar....
       DB::table('ingresos')->where('id', '=', $id)->delete();
       return Redirect::route('income.list', 'Ingreso eliminado!');
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
