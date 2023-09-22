import React from 'react'
import Select from 'react-select'
import { useState, useEffect } from 'react'

const SelectCategoriesNewIncome = (params) => {
    const [options, setOptions]= useState([])
    const customStyles = {
        option: (provided, state) => ({
          ...provided,
          borderBottom: '1px dotted pink',
          color: 'black',
          padding: 6,
        }),
        singleValue: (provided, state) => {
          const opacity = 1;
          const transition = 'opacity 500ms';
          return { ...provided, opacity, transition };
        }
      }

    useEffect(() => {
        if(params.categorias.length>0 && params.categorias.length!==options.length){
            cargarDatos()
        }
    })

    function cargarDatos(){
          let opts=[]
            for (let i=0; i<params.categorias.length; i++){
                let item= new OptionsAuto(params.categorias[i].id, params.categorias[i].nombre)
                opts.push(item)
            }
            setOptions(opts)
    }

    function getChange(e){
       const input=document.getElementById('inputSelectCategoria')
       input.value=e.codigo
       input.click()  
    }

  return (
    <div>
        <input type='hidden' id='inputSelectCategoria' onClick={params.getCategoria} />
        <Select placeholder='Selecciona categoria' styles={customStyles} id='selectCategorias' onChange={getChange} options={options} />
    </div>
  )
}

export default SelectCategoriesNewIncome

class OptionsAuto {
    constructor(codigo, label) {
        this.codigo = codigo;
        this.label = label;
    }
} 