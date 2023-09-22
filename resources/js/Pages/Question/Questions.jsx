import React from 'react'
import GlobalFunctions from '../services/GlobalFunctions';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react';
import TablaPreguntas from './TablaPreguntas';

const Questions = (params) => {
    const glob = new GlobalFunctions()
    const [lista, setLista] = useState([])
    const [filterLista, setFilterLista] = useState(params.preguntas.data)
    const [noLista, setNoLista] = useState(false)

    useEffect(() => {
        if (filterLista.length == 0) {
            setNoLista(true)
        } else {
            setNoLista(false)
        }
    }, [filterLista, lista])

    useEffect(() => {
        if (params.buscado) {
            document.getElementById('inputBuscar').value = params.preguntas.data[0].producto.nombre
        }
    }, [])


    function borrarInput() {
        document.getElementById('inputBuscar').value = ''
        document.getElementById('inputBuscar').click()
    }

    function cambioNombre(e) {
        const buscar = e.target.value.toLowerCase()
        let newArray = []
        for (let i = 0; i < lista.length; i++) {
            let encontrado = ''
            if (lista[i].cliente != null) {
                if (lista[i].cliente.name.toLowerCase().includes(buscar)) {
                    encontrado = lista[i]
                } else {
                    if (lista[i].cliente.email.toLowerCase().includes(buscar)) {
                        encontrado = lista[i]
                    }
                }
            }
            if (lista[i].producto != null && encontrado == '') {
                if (lista[i].producto.nombre.toLowerCase().includes(buscar)) {
                    encontrado = lista[i]
                }
            }
            if (encontrado != '') {
                newArray.push(encontrado)
            }
        }
        reiniciarFilterLista()
        setTimeout(() => {
            setFilterLista(newArray)
        }, 100)

    }

    function reiniciarFilterLista() {
        let newArray = []
        setFilterLista(newArray)
    }

    function searchAllQuestions(e) {
        if (lista.length == 0) {
            fetchAllQuestions()
        } else {
            cambioNombre(e)
        }
    }

    function fetchAllQuestions() {
        const url = params.globalVars.myUrl + 'question/allquestions'
        fetch(url)
            .then((response) => {
                return response.json()
            }).then((json) => {
                setLista(json)
            })
    }

    return (
        <AuthenticatedLayout user={params.auth} globalVars={params.globalVars}>
            <Head title="Productos" />
            <div className='container'>
                <div align="center" className="row justify-content-center">
                    <div className="row">
                        <div style={{ marginTop: '0.2em', textAlign: 'right' }} className="col-lg-9 col-md-6 col-sm-12 col-12" >
                            <form className="w-full max-w-sm">
                                <div className="flex items-center py-2">
                                    <input id='inputBuscar' onClick={searchAllQuestions} onChange={cambioNombre} className="appearance-none bg-white border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight" type="text" placeholder="Buscar pregunta..." aria-label="Full name" />
                                    <button onClick={borrarInput} className="flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded" type="button">
                                        <svg style={{ padding: '0.2em', backgroundColor: 'gray', cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="rounded bi bi-x" viewBox="0 0 16 16">
                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                        </svg>
                                    </button>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <h1 style={{ marginTop: '0.5em', fontSize: '1.5em' }} id="titulo" className="text-center">Lista de preguntas</h1>
                <TablaPreguntas url={params.globalVars.myUrl} pagination={params.preguntas.links} noLista={noLista} lista={filterLista}></TablaPreguntas>
            </div>
        </AuthenticatedLayout>
    )

}

export default Questions