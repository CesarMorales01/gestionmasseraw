<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\GlobalVars;
use Illuminate\Support\Facades\Redirect;
use stdClass;

class InformesController extends Controller
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
        $año = date_format($date, "y");
        $mes = date_format($date, "m");
        $dia = date_format($date, "d");
        $ffinal = $año . "-" . $mes . "-" . $dia;
        $finicial = $año . "-" . $mes . "-" . $dia;
        $ingresos = app(IngresosController::class)->listByDate($finicial, $ffinal, '');
        $totalIngresos = intval($ingresos->original->ventas) + intval($ingresos->original->ingresos);
        $gastos = app(GastosController::class)->listByDate($finicial, $ffinal, '');
        $totalGastos = intval($gastos->original->gastos);
        $proveedores = app(ProveedoresController::class)->listByDate($finicial, $ffinal, '');
        $totalProviders=intval($proveedores->original->totalProveedores);
        return Inertia::render('Report/Reports', compact('auth', 'globalVars', 'estado', 'totalIngresos', 'totalGastos', 'totalProviders'));
    }

    public function listByDate($finicial, $ffinal)
    {
        $ingresos = app(IngresosController::class)->listByDate($finicial, $ffinal, '');
        $totalIngresos = intval($ingresos->original->ventas) + intval($ingresos->original->ingresos);
        $gastos = app(GastosController::class)->listByDate($finicial, $ffinal, '');
        $totalGastos = intval($gastos->original->gastos);
        $proveedores = app(ProveedoresController::class)->listByDate($finicial, $ffinal, '');
        $totalProviders=intval($proveedores->original->totalProveedores);
        $objeto = new stdClass();
        $objeto->totalGastos = $totalGastos;
        $objeto->totalIngresos = $totalIngresos;
        $objeto->totalProviders=$totalProviders;
        return response()->json($objeto, 200, []);
    }

    public function topVentasCantidad($finicial, $ffinal)
    {
        // Obtengo los productos de las listas
        $prods = DB::table('productos')->get();
        $ventas = DB::table('lista_compras')->whereBetween('fecha', [$finicial, $ffinal])->get();
        foreach ($ventas as $item) {
            $listaProductos = DB::table('lista_productos_comprados')->where('cliente', '=', $item->cliente)->where('compra_n', '=', $item->compra_n)->get();
            $item->productos = $listaProductos;
        }
        $listaVentas = [];
        $listaCodigos = [];
        foreach ($prods as $item) {
            foreach ($ventas as $v) {
                foreach ($v->productos as $i) {
                    if ($item->id == $i->codigo) {
                        $listaVentas[] = $i;
                        $listaCodigos[] = $i->codigo;
                    }
                }
            }
        }
        //Listo los codigos sin repetirlos
        $distinc = array_unique($listaCodigos);
        $filter = [];
        //Busco de cada codigo las ventas y las sumo
        foreach ($distinc as $d) {
            $sumar = new stdClass();
            $totalCant = 0;
            foreach ($listaVentas as $v) {
                if ($v->codigo == $d) {
                    $totalCant = $totalCant + $v->cantidad;
                    $sumar->codigo = $v->codigo;
                    $sumar->producto = $v->producto;
                    $sumar->cant = $totalCant;
                    $sumar->precio = $v->precio;
                }
            }
            $filter[] = $sumar;
        }
        // Ordena de mayor a menor por cantidad
        usort($filter, $this->object_sorter('cant', 'DESC'));
        return response()->json($filter, 200, []);
    }

    public function topClientesCantidad($finicial, $ffinal)
    {
        // Obtengo  lista clientes
        $getClientes = DB::table('clientes')->get();
        $clientes=[];
        foreach($getClientes as $c){
            if($c->cedula!=''){
                $clientes[]=$c;
            }
        }
        $listClientes=[];
        foreach ($clientes as $c) {
            //Obtengo las compras de cada uno y sumo el total de todas las compras realizadas
            $compras = DB::table('lista_compras')->whereBetween('fecha', [$finicial, $ffinal])->where('cliente', '=', $c->cedula)->get();
            $totalValorCompras=0;
            foreach($compras as $compra){
                $totalValorCompras=$totalValorCompras+$compra->total_compra;
            }
            $c->totalValorCompra=$totalValorCompras;
            $c->cantidadDeCompras=count($compras);
            $listClientes[]=$c;
        }
        // Ordena de mayor a menor por cantidad
        usort($listClientes, $this->object_sorter('cantidadDeCompras', 'DESC'));
        return response()->json($listClientes, 200, []);
    }


    public function topClientesValores($finicial, $ffinal)
    {
        // Obtengo  lista clientes
        $getClientes = DB::table('clientes')->get();
        $clientes=[];
        foreach($getClientes as $c){
            if($c->cedula!=''){
                $clientes[]=$c;
            }
        }
        $listClientes=[];
        foreach ($clientes as $c) {
            //Obtengo las compras de cada uno y sumo el total de todas las compras realizadas
            $compras = DB::table('lista_compras')->whereBetween('fecha', [$finicial, $ffinal])->where('cliente', '=', $c->cedula)->get();
            $totalValorCompras=0;
            foreach($compras as $compra){
                $totalValorCompras=$totalValorCompras+$compra->total_compra;
            }
            $c->totalValorCompra=$totalValorCompras;
            $c->cantidadDeCompras=count($compras);
            $listClientes[]=$c;
        }
        // Ordena de mayor a menor por cantidad
        usort($listClientes, $this->object_sorter('totalValorCompra', 'DESC'));
        return response()->json($listClientes, 200, []);
    }

    public function topVentasValores($finicial, $ffinal)
    {
        // Obtengo los productos de las listas
        $prods = DB::table('productos')->get();
        $ventas = DB::table('lista_compras')->whereBetween('fecha', [$finicial, $ffinal])->get();
        foreach ($ventas as $item) {
            $listaProductos = DB::table('lista_productos_comprados')->where('cliente', '=', $item->cliente)->where('compra_n', '=', $item->compra_n)->get();
            $item->productos = $listaProductos;
        }
        $listaVentas = [];
        $listaCodigos = [];
        foreach ($prods as $item) {
            foreach ($ventas as $v) {
                foreach ($v->productos as $i) {
                    if ($item->id == $i->codigo) {
                        $listaVentas[] = $i;
                        $listaCodigos[] = $i->codigo;
                    }
                }
            }
        }
        //Listo los codigos sin repetirlos
        $distinc = array_unique($listaCodigos);
        $filter = [];
        //Busco de cada codigo las ventas y las sumo
        foreach ($distinc as $d) {
            $sumar = new stdClass();
            $totalCant = 0;
            $total = 0;
            foreach ($listaVentas as $v) {
                if ($v->codigo == $d) {
                    $totalCant = $totalCant + $v->cantidad;
                    $total = intval($v->precio) * intval($totalCant);
                    $sumar->codigo = $v->codigo;
                    $sumar->producto = $v->producto;
                    $sumar->cant = $totalCant;
                    $sumar->precio = $v->precio;
                    $sumar->total = $total;
                }
            }
            $filter[] = $sumar;
        }
        // Ordena de mayor a menor por cantidad
        usort($filter, $this->object_sorter('total', 'DESC'));
        return response()->json($filter, 200, []);
    }

    function object_sorter($clave, $orden = null)
    {
        return function ($a, $b) use ($clave, $orden) {
            $result =  ($orden == "DESC") ? strnatcmp($b->$clave, $a->$clave) :  strnatcmp($a->$clave, $b->$clave);
            return $result;
        };
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
        //
    }

    public function show(string $id)
    {
        //
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
