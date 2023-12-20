<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\GlobalVars;
use App\Traits\MetodosGenerales;
use stdClass;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\App;

class ShoppingController extends Controller
{
    public $global = null;
    use MetodosGenerales;

    public function __construct()
    {
        $this->global = new GlobalVars();
    }

    public function index()
    {
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $compras = DB::table('lista_compras')->orderBy('id', 'desc')->paginate(100);
        foreach ($compras as $compra) {
            if ($compra->cliente != '') {
                $cliente = DB::table('clientes')->where('cedula', '=', $compra->cliente)->first();
                $compra->cliente = $cliente;
                $lista = DB::table('lista_productos_comprados')->where('cliente', '=', $compra->cliente->cedula)->get();
                $compra->listaProductos = $lista;
            }
        }
        $token = csrf_token();
        return Inertia::render('Shopping/Shopping', compact('auth', 'compras', 'globalVars', 'token'));
    }

    public function create()
    {
        $deptos = DB::table('departamentos')->get();
        $municipios = DB::table('municipios')->get();
        $getClientes  = $this->all_clientes();
        $clientes = [];
        foreach ($getClientes as $c) {
            if ($c->cedula != '') {
                $clientes[] = $c;
            }
        }
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $productos = $this->all_products();
        $token = csrf_token();
        $datosCompra = new stdClass();
        $datosCompra->id = '';
        return Inertia::render('Shopping/NewShopping', compact('auth', 'clientes', 'globalVars', 'deptos', 'municipios', 'productos', 'token', 'datosCompra'));
    }

    public function save(Request $request)
    {
        $datos = json_decode(file_get_contents('php://input'));
        $compra_n = 1;
        if ($datos->cliente != '') {
            $compra_n = strval($this->get_compra_n($datos->cliente));
        }
        DB::table('lista_compras')->insert([
            'cliente' => $datos->cliente,
            // 'comentario_cliente' => $datos->comentario_cliente,
            'compra_n' => $compra_n,
            'fecha' => $datos->fecha,
            'total_compra' => $datos->total_compra,
            'domicilio' => $datos->domicilio,
            'medio_de_pago' => $datos->medio_de_pago,
            'costo_medio_pago' => $datos->costo_medio_pago,
            'comentarios' => $datos->comentarios,
            'dinerorecibido' => $datos->dinerorecibido,
            'cambio' => $datos->cambio,
            'estado' => 'Recibida',
            'vendedor' => Auth()->user()->name
        ]);
        $id = DB::getPdo()->lastInsertId();
        $nums = count($datos->listaProductos);
        for ($i = 0; $i < $nums; $i++) {
            DB::table('lista_productos_comprados')->insert([
                'cliente' => $datos->cliente,
                'compra_n' => $compra_n,
                'codigo' => $datos->listaProductos[$i]->codigo,
                'producto' => $datos->listaProductos[$i]->nombre,
                'cantidad' => $datos->listaProductos[$i]->cantidad,
                'precio' => $datos->listaProductos[$i]->precio
            ]);
            $this->restarInventario($datos->listaProductos[$i]);
        }
        return response()->json('ok', 200, []);
    }

    public function actualizar(Request $request)
    {
        $datos = json_decode(file_get_contents('php://input'));
        DB::table('lista_compras')->where('id', '=', $datos->id)->update([
            'cliente' => $datos->cliente,
            'fecha' => $datos->fecha,
            'total_compra' => $datos->total_compra,
            'domicilio' => $datos->domicilio,
            'medio_de_pago' => $datos->medio_de_pago,
            'costo_medio_pago' => $datos->costo_medio_pago,
            'comentarios' => $datos->comentarios,
            'dinerorecibido' => $datos->dinerorecibido,
            'cambio' => $datos->cambio,
            'estado' => 'Recibida'
        ]);
        $nums = count($datos->listaProductos);
        DB::table('lista_productos_comprados')->where('cliente', '=', $datos->cliente)->where('compra_n', '=', $datos->compra_n)->delete();
        // Al eliminar producto comprado se debe sumar al inventario...
        for ($i = 0; $i < $nums; $i++) {
            DB::table('lista_productos_comprados')->insert([
                'cliente' => $datos->cliente,
                'compra_n' => $datos->compra_n,
                'codigo' => $datos->listaProductos[$i]->codigo,
                'producto' => $datos->listaProductos[$i]->nombre,
                'cantidad' => $datos->listaProductos[$i]->cantidad,
                'precio' => $datos->listaProductos[$i]->precio
            ]);
            $this->restarInventario($datos->listaProductos[$i]);
        }
        return response()->json('updated', 200, []);
    }

