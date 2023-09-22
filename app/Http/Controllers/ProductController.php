<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Query\JoinClause;
use App\Models\GlobalVars;
use App\Traits\MetodosGenerales;
use stdClass;

class ProductController extends Controller
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
        $productos = DB::table('productos')->paginate(100);
        foreach ($productos as $p) {
            $cate = DB::table('categorias')->where('nombre', '=', $p->categoria)->first();
            $p->categoria = $cate->nombre;
        }
        return Inertia::render('Product/Products', compact('auth', 'productos', 'globalVars'));
    }

    public function allproducts()
    {
        return response()->json($this->all_products(), 200, []);
    }

    public function create()
    {
        $categorias = DB::table('categorias')->get();
        $producto = ['id' => '', 'nombre' => '', 'imagen' => ''];
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $token = csrf_token();
        return Inertia::render('Product/NewProduct', compact('producto', 'categorias', 'globalVars', 'token'));
    }

    public function store(Request $request)
    {
        $id = '';
        if ($request->hasFile('imagen')) {
            $file = $request->file('imagen');
            $fileName = time() . "-" . $file->getClientOriginalName();
            $upload = $request->file('imagen')->move($this->global->getGlobalVars()->dirImagenes, $fileName);
            $id = $this->ingresarProducto($request);
            DB::table('imagenes_productos')->insert([
                'nombre_imagen' => $fileName,
                'fk_producto' => $id
            ]);
        } else {
            $id = $this->ingresarProducto($request);
        }
        $producto = DB::table('productos')->where('id', '=', $id)->get();
        foreach ($producto as $item) {
            $imagenes = DB::table('imagenes_productos')->where('fk_producto', '=', $id)->first();
            if ($imagenes == null) {
                $item->nombre_imagen = '';
            } else {
                $item->nombre_imagen = $imagenes->nombre_imagen;
            }
        }
        $categorias = DB::table('categorias')->get();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $token = csrf_token();
        $estado = "¡Producto registrado!";
        $auth = Auth()->user();
        return Inertia::render('Product/NewProduct', compact('producto', 'categorias', 'globalVars', 'estado', 'token'));
    }

    public function ingresarProducto($request)
    {
        DB::table('productos')->insert([
            'referencia' => $request->referencia,
            'categoria' => $request->categoria,
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'cantidad' => $request->cantidad,
            'costo' => $request->costo,
            'valor' => $request->valor
        ]);
        return DB::getPdo()->lastInsertId();
    }

    public function show(string $id)
    {
        // Eliminar en este metodo porque no se conseguido reescribir el method get por delete en el form react....
        // $validarEliminar = DB::table('promociones')->where('ref_producto', '=', $id)->first();
        $validarEliminar = null;
        if ($validarEliminar != null) {
            $estado = "¡No puedes eliminar este producto porque esta en algunas promociones!";
            $duracionAlert = 2000;
        } else {
            $estado = "¡Producto eliminado!";
            $duracionAlert = 1000;
            $producto = DB::table('productos')->join('imagenes_productos', function (JoinClause $join) use ($id) {
                $join->on('productos.id', '=', 'imagenes_productos.fk_producto')
                    ->where('productos.id', '=', $id);
            })->get();
            $deleted = DB::table('productos')->where('id', '=', $id)->delete();
            $deleted1 = DB::table('imagenes_productos')->where('fk_producto', '=', $id)->delete();
            // $deleted2 = DB::table('preguntas_sobre_productos')->where('producto', '=', $id)->delete();
            if ($deleted1) {
                for ($i = 0; $i < count($producto); $i++) {
                    unlink($this->global->getGlobalVars()->dirImagenes . $producto[$i]->nombre_imagen);
                }
            }
        }
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $productos = DB::table('productos')->paginate(100);
        foreach ($productos as $p) {
            $cate = DB::table('categorias')->where('nombre', '=', $p->categoria)->first();
            $p->categoria = $cate->nombre;
        }
        return Inertia::render('Product/Products', compact('auth', 'productos', 'estado', 'globalVars', 'duracionAlert'));
    }

    public function edit(string $id)
    {
        //Este metodo devuelve un array, por tanto en componente react se debe tomar en los parms[0] y el id se registra en fk_producto.
        $producto = DB::table('productos')->where('id', '=', $id)->get();
        foreach ($producto as $item) {
            $imagenes = DB::table('imagenes_productos')->where('fk_producto', '=', $id)->first();
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
        $categorias = DB::table('categorias')->get();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $token = csrf_token();
        return Inertia::render('Product/NewProduct', compact('producto', 'categorias', 'globalVars', 'token'));
    }

    public function update(Request $request, string $id)
    {
        return response()->json("no llega a update" . $id, 200, []);
    }

    public function destroy(string $id)
    {
        return response()->json("no llega a delete" . $id, 200, []);
    }

    public function actualizar(Request $request, string $id)
    {
        DB::table('productos')->where('id', $id)->update([
            'referencia' => $request->referencia,
            'categoria' => $request->categoria,
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'cantidad' => $request->cantidad,
            'costo' => $request->costo,
            'valor' => $request->valor,
        ]);
        $producto = DB::table('productos')->where('id', '=', $id)->get();
        foreach ($producto as $item) {
            $imagenes = DB::table('imagenes_productos')->where('fk_producto', '=', $id)->first();
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
        $categorias = DB::table('categorias')->get();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $estado = "¡Producto actualizado!";
        $token = csrf_token();
        return Inertia::render('Product/NewProduct', compact('producto', 'categorias', 'globalVars', 'estado', 'token'));
    }

    public function getimages(string $id)
    {
        $imagenes = DB::table('imagenes_productos')->where('fk_producto', '=', $id)->get();
        $list=[];
        foreach($imagenes as $i){
            $list[]=$i;
        }
        $producto = DB::table('productos')->where('id', '=', $id)->first();
        if ($producto->imagen != '') {
            $token = strtok($producto->imagen, "||");
            while ($token !== false) {
                $img=new stdClass();
                //LLenar con vacio porque al construir la ruta no debe ir ''
                $img->id='vacio';
                $img->nombre_imagen=$token;
                $list[]=$img;
                $token = strtok("||");
            }
        }
        return response()->json($list, 200, []);
    }

    public function image(Request $request, string $id)
    {
        if ($request->hasFile('image')) {
            $fileName = time() . "-" . $request->name;
            $request->file('image')->move($this->global->getGlobalVars()->dirImagenes, $fileName);
            DB::table('imagenes_productos')->insert([
                'nombre_imagen' => $fileName,
                'fk_producto' => $id
            ]);
            return response()->json("ok", 200, []);
        }
    }

    public function deleteImage($idImg, $nombreImg, $idProd)
    {
        // $CheckImgpromo = DB::table('promociones')->where('imagen', 'like', "%".$request->nombre."%")->first();
        $CheckImgpromo = null;
        if ($CheckImgpromo != null) {
            return response()->json('Imagen promo existe', 200, []);
        } else {
             if($idImg=='vacio'){
                $producto = DB::table('productos')->where('id', '=', $idProd)->first();
                if ($producto->imagen != '') {
                    $token = strtok($producto->imagen, "||");
                    while ($token !== false) {
                        if($nombreImg!=$token){
                            DB::table('imagenes_productos')->insert([
                                'nombre_imagen' => $token,
                                'fk_producto' => $idProd
                            ]);
                        }
                        $token = strtok("||");
                    }
                    DB::table('productos')->where('id', $idProd)->update([
                        'imagen' => ''
                    ]);
                }
             }else{
                DB::table('imagenes_productos')->where('id', '=', $idImg)->delete();
             }
            unlink($this->global->getGlobalVars()->dirImagenes . $nombreImg);
            return response()->json('ok', 200, []);
        }
    }
}
