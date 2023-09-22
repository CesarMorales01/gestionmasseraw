<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Database\Query\JoinClause;
use App\Models\GlobalVars;

class PromocionesController extends Controller
{
    public $global = null;

    public function __construct()
    {
        $this->global = new GlobalVars();
    }

    public function index(): Response
    {
        $auth = Auth()->user();
        $promos = DB::table('promociones_mercaya')->orderBy('id', 'desc')->get();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        return Inertia::render('Promociones/Promociones', compact('auth', 'promos', 'globalVars'));
    }

    public function create(): Response
    {
        $productos = DB::table('productos')->get();
        foreach ($productos as $item) {
            $imagenes = DB::table('imagenes_productos')->where('fk_producto', '=', $item->id)->first();
            if ($imagenes == null) {
                $item->nombre_imagen = '';
            } else {
                $item->nombre_imagen = $imagenes->nombre_imagen;
            }
            if ($item->imagen != '') {
                $token = strtok($item->imagen, "||");
                $item->nombre_imagen = $token;
            }
        }
        $promo = ['id' => '', 'descripcion' => '', 'imagen' => ''];
        $globalVars = $this->global->getGlobalVars();
        $token = csrf_token();
        $auth = Auth()->user();
        $globalVars->info = DB::table('info_pagina')->first();
        return Inertia::render('Promociones/NewPromo', compact('productos', 'promo', 'globalVars', 'token', 'auth'));
    }

    public function store(Request $request): Response
    {
        $fileName = "";
        if ($request->hasFile('imagen')) {
            $file = $request->file('imagen');
            $fileName = time() . "-" . $request->nombreImagen;
            $upload = $request->file('imagen')->move($this->global->getGlobalVars()->dirImagenes, $fileName);
        } else {
            $fileName = $request->nombreImagen;
        }
        DB::table('promociones_mercaya')->insert([
            'descripcion' => $request->descripcion,
            'imagen' => $fileName,
            'ref_producto' => $request->ref_producto
        ]);
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $promos = DB::table('promociones_mercaya')->orderBy('id', 'desc')->get();
        $estado = "¡Promoción creada!";
        $info = DB::table('info_pagina')->first();
        return Inertia::render('Promociones/Promociones', compact('auth', 'promos', 'globalVars', 'estado', 'info'));
    }

    public function show(string $id)
    {
        // Eliminar en este metodo porque no se conseguido reescribir el method get por delete en el form react....
        $promo = DB::table('promociones_mercaya')->where('id', '=', $id)->first();
        $imagen = DB::table('imagenes_productos')->where('nombre_imagen', '=', $promo->imagen)->first();
        $imgTablaProd = DB::table('productos')->where('imagen', 'like', "%" . $promo->imagen . "%")->first();
        if ($imagen == null && $imgTablaProd == null) {
            unlink($this->global->getGlobalVars()->dirImagenes . $promo->imagen);
        }
        $deleted = DB::table('promociones_mercaya')->where('id', '=', $id)->delete();
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $promos = DB::table('promociones_mercaya')->orderBy('id', 'desc')->get();
        $estado = "¡Promoción eliminada!";
        $globalVars->info = DB::table('info_pagina')->first();
        return Inertia::render('Promociones/Promociones', compact('auth', 'promos', 'globalVars', 'estado'));
    }

    public function edit(string $id): Response
    {
        $productos = DB::table('productos')->get();
        foreach ($productos as $item) {
            $imagenes = DB::table('imagenes_productos')->where('fk_producto', '=', $item->id)->first();
            if ($imagenes == null) {
                $item->nombre_imagen = '';
            } else {
                $item->nombre_imagen = $imagenes->nombre_imagen;
            }
            if ($item->imagen != '') {
                $token = strtok($item->imagen, "||");
                $item->nombre_imagen = $token;
            }
        }
        $promo = DB::table('promociones_mercaya')->where('id', '=', $id)->first();
        $globalVars = $this->global->getGlobalVars();
        $token = csrf_token();
        $auth = Auth()->user();
        $globalVars->info = DB::table('info_pagina')->first();
        return Inertia::render('Promociones/NewPromo', compact('productos', 'promo', 'globalVars', 'token', 'auth'));
    }

    public function update(Request $request, string $id)
    {
        return response()->json("update" . $id, 200, []);
    }

    public function destroy(string $id)
    {
        echo "destroy" . $id;
    }

    public function actualizar(Request $request, string $id)
    {
        $fileName = "";
        if ($request->hasFile('imagen')) {
            $file = $request->file('imagen');
            $fileName = time() . "-" . $request->nombreImagen;
            $upload = $request->file('imagen')->move($this->global->getGlobalVars()->dirImagenes, $fileName);
            $imagen = DB::table('imagenes_productos')->where('nombre_imagen', '=', $request->nombreImagenAnterior)->first();
            $imgTablaProd = DB::table('productos')->where('imagen', 'like', "%" . $request->nombreImagenAnterior . "%")->first();
            if ($imagen == null && $imgTablaProd == null) {
                unlink($this->global->getGlobalVars()->dirImagenes . $request->nombreImagenAnterior);
            }
        } else {
            $fileName = $request->nombreImagen;
            $imagen = DB::table('imagenes_productos')->where('nombre_imagen', '=', $request->nombreImagenAnterior)->first();
            $imgTablaProd = DB::table('productos')->where('imagen', 'like', "%" . $request->nombreImagenAnterior . "%")->first();
            if ($imagen == null && $imgTablaProd == null) {
                unlink($this->global->getGlobalVars()->dirImagenes . $request->nombreImagenAnterior);
            }
        }
        DB::table('promociones_mercaya')->where('id', $id)->update([
            'descripcion' => $request->descripcion,
            'imagen' => $fileName,
            'ref_producto' => $request->ref_producto
        ]);
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $promos = DB::table('promociones_mercaya')->orderBy('id', 'desc')->get();
        $estado = "¡Promoción actualizada!";
        $globalVars->info = DB::table('info_pagina')->first();
        return Inertia::render('Promociones/Promociones', compact('auth', 'promos', 'globalVars', 'estado'));
    }
}