    public function sumarInventario($item)
    {
        $actualCant = DB::table('productos')->where('id', '=', $item->codigo)->first();
        if ($actualCant) {
            if ($actualCant->cantidad != null) {
                $newCant = intval($actualCant->cantidad) + intval($item->cantidad);
                DB::table('productos')->where('id', '=', $item->codigo)->update([
                    'cantidad' => $newCant
                ]);
            }
        }
    }

    public function restarInventario($item)
    {
        $actualCant = DB::table('productos')->where('id', '=', $item->codigo)->first();
        if ($actualCant) {
            if ($actualCant->cantidad != null && $actualCant->cantidad != 0) {
                $newCant = $actualCant->cantidad - $item->cantidad;
                DB::table('productos')->where('id', '=', $item->codigo)->update([
                    'cantidad' => $newCant
                ]);
            }
        }
    }

    public function store(Request $request)
    {
        // Eliminar aqui porque no se usa para guardar y admite post...
        $validarInventario1 = DB::table('lista_productos_comprados')->where('cliente', '=', $request->cliente)->where('compra_n', '=', $request->compra_n)->get();
        // Al eliminar producto comprado se debe sumar al inventario...
        foreach ($validarInventario1 as $item) {
            $validarInventario2 = DB::table('productos')->where('id', '=', $item->codigo)->first();
            if ($validarInventario2) {
                $this->sumarInventario($item);
            }
        }
        DB::table('lista_productos_comprados')->where('cliente', '=', $request->cliente)->where('compra_n', '=', $request->compra_n)->delete();
        DB::table('lista_compras')->where('cliente', '=', $request->cliente)->where('compra_n', '=', $request->compra_n)->delete();
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $compras = DB::table('lista_compras')->orderBy('id', 'desc')->paginate(100);
        foreach ($compras as $compra) {
            if ($compra->cliente != '') {
                $cliente = DB::table('clientes')->where('cedula', '=', $compra->cliente)->first();
                $compra->cliente = $cliente;
                $lista = DB::table('lista_productos_comprados')->where('cliente', '=', $compra->cliente->cedula)->get();
                $compra->listaProductos = $lista;
            }
        }
        $token = csrf_token();
        $estado = "¡Compra eliminada!";
        return Inertia::render('Shopping/Shopping', compact('auth', 'compras', 'globalVars', 'token', 'estado'));
    }

