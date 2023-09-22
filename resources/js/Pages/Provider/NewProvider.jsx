import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions'
import SelectCategoriesNewIncome from '../Income/SelectCategoriesNewIncome';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2'

const NewProvider = (params) => {

    const glob = new GlobalFunctions()
    const [provider, setProvider] = useState({
        fecha: '',
        nombre: '',
        categoria: '',
        nombreCategoria: '',
        valor: 0,
        descripcion: ''
    })
    const [categorias] = useState(params.categorias)

    useEffect(() => {
        fechaHoy()
        // Inicializar categoria
        if (provider.categoria === '' && categorias.length > 0) {
            setProvider((valores) => ({
                ...valores,
                categoria: categorias[0].id,
                nombreCategoria: categorias[0].nombre
            }))
        }
    }, [])

    function validar() {
        if (provider.valor != '' && provider.valor && provider.categoria!='') {
            loadingOn()
            document.getElementById('formCrear').submit()
        } else {
            sweetAlert()
        }
    }

    function sweetAlert() {
        Swal.fire({
            title: 'Ingresa nombre, categoria y/o valor!',
            icon: 'warning',
            timer: 1500,
        })
    }

    function cambioValor(e) {
        setProvider((valores) => ({
            ...valores,
            valor: e.target.value
        }))
    }

    function cambioNombre(e) {
        setProvider((valores) => ({
            ...valores,
            nombre: e.target.value
        }))
    }

    function cambioComentario(e) {
        setProvider((valores) => ({
            ...valores,
            descripcion: e.target.value
        }))
    }

    function fechaHoy() {
        setTimeout(() => {
            if (provider.fecha === '') {
                setProvider((valores) => ({
                    ...valores,
                    fecha: glob.getFecha()
                }))
            }
        }, 100);
    }

    function loadingOn() {
        document.getElementById('btnAgregarIngreso').style.display = 'none'
        document.getElementById('btnAgregarIngresoLoading').style.display = ''
    }

    function cambioCategoria(e) {
        const filter = categorias.filter((art) => art.id == e.target.value)
        setProvider((valores) => ({
            ...valores,
            categoria: e.target.value,
            nombreCategoria: filter[0].nombre
        }))
    }

    function cambioFecha(e) {
        setProvider((valores) => ({
            ...valores,
            fecha: e.target.value
        }))
    }

    return (
        <div style={{ padding: '1em' }} className="modal fade bd-example-modal-lg" id='dialogoNewProvider' tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title titulo" id="exampleModalLabel">Nuevo proveedor</h5>
                    </div>
                    <div className='container' style={{ margin: '0.2em' }}>
                        <label style={{ marginTop: '0.4em' }}>Fecha:</label>
                        <br />
                        <form method="POST" id="formCrear" action={route('provider.store')} >
                            <input type="hidden" name='_token' value={params.token} />
                            <input name="fecha" type="date" value={provider.fecha} className='form-control border' onChange={cambioFecha} id="inputDate" />
                            <label style={{ marginTop: '0.5em' }}>Selecciona categoria:</label>
                            <SelectCategoriesNewIncome getCategoria={cambioCategoria} categorias={categorias} />
                            <label style={{ marginTop: '0.2em' }}>Categoria seleccionada:</label>
                            <input type="hidden" name='categoria' value={provider.categoria} />
                            <input type={'text'} className='form-control border' disabled value={provider.nombreCategoria}></input>
                            <div className='row'>
                                <div className='col-6'>
                                    <label style={{ marginTop: '0.5em' }}>Nombre:</label>
                                    <br />
                                    <input name='nombre' onChange={cambioNombre} className='form-control border' type="text" placeholder='Nombre' value={provider.nombre} />
                                </div>
                                <div className='col-6'>
                                    <label style={{ marginTop: '0.5em' }}>Valor:</label>
                                    <br />
                                    <input name='valor' onChange={cambioValor} className='form-control border' type="number" placeholder='Valor' value={provider.valor} />
                                </div>
                            </div>
                            <br />
                            <textarea name='descripcion' onChange={cambioComentario} className='form-control border' placeholder='Descripcion' value={provider.descripcion}></textarea>
                        </form>
                        <div style={{ marginTop: '1em', marginBottom: '1em' }} className="col text-center">
                            <div className="modal-footer">
                                <SecondaryButton type="button" style={{ backgroundColor: '#d22c21' }} data-dismiss="modal">Cancelar</SecondaryButton>
                                <PrimaryButton id='btnAgregarIngreso' onClick={validar} type="button" style={{ backgroundColor: '#228b22' }}>Ingresar</PrimaryButton>
                                <button id='btnAgregarIngresoLoading' style={{ display: 'none', backgroundColor: 'red' }} className="btn btn-primary" type="button" disabled>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Loading...
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewProvider