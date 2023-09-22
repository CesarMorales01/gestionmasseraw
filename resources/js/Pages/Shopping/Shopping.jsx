import React from 'react'
import GlobalFunctions from '../services/GlobalFunctions';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import '../../../css/general.css'
import newLogo from '../../../../public/Images/Config/plus.png'
import Progressbar from '../UIGeneral/ProgressBar'
import TablaListaCompras from './TablaListaCompras';

const ListaCompras = (params) => {

    const glob = new GlobalFunctions()
    const [lista, setLista] = useState([])
    const [filterLista, setFilterLista] = useState(params.compras.data)
    const [noCompras, setNoCompras] = useState(false)
    const [progressBar, setProgressBar] = useState(false)
    const [busquedaXCliente, setBusquedaXCliente] = useState(false)

    useEffect(() => {
        if (filterLista.length == 0) {
            setNoCompras(true)
        } else {
            setNoCompras(false)
        }
    }, [filterLista, lista])

    useEffect(() => {
        if (params.estado != null) {
            Swal.fire({
                title: params.estado,
                icon: params.estado.includes('elimin') ? 'warning' : 'success',
                timer: !params.duracionAlert ? 1000 : params.duracionAlert
            })
        }
        if (lista.length == 0) {
            const url = params.globalVars.myUrl + 'api/shopping/allshopping'
            fetch(url)
                .then((response) => {
                    return response.json()
                }).then((json) => {
                    setLista(json)
                })
        }
    }, [])

    function cambioNombre(e) {
        const buscar = e.target.value.toLowerCase()
        let newArray = []
        if (busquedaXCliente) {
            for (let i = 0; i < lista.length; i++) {
                if (lista[i].cliente.nombre.toString().toLowerCase().includes(buscar) || lista[i].cliente.cedula.toString().toLowerCase().includes(buscar)) {
                    newArray.push(lista[i])
                    if (lista[i].cliente.apellido) {
                        console.log('buscar apellido')
                    }
                }
            }
        } else {
            for (let i = 0; i < lista.length; i++) {
                lista[i].listaProductos.forEach(element => {
                    if (element.producto.toLowerCase().includes(buscar)) {
                        newArray.push(lista[i])
                    }
                });
            }
        }
        setFilterLista(newArray)
        if(buscar==''){
            setFilterLista(params.compras.data)
        }
    }

    function borrarInput() {
        document.getElementById('inputBuscar').value = ''
        setFilterLista(params.compras.data)
    }

    function newShop() {
        setProgressBar(true)
        window.location = params.globalVars.myUrl + "shopping/create"
    }

    function cambioBusquedaXCliente(e) {
        if (busquedaXCliente) {
            setBusquedaXCliente(false)
        } else {
            setBusquedaXCliente(true)
        }
    }

    function cambioBusquedaXProducto(e) {
        if (busquedaXCliente) {
            setBusquedaXCliente(false)
        } else {
            setBusquedaXCliente(true)
        }
    }

    return (
        <AuthenticatedLayout user={params.auth} globalVars={params.globalVars}>
            <Head title="Productos" />
            <div style={{ display: progressBar ? '' : 'none' }}>
                <Progressbar progress={progressBar}></Progressbar>
            </div>
            <div className='container'>
                <div align="center" className="row justify-content-center">
                    <div className="row">
                        <div style={{ marginTop: '0.8em' }} className="row">
                            <div onClick={newShop} className="col-lg-6 col-md-6 col-sm-6 col-6"  >
                                <div className="card border border-primary card-flyer pointer">
                                    <img style={{ width: '8em', height: '4em', marginTop: '1em' }} src={newLogo} className="card-img-top img-fluid centerImg" alt="" />
                                    <h2 style={{ marginTop: '0.2em' }} className="card-title titulo">Nueva venta</h2>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-6"  >
                            </div>
                        </div>
                        <div className="col-12">
                            <form>
                                <div className="flex items-center py-3">
                                    <input style={{ marginLeft: '0.5em' }} size={window.innerWidth<400 ? '31' : '40'} id='inputBuscar' onChange={cambioNombre} className="rounded py-2" type="text" placeholder="Buscar venta..." aria-label="Full name" />
                                    <button onClick={borrarInput} className="flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded" type="button">
                                        <svg style={{ padding: '0.2em', backgroundColor: 'gray', cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="rounded bi bi-x" viewBox="0 0 16 16">
                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-12" >
                                        <div className="row justify-content-start">
                                            <div className="col-6" >
                                                <input checked={busquedaXCliente} onChange={cambioBusquedaXCliente} style={{ height: '1.3em', width: '1.3em' }} type='checkbox' className='rounded' name="remember" />
                                                <span style={{ marginLeft: '0.4em' }} className="text-sm">Por clientes</span>
                                            </div>
                                            <div className="col-6" >
                                                <input onChange={cambioBusquedaXProducto} checked={busquedaXCliente ? false : true} style={{ height: '1.3em', width: '1.3em' }} type='checkbox' className='rounded' name="remember" />
                                                <span style={{ marginLeft: '0.4em' }} className="text-sm">Por productos</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-12" >
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <h1 style={{ marginTop: '0.5em', fontSize: '1.5em' }} id="titulo" className="text-center">Lista de ventas</h1>
                <TablaListaCompras token={params.token} url={params.globalVars.myUrl} pagination={params.compras.links} noCompras={noCompras} lista={filterLista} />
            </div>
        </AuthenticatedLayout>
    )

}

export default ListaCompras