    public function show(string $id)
    {
        //Ver venta en pdf con opcion para imprimir...
        $datosCompra = DB::table('lista_compras')->where('id', '=', $id)->first();
        $listaProductos = DB::table('lista_productos_comprados')->where('fk_compra', '=', $id)->get();
        $totalFactura = 0;
        foreach ($listaProductos as $item) {
            $subtotal = $item->precio * $item->cantidad;
            $item->subtotal = $subtotal;
            $totalFactura = $totalFactura + $subtotal;
        }
        $datosCompra->totalFactura = $totalFactura;
        $datosCompra->listaProductos = $listaProductos;
        if ($datosCompra->cliente != '') {
            $cliente = DB::table('clientes')->where('cedula', '=', $datosCompra->cliente)->first();
            $ciudad = DB::table('municipios')->where('id', '=', $cliente->ciudad)->first();
            if ($ciudad == null) {
                $ciudad = '';
                $cliente->nombreCiudad = $ciudad;
            } else {
                $cliente->nombreCiudad = $ciudad->nombre;
            }
            $telefono = DB::table('telefonos_clientes')->where('cedula', '=', $cliente->cedula)->first();
            if ($telefono == null) {
                $telefono = '';
                $cliente->telefono = $telefono;
            } else {
                $cliente->telefono = $telefono->telefono;
            }

            $datosCompra->cliente = $cliente;
        }
        $info = DB::table('info_pagina')->first();
        $telefonoPagina = DB::table('telefonos_pagina')->first();
        if ($telefonoPagina == null) {
            $info->telefono = '';
        } else {
            $info->telefono = $telefonoPagina->telefono;
        }
        $datosCompra->info = $info;
        $globalVars = $this->global->getGlobalVars();
        $datosCompra->globalVars = $globalVars;
        $data[] = $datosCompra;
        $pdf = App::make('dompdf.wrapper');
        $pdf = Pdf::loadView('Factura', compact('data'));
        return $pdf->stream('Factura-' . $datosCompra->id);
    }

    public function setSubtotal($item)
    {
        return $item->cantidad + 1;
    }

    public function edit(string $id)
    {
        $deptos = DB::table('departamentos')->get();
        $municipios = DB::table('municipios')->get();
        $getClientes = $this->all_clientes();
        $clientes = [];
        foreach ($getClientes as $c) {
            if ($c->cedula != '') {
                $clientes[] = $c;
            }
        }
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $productos = $this->all_products();
        $token = csrf_token();
        $datosCompra = DB::table('lista_compras')->where('id', '=', $id)->first();
        $listaProductos = DB::table('lista_productos_comprados')->where('cliente', '=', $datosCompra->cliente)->get();
        $datosCompra->listaProductos = $listaProductos;

        if ($datosCompra->cliente != '') {
            $cliente = DB::table('clientes')->where('cedula', '=', $datosCompra->cliente)->first();
            $datosCompra->cliente = $cliente;
        }
        return Inertia::render('Shopping/NewShopping', compact('auth', 'clientes', 'globalVars', 'deptos', 'municipios', 'productos', 'token', 'datosCompra'));
    }

    public function update(Request $request, string $id)
    {
    }

    public function destroy(string $id)
    {
    }

    public function allshopping()
    {
        $compras = DB::table('lista_compras')->get();
        foreach ($compras as $compra) {
            if ($compra->cliente != '') {
                $cliente = DB::table('clientes')->where('cedula', '=', $compra->cliente)->first();
                $compra->cliente = $cliente;
                $listaProductos = DB::table('lista_productos_comprados')->where('cliente', '=', $compra->cliente->cedula)->where('compra_n', '=', $compra->compra_n)->get();
                $compra->listaProductos = $listaProductos;
            }
        }
        return response()->json($compras, 200, []);
    }

    public function getProductosComprados($ced, $compra)
    {
        $compras = DB::table('lista_productos_comprados')->where('cliente', '=', $ced)->where('compra_n', '=', $compra)->get();
        foreach ($compras as $compra) {
            $imagenes = DB::table('imagenes_productos')->where('fk_producto', '=', $compra->codigo)->first();
            if ($imagenes == null) {
                $getProd = DB::table('productos')->where('id', '=', $compra->codigo)->first();
                if ($getProd->imagen != '') {
                    $token = strtok($getProd->imagen, "||");
                    $compra->imagen = $token;
                }
            } else {
                $compra->imagen = $imagenes->nombre_imagen;
            }
        }
        return response()->json($compras, 200, []);
    }

    public function shoppingChangeState(string $id, string $state)
    {
        DB::table('lista_compras')->where('id', '=', $id)->update([
            'estado' => $state
        ]);
        $estado = DB::table('lista_compras')->where('id', '=', $id)->pluck('estado');
        return response()->json($estado, 200, []);
    }
}
