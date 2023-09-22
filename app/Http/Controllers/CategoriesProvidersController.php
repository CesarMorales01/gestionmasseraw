<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;

class CategoriesProvidersController extends Controller
{
  
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
        DB::table('categorias_proveedores')->insert([
            'nombre'=>$request->nombre
        ]);
        return Redirect::route('provider.list', 'Categoria de proveedores registrada!');
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        $cate = DB::table('proveedores')->where('categoria', '=', $id)->first();
        $resp = '';
        if ($cate != null) {
            $resp = 'No puedes eliminar esta categoria porque esta ocupada en algunos proveedores!';
        } else {
            DB::table('categorias_proveedores')->where('id', '=', $id)->delete();
            $resp = 'Categoria eliminada';
        }
        return response()->json($resp, 200, []);
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
