<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Jhon',
            'email' => 'Jhongarcia20@outlook.com',
            'password' => Hash::make('SanBernardoV')
        ]);
        /*
        DB::table('categorias')->insert([
            'nombre'=> 'Helados',
             'imagen'=> 'helado.jpg'
        ]);
        $id = DB::getPdo()->lastInsertId();

        DB::table('productos')->insert([
            'category_id'=> $id,
            'nombre'=> 'Helado de fresa',
            'descripcion'=> 'Delicioso helado de fresa con crema de maní',
            'valor'=>'4000'
        ]);
        $id = DB::getPdo()->lastInsertId();
        DB::table('imagenes_productos')->insert([
            'nombre_imagen'=>'heladofresa.jpg',
            'fk_producto'=>$id
        ]);

        DB::table('categorias_ingresos')->insert([
            'nombre'=> 'Rendimientos financieros',
        ]);
        
        DB::table('ingresos')->insert([
            'fecha'=>now(),
            'category_id'=>DB::getPdo()->lastInsertId(),
            'valor'=>10000,
            'comentario'=>'Intereses cdt'
        ]);

*/
        
        

    }
}
