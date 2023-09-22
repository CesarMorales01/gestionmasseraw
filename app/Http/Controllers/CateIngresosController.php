<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;

class CateIngresosController extends Controller
{

    public function index()
    {
    }


    public function create()
    {
    }


    public function store(Request $request)
    {
        DB::table('categorias_ingresos')->insert([
            'nombre' => $request->nombre
        ]);
        return Redirect::route('income.list', 'Categoria de ingresos registrada!');
    }

    public function show(string $id)
    {
    }


    public function edit(string $id)
    {
        $cate = DB::table('ingresos')->where('category_id', '=', $id)->first();
        $resp = '';
        if ($cate != null) {
            $resp = 'No puedes eliminar esta categoria porque esta ocupada en algunos ingresos!';
        } else {
            DB::table('categorias_ingresos')->where('id', '=', $id)->delete();
            $resp = 'Categoria eliminada';
        }
        return response()->json($resp, 200, []);
    }

    public function update(Request $request, string $id)
    {
        
    }


    public function destroy(string $id)
    {
        
    }
}
