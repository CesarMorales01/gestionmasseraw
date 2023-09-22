import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2'
import TablaClientes from './TablaClientes';
import '../../../css/general.css'
import newLogo from '../../../../public/Images/Config/plus.png'
import clientesLogo from '../../../../public/Images/Config/clientes.webp'
import Progressbar from '../UIGeneral/ProgressBar'

const List = (params) => {

    const glob = new GlobalFunctions()
    const [clientes, setClientes] = useState([])
    const [noClientes, setNoClientes] = useState(false)
    const [filterClients, setFilterClients] = useState(params.clientes.data)
    const [progressBar, setProgressBar] = useState(false)

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
            if (clientes[i].name.toLowerCase().includes(buscar) || clientes[i].email.toLowerCase().includes(buscar)) {
                newArray.push(clientes[i])
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

    function buscarClientes(e) {
        cambioNombre(e)
        if (clientes.length == 0) {
            const url = params.globalVars.myUrl + 'api/registerincomplete/allclients'
            fetch(url)
                .then((response) => {
                    return response.json()
                }).then((json) => {
                    setClientes(json)
                })
        }
    }

    function borrarInput() {
        document.getElementById('inputBuscar').value = ''
        document.getElementById('inputBuscar').click()
    }

    function goClientes() {
        setProgressBar(true)
        window.location = params.globalVars.myUrl + "customer"
    }

    function goNewClient() {
        setProgressBar(true)
        window.location = params.globalVars.myUrl + "registerincomplete/create"
    }


    return (
        <AuthenticatedLayout user={params.auth} info={params.info} urlImagenes={params.globalVars.urlImagenes}>
            <Head title="Clientes" />
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
                            <div onClick={goClientes} className="card border border-primary card-flyer pointer">
                                <img style={{ width: '4em', height: '4em', marginTop: '1em' }} src={clientesLogo} className="card-img-top img-fluid centerImg" alt="" />
                                <h2 style={{ marginTop: '0.2em' }} className="card-title titulo">Clientes plus</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <form>
                        <div className="flex items-center py-3">
                            <input size="44" id='inputBuscar' onClick={buscarClientes} onChange={cambioNombre} className="rounded py-2" type="text" placeholder="Buscar clientes..." aria-label="Full name" />
                            <button onClick={borrarInput} className="flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded" type="button">
                                <svg style={{ padding: '0.2em', backgroundColor: 'gray', cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="rounded bi bi-x" viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                </svg>
                            </button>

                        </div>
                    </form>
                </div>
            </div>
            <h1 style={{ fontSize: '1.5em' }} id="titulo" className="text-center">Clientes</h1>
            <TablaClientes noClientes={noClientes} clientes={filterClients}></TablaClientes>
        </AuthenticatedLayout>
    )
}

export default List