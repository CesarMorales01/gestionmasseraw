<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\GlobalVars;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;

class SessionController extends Controller
{
    public $global = null;

    public function __construct()
    {
        $this->global = new GlobalVars();
    }

    public function index(){
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        if($globalVars->info==null){
            return Redirect::route('setting.index');
        }else{
            return Inertia::render('Dashboard', compact('auth', 'globalVars'));
        }
    }
}
