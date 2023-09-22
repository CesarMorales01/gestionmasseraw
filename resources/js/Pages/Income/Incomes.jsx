import React from 'react'
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import '../../../css/general.css'
import GlobalFunctions from '../services/GlobalFunctions'
import newLogo from '../../../../public/Images/Config/plus.png'
import listLogo from '../../../../public/Images/Config/list.png'
import SelectCategorias from './SelectCategorias';
import CategoriasIngresos from './CategoriasIngresos';
import Swal from 'sweetalert2'
import TablaIngresos from './TablaIngresos';
import NuevoIngreso from './NuevoIngreso';

const Gastos = (params) => {

    const glob = new GlobalFunctions()
    const [totalIngresos, setTotalIngresos] = useState(params.ingresos)
    const [totalVentas, setTotalVentas] = useState(params.ventas)
    const [listaIngresos, setListaIngresos] = useState(params.listaIngresos)
    const [cargar, setCargar] = useState(false)
    const [fechas, setFechas] = useState({
        fechaInicio: '',
        fechaFinal: ''
    })
    const [filtrarCategoria, setFiltrarCategoria] = useState('')
    const [noDatos, setNoDatos] = useState(false)

    useEffect(() => {
        if (cargar) {
            cargarDatos()
        }
    }, [listaIngresos, fechas, filtrarCategoria, totalVentas])


    useEffect(() => {
        cargarFechas()
        if (params.estado != '') {
            sweetAlert(params.estado)
        }
    }, [])

    useEffect(() => {
        if (listaIngresos.length == 0) {
          setNoDatos(true)
        } else {
          setNoDatos(false)
        }
      }, [listaIngresos])

    function cargarDatos() {
        const url = params.globalVars.myUrl + 'income/list/bydate/' + fechas.fechaInicio + '/' + fechas.fechaFinal + '/' + filtrarCategoria
        fetch(url)
            .then((response) => {
                return response.json()
            }).then((json) => {
                setCargar(false)
                setTotalIngresos(json.ingresos)
                setTotalVentas(json.ventas)
                setListaIngresos(json.listaIngresos)
            })
    }

    function sweetAlert(mensaje) {
        Swal.fire({
            title: mensaje,
            icon: params.estado.includes('elimin') ? 'warning' : 'success',
            timer: params.estado.includes('elimin') ? 1500 : 1000
        })
    }

    function cargarFechas() {
        const fechaHoy = glob.getFecha().split("-")
        // Para obtener ultimo dia del mes.
        const date = new Date(fechaHoy[0], fechaHoy[1], 0).toLocaleDateString("en-US")
        const ultimoDia = date.split('/')
        setFechas({
            fechaInicio: fechaHoy[0] + "-" + fechaHoy[1] + "-01",
            fechaFinal: fechaHoy[0] + "-" + fechaHoy[1] + "-" + ultimoDia[1]
        })
    }

    function newIncome() {
        document.getElementById('btnDialogoNuevoGasto').click()
    }

    function goCategories() {
        document.getElementById('btnDialogoCategorias').click()
    }

    function cambioFechaInicio(e) {
        setCargar(true)
        setFechas((valores) => ({
            ...valores,
            fechaInicio: e.target.value
        }))
    }

    function cambioFechaFinal(e) {
        setCargar(true)
        setFechas((valores) => ({
            ...valores,
            fechaFinal: e.target.value
        }))
    }

    function cambioCategoria(e) {
        setCargar(true)
        setFiltrarCategoria(e.target.value)
    }

    function reiniciarFiltrarCategoria() {
        if(filtrarCategoria!=''){
            setCargar(true)
            setFiltrarCategoria('')
        }   
    }

    function mesAnterior() {
        setCargar(true)
        let fechaHoy = fechas.fechaInicio.split("-")
        let iMesMenos = fechaHoy[1] - 1

        let ano = fechaHoy[0]
        if (fechaHoy[1] == 1) {
            iMesMenos = 12
            ano = fechaHoy[0] - 1
        }
        if (iMesMenos < 10) {
            iMesMenos = '0' + iMesMenos
        }
        const nuevaFechaInicial = ano + "-" + iMesMenos + "-" + fechaHoy[2]
        //Restar fecha final
        const date = new Date(ano, iMesMenos, 0).toLocaleDateString("en-US")
        const ultimoDia = date.split('/')
        const nuevaFechaFinal = ano + "-" + iMesMenos + "-" + ultimoDia[1]
        setFechas((valores) => ({
            ...valores,
            fechaInicio: nuevaFechaInicial,
            fechaFinal: nuevaFechaFinal
        }))
    }

    function mesSiguiente() {
        setCargar(true)
        let fechaHoy = fechas.fechaFinal.split("-")
        let FMesMas = parseInt(fechaHoy[1]) + parseInt(1)
        let ano = fechaHoy[0]
        if (fechaHoy[1] == 12) {
            FMesMas = 1
            ano = parseInt(fechaHoy[0]) + parseInt(1)
        }
        if (FMesMas < 10) {
            FMesMas = '0' + FMesMas
        }
        const date = new Date(ano, FMesMas, 0).toLocaleDateString("en-US")
        const ultimoDia = date.split('/')
        const nuevaFechaFinal = ano + "-" + FMesMas + "-" + ultimoDia[1]
        setFechas((valores) => ({
            ...valores,
            fechaInicio: ano + "-" + FMesMas + "-01",
            fechaFinal: nuevaFechaFinal
        }))
    }

    return (
        <AuthenticatedLayout
            user={params.auth} globalVars={params.globalVars}
        >
            <Head title="Ingresos" />
            <div className='container'>
                <div style={{ marginTop: '0.2em' }} align="center" className="row justify-content-center">
                    <div style={{ marginTop: '0.8em' }} className="row">
                        <div onClick={newIncome} className="col-lg-6 col-md-6 col-sm-6 col-6"  >
                            <div className="card border border-primary card-flyer pointer">
                                <img style={{ width: '8em', height: '4em', marginTop: '1em' }} src={newLogo} className="card-img-top img-fluid centerImg" alt="" />
                                <h2 style={{ marginTop: '0.2em' }} className="card-title titulo">Nuevo ingreso</h2>
                            </div>
                        </div>
                        <div onClick={goCategories} className="col-lg-6 col-md-6 col-sm-6 col-6"  >
                            <div className="card border border-primary card-flyer pointer">
                                <img style={{ width: '3em', height: '4em', marginTop: '1em' }} src={listLogo} className="card-img-top img-fluid centerImg" alt="" />
                                <h2 style={{ marginTop: '0.2em', fontSize: '17px', color: 'black', fontWeight: 'bold' }} className="card-title">Categorias ingresos</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: '0.5em', textAlign: 'center' }} className="col-12" >
                    <span style={{ display: cargar ? '' : 'none' }} className="spinner-border text-primary" role="status" aria-hidden="true"></span>
                </div>
                <div style={{ marginTop: '0.5em' }} className="row justify-content-center">
                    <div style={{ textAlign: 'center' }} className='row col-lg-6 col-md-6 col-sm-12 col-12'>
                        <label className='titulo' style={{ textAlign: 'center', marginBottom: '0.2em' }}><strong>Ingresos entre</strong></label>
                        <div className="col-2">
                            <button onClick={mesAnterior} className='border border-dark rounded cursorPointer' style={{ marginTop: '0.2em', marginLeft: '0.2em', padding: '0.5em', backgroundColor: '#00722e' }} id="btn_buscar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
                                </svg>
                            </button>
                        </div>
                        <div className="col-4">
                            <input type="date" className='form-control rounded' value={fechas.fechaInicio} onChange={cambioFechaInicio} name="fecha_prest" id="inputDate" />
                        </div>
                        <div className="col-4" >
                            <input type="date" className='form-control rounded' value={fechas.fechaFinal} onChange={cambioFechaFinal} name="fecha_prest" id="inputDate" />
                        </div>
                        <div className="col-2">
                            <button onClick={mesSiguiente} className='border border-dark rounded cursorPointer' style={{ marginTop: '0.2em', marginLeft: '0.2em', padding: '0.5em', backgroundColor: '#00722e' }} id="btn_buscar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12" >
                        <div  style={{ width: '82%' }}>
                            <div style={{ marginTop: '1em' }} className="form-inline">
                                <div style={{ marginLeft: '4em' }} className="input-group">
                                    <SelectCategorias id='selectCategorias' getCategoria={cambioCategoria} categorias={params.categorias} />
                                    <button onClick={reiniciarFiltrarCategoria} className='border border-dark rounded cursorPointer' style={{ marginLeft: '0.2em', padding: '0.5em', backgroundColor: 'red' }} id="btn_buscar">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div style={{ marginTop: '1em' }} className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Total ingresos por ventas</th>
                                <th scope="col">$ {glob.formatNumber(totalVentas)}</th>
                            </tr>
                            <tr>
                                <th scope="col">Total otros ingresos</th>
                                <th scope="col">$ {glob.formatNumber(totalIngresos)}</th>
                            </tr>
                            <tr>
                                <th scope="col">Total ingresos</th>
                                <th scope="col">$ {glob.formatNumber(totalIngresos + totalVentas)}</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
            <h1 style={{ fontSize: '1.5em' }} id="titulo" className="text-center">Lista de otros ingresos</h1>
            <div className='container'>
                <TablaIngresos noDatos={noDatos} datos={listaIngresos}></TablaIngresos>
            </div>
            <button type="button" id='btnDialogoCategorias' style={{ display: 'none' }} data-toggle="modal" data-target="#dialogoCategorias"></button>
            <CategoriasIngresos globalVars={params.globalVars} token={params.token} categorias={params.categorias} />
            <button type="button" id='btnDialogoNuevoGasto' style={{ display: 'none' }} data-toggle="modal" data-target="#dialogoNuevoGasto"></button>
            <NuevoIngreso token={params.token} categorias={params.categorias}></NuevoIngreso>
        </AuthenticatedLayout>
    )
}

export default Gastos