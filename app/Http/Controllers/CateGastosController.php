<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;

class CateGastosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        DB::table('categorias_gastos')->insert([
            'nombre' => $request->nombre
        ]);
        return Redirect::route('spend.list', 'Categoria de gastos registrada!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $cate = DB::table('gastos')->where('category_id', '=', $id)->first();
        $resp = '';
        if ($cate != null) {
            $resp = 'No puedes eliminar esta categoria porque esta ocupada en algunos gastos!';
        } else {
            DB::table('categorias_gastos')->where('id', '=', $id)->delete();
            $resp = 'Categoria eliminada';
        }
        return response()->json($resp, 200, []);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
