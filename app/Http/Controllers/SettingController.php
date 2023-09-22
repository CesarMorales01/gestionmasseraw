<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\GlobalVars;
use Illuminate\Support\Facades\Redirect;

class SettingController extends Controller
{
    public $global = null;

    public function __construct()
    {
        $this->global = new GlobalVars();
    }

    public function getLogo()
    {
        $globalVars = $this->global->getGlobalVars();
        $info = DB::table('info_pagina')->first();
        $info->globalVars = $globalVars;
        return response()->json($info, 200, []);
    }

    public function index()
    {
        $tels = DB::table('telefonos_pagina')->get();
        $telefonos = [];
        foreach ($tels as $telefono) {
            $telefonos[] = $telefono->telefono;
        }
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info=DB::table('info_pagina')->first();
        $token = csrf_token();
        return Inertia::render('Setting/Settings', compact('auth', 'globalVars', 'token', 'telefonos'));
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        
        DB::table('info_pagina')->updateOrInsert(
            ['id' => $request->id],
            [
                'nombre' => $request->nombre,
                'descripcion_pagina' => $request->descripcion_pagina,
                'direccion_pagina' => $request->direccion_pagina,
                'color_pagina' => $request->color_pagina,
                'correo' => $request->correo,
                'comision_pasarela_pagos' => $request->comision,
                'linkfb' => $request->fb,
                'linkinsta' => $request->insta
            ]
        );
        $info = DB::table('info_pagina')->first();
        $this->ingresarLogo($request, $info->id);
        $this->ingresarImagen($request, $info->id);
        $this->ingresar_telefonos($request);
        return Redirect::route('setting.index');
    }

    public function ingresarImagen($request, $id)
    {
        if ($request->hasFile('imagen')) {
            if ($request->imagenAnterior != '') {
                unlink($this->global->getGlobalVars()->dirImagenes . $request->imagenAnterior);
            }
            $file = $request->file('imagen');
            $fileName = $file->getClientOriginalName();
            $upload = $request->file('imagen')->move($this->global->getGlobalVars()->dirImagenes, $fileName);
            DB::table('info_pagina')->where('id', '=', $id)->update(
                [
                    'imagen' => $fileName
                ]
            );
        }
    }

    public function ingresarLogo($request, $id)
    {
        if ($request->hasFile('logo')) {
            if ($request->logoAnterior != '') {
                unlink($this->global->getGlobalVars()->dirImagenes . $request->logoAnterior);
            }
            $file = $request->file('logo');
            $fileName = $file->getClientOriginalName();
            $upload = $request->file('logo')->move($this->global->getGlobalVars()->dirImagenes, $fileName);
            DB::table('info_pagina')->where('id', '=', $id)->update(
                [
                    'logo' => $fileName
                ]
            );
        }
    }

    public function ingresar_telefonos($request)
    {
        DB::table('telefonos_pagina')->delete();
        for ($i = 0; $i < count($request->telefonos); $i++) {
            $token = strtok($request->telefonos[$i], ",");
            while ($token !== false) {
                DB::table('telefonos_pagina')->insert([
                    'telefono' => $token
                ]);
                $token = strtok(",");
            }
        }
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
