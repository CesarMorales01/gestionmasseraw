import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions'
import SelectCategoriasNew from './SelectCategoriesNewIncome.jsx';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2'

const NuevoIngreso = (params) => {

    const glob = new GlobalFunctions()
    const [ingreso, setIngreso] = useState({
        fecha: '',
        categoria: '',
        nombreCategoria: '',
        valor: 0,
        comentario: ''
    })
    const [categorias] = useState(params.categorias)

    useEffect(() => {
        fechaHoy()
        // Inicializar categoria
        if (ingreso.categoria === '' && categorias.length > 0) {
            setIngreso((valores) => ({
                ...valores,
                categoria: categorias[0].id,
                nombreCategoria: categorias[0].nombre
            }))
        }
    }, [])

    function validar() {
        if (ingreso.valor != '' && ingreso.categoria!='') {
            loadingOn()
            document.getElementById('formCrear').submit()
        } else {
            sweetAlert()
        }
    }

    function sweetAlert() {
        Swal.fire({
            title: 'Ingresa categoria y/o valor!',
            icon: 'warning',
            timer: 1500,
        })
    }

    function cambioValor(e) {
        setIngreso((valores) => ({
            ...valores,
            valor: e.target.value
        }))
    }

    function cambioComentario(e) {
        setIngreso((valores) => ({
            ...valores,
            comentario: e.target.value
        }))
    }

    function fechaHoy() {
        setTimeout(() => {
            if (ingreso.fecha === '') {
                setIngreso((valores) => ({
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

    function cambioFecha(e) {
        setIngreso((valores) => ({
            ...valores,
            fecha: e.target.value
        }))
    }

    function cambioCategoria(e) {
        const filter = categorias.filter((art) => art.id == e.target.value)
        setIngreso((valores) => ({
            ...valores,
            categoria: e.target.value,
            nombreCategoria: filter[0].nombre
        }))
    }

    return (
        <div style={{ padding: '1em' }} className="modal fade bd-example-modal-lg" id='dialogoNuevoGasto' tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title titulo" id="exampleModalLabel">Nuevo ingreso</h5>
                    </div>
                    <div className='container' style={{ margin: '0.2em' }}>
                        <label style={{ marginTop: '0.4em' }}>Fecha:</label>
                        <br />
                        <form method="POST" id="formCrear" action={route('income.store')} >
                            <input type="hidden" name='_token' value={params.token} />
                            <input name="fecha" type="date" value={ingreso.fecha} className='form-control border' onChange={cambioFecha} id="inputDate" />
                            <label style={{ marginTop: '0.5em' }}>Selecciona categoria:</label>
                            <SelectCategoriasNew getCategoria={cambioCategoria} categorias={categorias} />
                            <label style={{ marginTop: '0.2em' }}>Categoria seleccionada:</label>
                            <input type="hidden" name='categoria' value={ingreso.categoria} />
                            <input type={'text'} className='form-control border' disabled value={ingreso.nombreCategoria}></input>
                            <label style={{ marginTop: '0.5em' }}>Valor:</label>
                            <br />
                            <input name='valor' onChange={cambioValor} className='form-control border' type="number" placeholder='Valor' value={ingreso.valor} />
                            <br />
                            <textarea name='comentario' onChange={cambioComentario} className='form-control border' placeholder='Comentarios' value={ingreso.comentario}></textarea>
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

export default NuevoIngreso