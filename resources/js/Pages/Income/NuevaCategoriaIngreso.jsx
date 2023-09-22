import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import React from 'react'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

const NuevaCategoriaIngreso = (params) => {
    const [nombre, setNombre] = useState('')

    function cambioNombre(e) {
        setNombre(e.target.value)
    }

    function loadingOn() {
        document.getElementById('btnLoadingNuevaCategoriaIngreso').style.display = 'none'
        document.getElementById('btnLoadingNuevaCategoriaIngresoLoading').style.display = ''
    }

    function sweetAlert(mensaje) {
        Swal.fire({
            title: mensaje,
            icon: 'warning',
            timer: 1500,
        })
    }

    function confirmar() {
        if (nombre == '') {
            sweetAlert('Ingresa un nombre para la categoria!')
        } else {
            loadingOn()
            document.getElementById('formNuevaCategoria').submit()
        }
    }

    return (
        <div className="modal fade bd-example-modal-lg" id='dialogoNuevaCategoriaIngreso' tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div style={{ marginTop: '2em' }} className="modal-dialog ">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title titulo" id="exampleModalLabel">Nueva categoria</h5>
                    </div>
                    <div className='container' style={{ margin: '0.2em' }}>
                        <form action={route('cateIncome.store')} id='formNuevaCategoria' method='post'  >
                            <input type="hidden" name='_token' value={params.token} />
                            <input name='nombre' onChange={cambioNombre} className='form-control' type="text" value={nombre} placeholder='Nombre categoria' />
                        </form>
                        <br />
                        <div className="modal-footer">
                            <SecondaryButton type="button" className="btn btn-danger" onClick={params.cerrar} >Cancelar</SecondaryButton>
                            <PrimaryButton type="button" id='btnLoadingNuevaCategoriaIngreso' className="btn btn-success" onClick={confirmar}>Crear categoria</PrimaryButton>
                            <button id='btnLoadingNuevaCategoriaIngresoLoading' style={{ display: 'none', backgroundColor: '#365a3b' }} className="btn btn-primary" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Loading...
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NuevaCategoriaIngreso
