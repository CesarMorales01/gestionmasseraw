import React from 'react'
import GlobalFunctions from '../services/GlobalFunctions';
import { useState, useEffect } from 'react';
import Pagination from '../Product/Pagination';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2'
import DangerButton from '@/Components/DangerButton';

const TablaPreguntas = (params) => {

    const [lista, setLista] = useState([])

    useEffect(() => {
        if (params.lista.length !== lista.length) {
            setLista(params.lista)
        }
    })

    function loadingOn(id) {
        document.getElementById('btnEditar' + id).style.display = 'none'
        document.getElementById('btnLoading' + id).style.display = 'inline'
    }

    function loadingOff(id) {
        document.getElementById('btnEditar' + id).style.display = 'inline'
        document.getElementById('btnLoading' + id).style.display = 'none'
    }

    function dialogoBorrar(id) {
        Swal.fire({
            title: '¿Eliminar esta pregunta?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                loadingOn(id)
                document.getElementById('a' + id).click()
            }
        })
    }

    function fetchBorrar() {

    }

    function setSizeText(id) {
        const text = document.getElementById(id)
        const letras = text.value
        const size = Math.round(letras.length / 18)
        text.rows = size + 1
    }

    function fetchRespuesta(id) {
        loadingOn(id)
        const respuesta = document.getElementById(id).value
        const url = params.url + 'question/setanswer/' + id + '/' + respuesta
        fetch(url).then((response) => {
            return response.json()
        })
            .then((json) => {
                loadingOff(id)
                document.getElementById(id).value = json
            })
    }

    return (
        <div className='container table-responsive'>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Fecha</th>
                        <th scope="col">Cliente</th>
                        <th scope="col">Producto</th>
                        <th scope="col">Pregunta</th>
                        <th scope="col">Respuesta</th>
                    </tr>
                </thead>
                <tbody>
                    {params.noLista ?
                        <tr style={{ marginTop: '1.5em' }} className='container'><td colSpan='5'>No se han encontrado resultados....</td></tr>
                        :
                        params.lista.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">
                                        {item.fecha}
                                        <br />
                                        <a type='hidden' id={'a' + item.id} href={params.url + 'question/' + item.id}></a>
                                        <DangerButton type='submit' onClick={() => dialogoBorrar(item.id)} className='btn btn-danger btn-sm border border-dark rounded cursorPointer' style={{ marginLeft: '0.2em', padding: '0.2em' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                            </svg>
                                        </DangerButton>
                                    </th>
                                    <td className='align-middle'>
                                        <a href={route('customer.editar', [item.cliente ? item.cliente.id_cliente : '', 'nothing'])} className='btn btn-outline-success btn-sm' >
                                            {item.cliente ? item.cliente.name : 'No se encontro el cliente...'}
                                        </a>

                                    </td>
                                    <td>{item.producto ? item.producto.nombre : 'Producto eliminado?'}
                                    </td>
                                    <td>{item.pregunta}</td>
                                    <td>
                                        <textarea onMouseOver={() => setSizeText(item.id)} id={item.id} placeholder='Escribe una respuesta' defaultValue={item.respuesta} rows='1'></textarea>
                                        <br />
                                        <PrimaryButton id={'btnEditar' + item.id} onClick={() => fetchRespuesta(item.id)} className="btn btn-success" type="button">{item.comentarios == '' ? 'Responder' : 'Editar'}</PrimaryButton>
                                        <button id={'btnLoading' + item.id} style={{ display: 'none', backgroundColor: 'gray' }} className="btn btn-primary" type="button" disabled>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Loading...
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
            {params.noLista ?
                ''
                :
                <Pagination class="mt-6" links={params.pagination} />
            }
        </div>
    )
}

export default TablaPreguntas