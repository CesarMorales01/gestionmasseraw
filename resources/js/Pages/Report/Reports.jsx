import React from 'react'
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import '../../../css/general.css'
// ReportCard.css da estilos diferentes a las cards que el estilo flyer de general.css 
import '../../../css/reportCards.css'
import GlobalFunctions from '../services/GlobalFunctions'
import Swal from 'sweetalert2'
import TopVentasValores from './TopVentasValores';
import TopClientesValores from './TopClientesValores';
import CopyRight from '../UIGeneral/CopyRight';

const Reports = (params) => {

    const glob = new GlobalFunctions()
    const [cargar, setCargar] = useState(false)
    const [totalIngresos, setTotalIngresos] = useState(params.totalIngresos)
    const [totalGastos, setTotalGastos] = useState(params.totalGastos)
    const [totalProviders, setTotalProviders] = useState(params.totalProviders)
    const [utilidad, setUtilidad] = useState(0)
    const [fechas, setFechas] = useState({
        fechaInicio: glob.getFecha(),
        fechaFinal: glob.getFecha()
    })
    const [productosMasVendidos, setProductosMasVendidos] = useState([])
    const [optionSelected, setOptionSelected] = useState('')
    const [topClientes, setTopClientes] = useState([])
    const [esteMes, setesteMes] = useState(false)

    useEffect(() => {
        calcularUtilidad()
        if (params.estado != '') {
            sweetAlert(params.estado)
        }
    }, [])

    useEffect(() => {
        if (cargar) {
            fetchListByDate()
            validarSwitch()
        }  
    }, [fechas])

    useEffect(() => {
        calcularUtilidad()
    }, [totalIngresos, totalGastos, totalProviders])

    function validarSwitch(){
        const esteMes = fechas.fechaInicio.split('-')
        const fechaHoy=glob.getFecha().split('-')
        if(esteMes[1]!=fechaHoy[1]){
            setesteMes(true)
            document.getElementById('switchEsteMes').style.display='none'
        }else{
            document.getElementById('switchEsteMes').style.display='' 
        }
    }

    function cambioesteMes(e) {
        setCargar(true)
        if (esteMes) {
            setesteMes(false)
            setFechas({
                fechaInicio: glob.getFecha(),
                fechaFinal: glob.getFecha()
            })
        } else {
            cargarFechas()
            setesteMes(true)
        }
    }

    function fetchListByDate() {
        const url = params.globalVars.myUrl + 'report/list/bydate/' + fechas.fechaInicio + '/' + fechas.fechaFinal
        fetch(url)
            .then((response) => {
                return response.json()
            }).then((json) => {
                setCargar(false)
                setTotalIngresos(json.totalIngresos)
                setTotalGastos(json.totalGastos)
                setTotalProviders(json.totalProviders)
            })
    }

    function calcularUtilidad() {
        let uti = parseInt(totalIngresos) - (parseInt(totalGastos)+parseInt(totalProviders))
        setUtilidad(uti)
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

    function getBackground() {
        let color = '#ff3b1f'
        if (utilidad > 0) {
            color = '#00913f'
        }
        if (utilidad == 0) {
            color = 'white'
        }
        return color
    }

    function topClientesByCantidad() {
        setCargar(true)
        const url = params.globalVars.myUrl + 'report/topclientes/cantidad/' + fechas.fechaInicio + '/' + fechas.fechaFinal
        fetch(url)
            .then((response) => {
                return response.json()
            }).then((json) => {
                setCargar(false)
                setOptionSelected('cantidad')
                setTopClientes(json)
                document.getElementById('btnDialogoTopClientes').click()
            })
    }

    function topClientesByValor() {
        setCargar(true)
        const url = params.globalVars.myUrl + 'report/topclientes/valores/' + fechas.fechaInicio + '/' + fechas.fechaFinal
        fetch(url)
            .then((response) => {
                return response.json()
            }).then((json) => {
                setCargar(false)
                setOptionSelected('valores')
                setTopClientes(json)
                document.getElementById('btnDialogoTopClientes').click()
            })
    }

    function productosMasVendidoByValor() {
        setCargar(true)
        const url = params.globalVars.myUrl + 'report/top/valores/' + fechas.fechaInicio + '/' + fechas.fechaFinal
        fetch(url)
            .then((response) => {
                return response.json()
            }).then((json) => {
                setCargar(false)
                setProductosMasVendidos(json)
                setOptionSelected('valores')
                document.getElementById('btnDialogoTopVentasValores').click()
            })
    }

    function productosMasVendidoByUnits() {
        setCargar(true)
        const url = params.globalVars.myUrl + 'report/top/cantidad/' + fechas.fechaInicio + '/' + fechas.fechaFinal
        fetch(url)
            .then((response) => {
                return response.json()
            }).then((json) => {
                setCargar(false)
                setProductosMasVendidos(json)
                setOptionSelected('cantidad')
                document.getElementById('btnDialogoTopVentasValores').click()
            })
    }

    return (
        <AuthenticatedLayout
            user={params.auth} globalVars={params.globalVars}
        >
            <Head title="Informes" />
            <div className="py-2">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div style={{ textAlign: 'center' }} className='container'>
                            <div style={{ marginTop: '0.5em' }} className="row justify-content-center">
                                <h1 style={{ fontSize: '1.5em', marginBottom: '0.2em' }} id="titulo" className="text-center titulo">Informes entre</h1>
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
                            <div style={{ marginTop: '1em' }} className="container">
                                <label className="relative inline-flex items-center mr-5 cursor-pointer">
                                    <input onChange={cambioesteMes} type="checkbox" value="" className="sr-only peer" checked={esteMes ? false : true}/>
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Solo hoy</span>
                                </label>
                                <label id='switchEsteMes' className="relative inline-flex items-center cursor-pointer">
                                    <input onChange={cambioesteMes} type="checkbox" value="" className="sr-only peer" checked={esteMes}/>
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Este mes</span>
                                </label>
                            </div>
                        </div>
                        <div style={{ marginTop: '0.5em', textAlign: 'center' }} className="col-12" >
                            <span style={{ display: cargar ? '' : 'none' }} className="spinner-border text-primary" role="status" aria-hidden="true"></span>
                        </div>
                        <div style={{ marginTop: '1.2em', textAlign: 'center', margin: '2em' }} className='table-responsive'>
                            <table className="table table-hover roundedTable">
                                <thead>
                                    <tr style={{ backgroundColor: '#95c799' }}>
                                        <th scope="col">Total ingresos</th>
                                        <th scope="col">$ {glob.formatNumber(totalIngresos)}</th>
                                    </tr>
                                    <tr className="table-danger">
                                        <th scope="col">Total gastos</th>
                                        <th scope="col">$ {glob.formatNumber(totalGastos)}</th>
                                    </tr>
                                    <tr className="table-danger">
                                        <th scope="col">Total proveedores</th>
                                        <th scope="col">$ {glob.formatNumber(totalProviders)}</th>
                                    </tr>
                                    <tr style={{ backgroundColor: getBackground() }} >
                                        <th scope="col">Utilidad en el periodo</th>
                                        <th scope="col">$ {glob.formatNumber(utilidad)}</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div style={{ textAlign: 'center' }} className="container">
                            <div className="row justify-content-center" >
                                <div onClick={productosMasVendidoByValor} style={{ marginBottom: '1em' }} className="col-lg-6 col-md-6 col-sm-6 col-6"  >
                                    <div style={{ margin: '0 auto' }} className="card card-flyer pointer">
                                        <div className="title">
                                            <span>
                                                <svg width="20" fill="currentColor" height="20" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1362 1185q0 153-99.5 263.5t-258.5 136.5v175q0 14-9 23t-23 9h-135q-13 0-22.5-9.5t-9.5-22.5v-175q-66-9-127.5-31t-101.5-44.5-74-48-46.5-37.5-17.5-18q-17-21-2-41l103-135q7-10 23-12 15-2 24 9l2 2q113 99 243 125 37 8 74 8 81 0 142.5-43t61.5-122q0-28-15-53t-33.5-42-58.5-37.5-66-32-80-32.5q-39-16-61.5-25t-61.5-26.5-62.5-31-56.5-35.5-53.5-42.5-43.5-49-35.5-58-21-66.5-8.5-78q0-138 98-242t255-134v-180q0-13 9.5-22.5t22.5-9.5h135q14 0 23 9t9 23v176q57 6 110.5 23t87 33.5 63.5 37.5 39 29 15 14q17 18 5 38l-81 146q-8 15-23 16-14 3-27-7-3-3-14.5-12t-39-26.5-58.5-32-74.5-26-85.5-11.5q-95 0-155 43t-60 111q0 26 8.5 48t29.5 41.5 39.5 33 56 31 60.5 27 70 27.5q53 20 81 31.5t76 35 75.5 42.5 62 50 53 63.5 31.5 76.5 13 94z">
                                                    </path>
                                                </svg>
                                            </span>
                                            <p className="title-text">
                                                Valores
                                            </p>
                                            <p className="percent">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" fill="currentColor" height="20" width="20">
                                                    <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z">
                                                    </path>
                                                </svg>
                                            </p>
                                        </div>
                                        <div className="data">
                                            <p>
                                                Productos mas vendidos
                                            </p>
                                            <div className="range">
                                                <div className="fill">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div onClick={productosMasVendidoByUnits} style={{ marginBottom: '1em' }} className="col-lg-6 col-md-6 col-sm-6 col-6"  >
                                    <div style={{ margin: '0 auto' }} className="card card-flyer pointer">
                                        <div className="title">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-123" viewBox="0 0 16 16">
                                                    <path d="M2.873 11.297V4.142H1.699L0 5.379v1.137l1.64-1.18h.06v5.961h1.174Zm3.213-5.09v-.063c0-.618.44-1.169 1.196-1.169.676 0 1.174.44 1.174 1.106 0 .624-.42 1.101-.807 1.526L4.99 10.553v.744h4.78v-.99H6.643v-.069L8.41 8.252c.65-.724 1.237-1.332 1.237-2.27C9.646 4.849 8.723 4 7.308 4c-1.573 0-2.36 1.064-2.36 2.15v.057h1.138Zm6.559 1.883h.786c.823 0 1.374.481 1.379 1.179.01.707-.55 1.216-1.421 1.21-.77-.005-1.326-.419-1.379-.953h-1.095c.042 1.053.938 1.918 2.464 1.918 1.478 0 2.642-.839 2.62-2.144-.02-1.143-.922-1.651-1.551-1.714v-.063c.535-.09 1.347-.66 1.326-1.678-.026-1.053-.933-1.855-2.359-1.845-1.5.005-2.317.88-2.348 1.898h1.116c.032-.498.498-.944 1.206-.944.703 0 1.206.435 1.206 1.07.005.64-.504 1.106-1.2 1.106h-.75v.96Z" />
                                                </svg>
                                            </span>
                                            <p className="title-text">
                                                Unidades
                                            </p>
                                            <p className="percent">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" fill="currentColor" height="20" width="20">
                                                    <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z">
                                                    </path>
                                                </svg>
                                            </p>
                                        </div>
                                        <div className="data">
                                            <p>
                                                Productos mas vendidos
                                            </p>
                                            <div className="range">
                                                <div className="fill">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div onClick={topClientesByValor} style={{ marginBottom: '1em' }} className="col-lg-6 col-md-6 col-sm-6 col-6"  >
                                    <div style={{ margin: '0 auto' }} className="card card-flyer pointer">
                                        <div className="title">
                                            <span>
                                                <svg width="20" fill="currentColor" height="20" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1362 1185q0 153-99.5 263.5t-258.5 136.5v175q0 14-9 23t-23 9h-135q-13 0-22.5-9.5t-9.5-22.5v-175q-66-9-127.5-31t-101.5-44.5-74-48-46.5-37.5-17.5-18q-17-21-2-41l103-135q7-10 23-12 15-2 24 9l2 2q113 99 243 125 37 8 74 8 81 0 142.5-43t61.5-122q0-28-15-53t-33.5-42-58.5-37.5-66-32-80-32.5q-39-16-61.5-25t-61.5-26.5-62.5-31-56.5-35.5-53.5-42.5-43.5-49-35.5-58-21-66.5-8.5-78q0-138 98-242t255-134v-180q0-13 9.5-22.5t22.5-9.5h135q14 0 23 9t9 23v176q57 6 110.5 23t87 33.5 63.5 37.5 39 29 15 14q17 18 5 38l-81 146q-8 15-23 16-14 3-27-7-3-3-14.5-12t-39-26.5-58.5-32-74.5-26-85.5-11.5q-95 0-155 43t-60 111q0 26 8.5 48t29.5 41.5 39.5 33 56 31 60.5 27 70 27.5q53 20 81 31.5t76 35 75.5 42.5 62 50 53 63.5 31.5 76.5 13 94z">
                                                    </path>
                                                </svg>
                                            </span>
                                            <p className="title-text">
                                                Valores
                                            </p>
                                            <p className="percent">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" fill="currentColor" height="20" width="20">
                                                    <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z">
                                                    </path>
                                                </svg>
                                            </p>
                                        </div>
                                        <div className="data">
                                            <p>
                                                Top clientes
                                            </p>
                                            <div className="range">
                                                <div className="fill">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div onClick={topClientesByCantidad} style={{ marginBottom: '1em' }} className="col-lg-6 col-md-6 col-sm-6 col-6"  >
                                    <div style={{ margin: '0 auto' }} className="card card-flyer pointer">
                                        <div className="title">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-123" viewBox="0 0 16 16">
                                                    <path d="M2.873 11.297V4.142H1.699L0 5.379v1.137l1.64-1.18h.06v5.961h1.174Zm3.213-5.09v-.063c0-.618.44-1.169 1.196-1.169.676 0 1.174.44 1.174 1.106 0 .624-.42 1.101-.807 1.526L4.99 10.553v.744h4.78v-.99H6.643v-.069L8.41 8.252c.65-.724 1.237-1.332 1.237-2.27C9.646 4.849 8.723 4 7.308 4c-1.573 0-2.36 1.064-2.36 2.15v.057h1.138Zm6.559 1.883h.786c.823 0 1.374.481 1.379 1.179.01.707-.55 1.216-1.421 1.21-.77-.005-1.326-.419-1.379-.953h-1.095c.042 1.053.938 1.918 2.464 1.918 1.478 0 2.642-.839 2.62-2.144-.02-1.143-.922-1.651-1.551-1.714v-.063c.535-.09 1.347-.66 1.326-1.678-.026-1.053-.933-1.855-2.359-1.845-1.5.005-2.317.88-2.348 1.898h1.116c.032-.498.498-.944 1.206-.944.703 0 1.206.435 1.206 1.07.005.64-.504 1.106-1.2 1.106h-.75v.96Z" />
                                                </svg>
                                            </span>
                                            <p className="title-text">
                                                Unidades
                                            </p>
                                            <p className="percent">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" fill="currentColor" height="20" width="20">
                                                    <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z">
                                                    </path>
                                                </svg>
                                            </p>
                                        </div>
                                        <div className="data">
                                            <p>
                                                Top clientes
                                            </p>
                                            <div className="range">
                                                <div className="fill">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <CopyRight globalVars={params.globalVars}></CopyRight>
                            <button type="button" id='btnDialogoTopVentasValores' style={{ display: 'none' }} data-toggle="modal" data-target="#dialogoTopVentasValores"></button>
                            <TopVentasValores productos={productosMasVendidos} optionSelected={optionSelected}></TopVentasValores>
                            <button type="button" id='btnDialogoTopClientes' style={{ display: 'none' }} data-toggle="modal" data-target="#dialogoTopClientes"></button>
                            <TopClientesValores optionSelected={optionSelected} clientes={topClientes}></TopClientesValores>
                        </div>
                        <br />
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    )
}

export default Reports