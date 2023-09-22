import React from 'react'
import Select from 'react-select'
import { useState, useEffect } from 'react';

const SelectMunicipios = (params) => {
  const [options, setOptions]= useState([])

    useEffect(() => {
      cargarDatos()
    }, [])

  function cargarDatos(){
      if(options.length==0){
        let opts=[]
          for (let i=0; i<params.ciudades.length; i++){
              let item= new OptionsAuto(params.ciudades[i].id, params.ciudades[i].nombre)
              opts.push(item)
          }
          setOptions(opts)
      } 
  }

  function getChange(e){
    document.getElementById('inputValue').value=e.codigo
    document.getElementById('inputValue').click()
  }  

  return (
    <div>
        <input type='hidden' id='inputValue' onClick={params.getMunicipio} />
        <Select  onChange={getChange} options={options} />
   </div>   
  )
}

export default SelectMunicipios

class OptionsAuto {
    constructor(codigo, label) {
        this.codigo = codigo;
        this.label = label;
}

}