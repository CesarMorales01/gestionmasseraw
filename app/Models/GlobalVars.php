<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use stdClass;

class GlobalVars extends Model
{
    use HasFactory;

    public $globalVars;

    function __construct()
    {
        $nombreApp="gestionmasseraw";

        $this->globalVars = new stdClass();
        //$this->globalVars->urlRoot = "https://tucasabonita.site/";
        $this->globalVars->urlRoot = "http://gestionmasseraw.test/";

        // $this->globalVars->myUrl="https://heladeria.tucasabonita.site/";
        $this->globalVars->myUrl = "http://gestionmasseraw.test/";

        $this->globalVars->dirImagenesCategorias = "C:/laragon\www/".$nombreApp."/public/Images/Categories/";
        // $this->globalVars->dirImagenesCategorias = "/home/u629086351/domains/heladeria.online/public_html/public/Images/Categories/";

        $this->globalVars->urlImagenesCategorias =  $this->globalVars->myUrl."Images/Categories/";
        // $this->globalVars->urlImagenesCategorias = "https://heladeria.online/Images/Categories/";

        $this->globalVars->dirImagenes = "C:\/laragon\www\/".$nombreApp."\/public\Images\/Products\/";
        //  $this->globalVars->dirImagenes = "/home/u629086351/domains/heladeria.online/public_html/Images/Products/";

        $this->globalVars->urlImagenes =  $this->globalVars->myUrl."Images/Products/";
        // $this->globalVars->urlImagenes="https://heladeria.online/Images/Products/";
    }


    public function getGlobalVars()
    {
        return $this->globalVars;
    }
}