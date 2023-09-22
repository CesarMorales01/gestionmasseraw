import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Swal from 'sweetalert2'
import TablaClientes from './TablaClientes';
import newLogo from '../../../../public/Images/Config/plus.png'
import clientesLogo from '../../../../public/Images/Config/clientes.webp'
import Progressbar from '../UIGeneral/ProgressBar'
import '../../../css/general.css'

const Clientes = (params) => {
    const glob = new GlobalFunctions()
    const [clientes, setClientes] = useState([])
    const [noClientes, setNoClientes] = useState(false)
    const [filterClients, setFilterClients] = useState(params.clientes.data)
    const [progressBar, setProgressBar] = useState(false)

    useEffect(() => {
        if (params.estado != '') {
            Swal.fire({
                title: params.estado,
                icon: params.estado.includes('elimin') ? 'warning' : 'success',
                timer:  params.estado.includes('elimin') ? 1500 : 1000
            })
        }
    }, [])

    useEffect(() => {
        if (filterClients.length == 0) {
            setNoClientes(true)
        } else {
            setNoClientes(false)
        }
    }, [filterClients, clientes])

    function cambioNombre(e) {
        const buscar = e.target.value.toLowerCase()
        let newArray = []
        for (let i = 0; i < clientes.length; i++) {
            let resultado=null;
            if(clientes[i].nombre!=null){
                if (clientes[i].nombre.toLowerCase().includes(buscar)) {
                    resultado=clientes[i]
                }
            }
            if(clientes[i].direccion!=null){
                if(clientes[i].direccion.toLowerCase().includes(buscar)){
                    resultado=clientes[i]
                }
            }
            if(clientes[i].apellidos!=null){
                if(clientes[i].apellidos.toLowerCase().includes(buscar)){
                    resultado=clientes[i]
                }
            }
            if(clientes[i].email!=null){
                if(clientes[i].email.toLowerCase().includes(buscar)){
                    resultado=clientes[i]
                }
            }
            if(resultado!=null){
                newArray.push(resultado)
            }
        }
        if (newArray.length == clientes.length) {
            newArray = params.clientes.data
        }
        if (newArray.length == 0) {
            setNoClientes(true)
        }
        setFilterClients(newArray)
    }

    function borrarInput() {
        document.getElementById('inputBuscar').value = ''
        document.getElementById('inputBuscar').click()
    }


    function buscarClientesCompletos(e) {
        cambioNombre(e)
        if (clientes.length == 0) {
            const url = params.globalVars.myUrl + 'api/customer/allclients'
            fetch(url)
                .then((response) => {
                    return response.json()
                }).then((json) => {
                    setClientes(json)
                })
        }
    }

    function goNewClient() {
        setProgressBar(true)
        window.location = params.globalVars.myUrl + "customer/create"
    }

    return (
        <AuthenticatedLayout
            user={params.auth} globalVars={params.globalVars}
        >
            <Head title="Clientes" />
            <div style={{ display: progressBar ? '' : 'none' }}>
                <Progressbar progress={progressBar}></Progressbar>
            </div>
            <div style={{ marginTop: '0.2em' }} align="center" className="container">
                <div align="center" className="row justify-content-center">
                    <div style={{ marginTop: '0.8em' }} className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-6"  >
                            <div onClick={goNewClient} className="card border border-primary card-flyer pointer">
                                <img style={{ width: '8em', height: '4em', marginTop: '1em' }} src={newLogo} className="card-img-top img-fluid centerImg" alt="" />
                                <h2 style={{ marginTop: '0.2em' }} className="card-title titulo">Nuevo cliente</h2>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-6" >
                            
                        </div>
                    </div>
                    <div className="col-12">
                        <form>
                            <div className="flex items-center py-3">
                                <input style={{ marginLeft: '0.5em' }} size={window.innerWidth<400 ? '31' : '40'} id='inputBuscar' onClick={buscarClientesCompletos} onChange={cambioNombre} className="rounded py-2" type="text" placeholder="Buscar clientes..." aria-label="Full name" />
                                <button onClick={borrarInput} className="flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded" type="button">
                                    <svg style={{ padding: '0.2em', backgroundColor: 'gray', cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="rounded bi bi-x" viewBox="0 0 16 16">
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <h1 style={{ marginTop: '0.5em', fontSize: '1.5em' }} id="titulo" className="text-center">Lista de clientes</h1>
            <div className="container">
                <TablaClientes noClientes={noClientes} clientes={filterClients}></TablaClientes>
            </div>
        </AuthenticatedLayout>
    )
}

export default Clientes