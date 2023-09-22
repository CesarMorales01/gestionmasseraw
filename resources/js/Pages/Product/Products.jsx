import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import '../../../css/general.css'
import Swal from 'sweetalert2'
import newLogo from '../../../../public/Images/Config/plus.png'
import listLogo from '../../../../public/Images/Config/list.png'
import { TablaProductos } from './TablaProductos'
import Progressbar from '../UIGeneral/ProgressBar'

const Products = (params) => {
    const [productos, setProductos] = useState([])
    const [filterProducts, setFilterProducts] = useState(params.productos.data)
    const [noproductos, setNoProductos] = useState(false)
    const [progressBar, setProgressBar] = useState(false)

    useEffect(() => {
        if (filterProducts.length == 0) {
            setNoProductos(true)
        } else {
            setNoProductos(false)
        }
    }, [filterProducts, productos])

    useEffect(() => {
        if (params.estado != null) {
            Swal.fire({
                title: params.estado,
                icon: params.estado.includes('elimin') ? 'warning' : 'success',
                timer: !params.duracionAlert ? 1000 : params.duracionAlert
            })
        }
    }, [])

    function cambioNombre(e) {
        const buscar = e.target.value.toLowerCase()
        let newArray = []
        for (let i = 0; i < productos.length; i++) {
            let producto=null
            if (productos[i].nombre.toLowerCase().includes(buscar)) {
                producto=productos[i]
            }else{
                if(productos[i].descripcion!=null){
                    if(productos[i].descripcion.toLowerCase().includes(buscar)){
                        producto=productos[i]
                    }
                }
            }
            if(producto!=null){
                newArray.push(producto)
            }
        }
        if (newArray.length == productos.length) {
            newArray = params.productos.data
        }
        if (newArray.length == 0) {
            setNoProductos(true)
        }
        setFilterProducts(newArray)
    }

    function borrarInput() {
        document.getElementById('inputBuscar').value = ''
        document.getElementById('inputBuscar').click()
        document.getElementById('inputBuscar').focus()
    }

    function buscarInAllProducts(e) {
        cambioNombre(e)
        if (productos.length == 0) {
            const url = params.globalVars.myUrl + 'api/product/allproducts'
            fetch(url)
                .then((response) => {
                    return response.json()
                }).then((json) => {
                    setProductos(json)
                })
        }
    }

    function goCategories() {
        setProgressBar(true)
        window.location = params.globalVars.myUrl + "category"
    }

    function newProduct() {
        setProgressBar(true)
        window.location = params.globalVars.myUrl + "product/create"
    }

    function getSize(){
        let size=40
        if(window.innerWidth<400){
            size=31
        }
        return size
    }

    return (
        <AuthenticatedLayout user={params.auth} globalVars={params.globalVars}>
            <Head title="Productos" />
            <div style={{ display: progressBar ? '' : 'none' }}>
                <Progressbar progress={progressBar}></Progressbar>
            </div>
            <div style={{ textAlign: 'center' }} className='container'>
                <div className="row justify-content-center">
                    <div style={{ marginTop: '0.8em' }} className="row">
                        <div onClick={newProduct} className="col-lg-6 col-md-6 col-sm-6 col-6"  >
                            <div className="card border border-primary card-flyer pointer">
                                <img style={{ width: '8em', height: '4em', marginTop: '1em' }} src={newLogo} className="card-img-top img-fluid centerImg" alt="" />
                                <h2 style={{ marginTop: '0.2em' }} className="card-title titulo">Nuevo producto</h2>
                            </div>
                        </div>
                        <div onClick={goCategories} className="col-lg-6 col-md-6 col-sm-6 col-6"  >
                            <div className="card border border-primary card-flyer pointer">
                                <img style={{ width: '3em', height: '4em', marginTop: '1em' }} src={listLogo} className="card-img-top img-fluid centerImg" alt="" />
                                <h2 style={{ marginTop: '0.2em' }} className="card-title titulo">Categorias</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <form>
                            <div className="flex items-center py-3">
                                <input style={{ marginLeft: '0.8em' }} size={window.innerWidth<400 ? '31' : '40'} id='inputBuscar' onClick={buscarInAllProducts} onChange={cambioNombre} className="rounded" type="text" placeholder="Buscar producto..." aria-label="Full name" />
                                <button onClick={borrarInput} className="flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded" type="button">
                                    <svg style={{ padding: '0.2em', backgroundColor: 'gray', cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="rounded bi bi-x" viewBox="0 0 16 16">
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
                <h1 style={{ marginTop: '0.5em', fontSize: '1.5em' }} id="titulo" className="text-center">Lista de productos</h1>
            </div>
            <TablaProductos noProductos={noproductos} pagination={params.productos.links} productos={filterProducts}></TablaProductos>
        </AuthenticatedLayout >
    )
}

export default Products