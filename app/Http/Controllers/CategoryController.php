<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Query\JoinClause;
use App\Models\GlobalVars;

class CategoryController extends Controller
{

    public $global = null;

    public function __construct()
    {
        $this->global = new GlobalVars();
    }

    public function index(): Response
    {
        $auth = Auth()->user();
        $categorias = DB::table('categorias')->orderBy('id', 'desc')->get();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info=DB::table('info_pagina')->first();
        $token = csrf_token();
        return Inertia::render('Category/Categories', compact('auth', 'categorias', 'globalVars', 'token'));
    }

    public function create()
    {
    }

    public function store(Request $request)
    {
        if ($request->hasFile('imagen')) {
            $file = $request->file('imagen');
            $fileName = time() . "-" . $file->getClientOriginalName();
            $upload = $request->file('imagen')->move($this->global->getGlobalVars()->dirImagenesCategorias, $fileName);
            DB::table('categorias')->insert([
                'nombre' => $request->categoria,
                'imagen' => $fileName
            ]);
           
        }
        return redirect()->route('category.index');
    }

    public function show(string $id)
    {   
        $cate = DB::table('categorias')->where('id', $id)->first();
        $validarEnproductos=DB::table('productos')->where('categoria', '=', $cate->nombre)->first();
        if($validarEnproductos!=null){
            $estado = "¡No puedes eliminar esta categoria porque esta en algunos productos!";
            $duracionAlert=2000;
        }else{
            unlink($this->global->getGlobalVars()->dirImagenesCategorias . $cate->imagen);
            $deleted = DB::table('categorias')->where('id', '=', $id)->delete();
            $estado = "¡Categoria eliminada!";
            $duracionAlert=1000;
        }
        $auth = Auth()->user();
        $categorias = DB::table('categorias')->orderBy('id', 'desc')->get();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info=DB::table('info_pagina')->first();
        $token = csrf_token();
        return Inertia::render('Category/Categories', compact('auth', 'categorias', 'globalVars', 'token', 'estado', 'duracionAlert'));
    }


    public function edit(string $id)
    {
        //
    }


    public function update(Request $request, string $id)
    {
        return response()->json("update" . $id, 200, []);
    }


    public function destroy(string $id)
    {
    }

    public function actualizar(Request $request, string $id)
    {
        $categoriaAnterior=DB::table('categorias')->where('id', '=', $id)->first();
        if ($request->hasFile('imagen')) {
            $file = $request->file('imagen');
            $fileName = time() . "-" . $file->getClientOriginalName();
            $upload = $request->file('imagen')->move($this->global->getGlobalVars()->dirImagenesCategorias, $fileName);
            DB::table('categorias')->where('id', $id)->update([
                'nombre' => $request->categoria,
                'imagen' => $fileName
            ]);
            DB::table('productos')->where('categoria', '=', $categoriaAnterior->nombre)->update([
                'categoria' => $request->categoria,
            ]);
            unlink($this->global->getGlobalVars()->dirImagenesCategorias . $request->nombreImagenAnterior);
        } else {

            DB::table('categorias')->where('id', $id)->update([
                'nombre' => $request->categoria
            ]);
            DB::table('productos')->where('categoria', '=', $categoriaAnterior->nombre)->update([
                'categoria' => $request->categoria,
            ]);
        }
        $auth = Auth()->user();
        $categorias = DB::table('categorias')->orderBy('id', 'desc')->get();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info=DB::table('info_pagina')->first();
        $token = csrf_token();
        $estado = "¡Categoria actualizada!";
        $duracionAlert=1000;
        return Inertia::render('Category/Categories', compact('auth', 'categorias', 'globalVars', 'token', 'estado', 'duracionAlert'));
    }
}
