import React from 'react'
import GlobalFunctions from '../services/GlobalFunctions';
import { useState, useEffect } from 'react';
import Pagination from '../Product/Pagination';
import DialogoCompraN from './DialogoCompraN';
import Swal from 'sweetalert2'

const TablaListaCompras = (params) => {

    const [lista, setLista] = useState([])
    const glob = new GlobalFunctions()
    const optionsSelect = [
        { value: 'Recibida', label: 'Recibida' },
        { value: 'Preparando', label: 'Preparando' },
        { value: 'En camino', label: 'En camino' },
        { value: 'Entregada', label: 'Entregada' }
    ]
    const [datosCompra, setDatosCompra] = useState({})

    useEffect(() => {
        if (params.lista.length !== lista.length) {
            setLista(params.lista)
        }
    })

    function loadingOn(id) {
        document.getElementById(id).style.display = 'none'
        document.getElementById('btnLoadingSelect' + id).style.display = 'inline'
    }

    function loadingOff(id) {
        document.getElementById(id).style.display = 'inline'
        document.getElementById('btnLoadingSelect' + id).style.display = 'none'
    }

    function abrirCompraN(item) {
        setDatosCompra(item)
    }

    function cambioEstado(estado) {
        loadingOn(estado.target.id)
        const url = params.url + 'shopping/shoppingChangeState/' + estado.target.id + '/' + estado.target.value
        fetch(url).then((response) => {
            return response.json()
        }).then((json) => {
            loadingOff(estado.target.id)
            document.getElementById(estado.target.id).value = json
        })
    }

    function confirmarEliminar(id) {
        Swal.fire({
            title: '¿Eliminar esta compra?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                loadingOn(id)
                document.getElementById(id + 'formEliminar').submit()
            }
        })
    }

    function preventDefault(e) {
        e.preventDefault()
    }

    function validarSiCliente(valor) {
        let cliente = true
        if (isNaN(valor)) {
            cliente = false
        }
        return cliente
    }

    return (
        <div style={{ marginTop: '0.5em' }} className='table-responsive '>
            <table className="table table-striped roundedTable">
                <thead className='navBarFondo align-middle'>
                    <tr>
                        <th style={{ textAlign: 'center' }} scope="col">Fecha</th>
                        <th style={{ textAlign: 'center' }} scope="col">Cliente</th>
                        <th style={{ textAlign: 'center' }} scope="col">Detalle</th>
                        <th style={{ textAlign: 'center' }} scope="col">Total venta</th>
                        <th style={{ textAlign: 'center' }} scope="col">Medio de pago</th>
                        <th style={{ textAlign: 'center' }} scope="col">Estado</th>
                        <th style={{ textAlign: 'center' }} scope="col">Comentarios</th>
                        <th style={{ textAlign: 'center' }} scope="col">Acciones</th>
                        <th style={{ textAlign: 'center' }} scope="col">Costo medio de pago</th>
                    </tr>
                </thead>
                <tbody>
                    {params.noCompras ?
                        <tr style={{ marginTop: '1.5em' }} className='container'><td colSpan='9'>No se han encontrado resultados....</td></tr>
                        :
                        lista.map((item, index) => {
                            let nombreCliente = ''
                            if (item.cliente.nombre != '') {
                                nombreCliente = item.cliente.nombre
                            }
                            if (item.cliente.nombre != '' && item.cliente.apellidos != null) {
                                nombreCliente = item.cliente.nombre + " " + item.cliente.apellidos
                            }
                            return (
                                <tr className='align-middle' key={index}>
                                    <th >
                                        {item.fecha}
                                    </th>
                                    <td>
                                        <a href={validarSiCliente(item.cliente.nombre) ? '' : route('customer.editar', [item.cliente.id, 'nothing'])} style={{ textDecoration: item.cedula != '' ? 'underline' : '', color: 'blue' }} >{nombreCliente} </a>
                                    </td>
                                    <td>
                                        <button style={{ backgroundColor: 'white', color: 'black' }} onClick={() => abrirCompraN(item)} className='btn btn-outline-info rounded' type="button" data-toggle="modal" data-target="#dialogoCompraN">
                                            {item.listaProductos[0].producto} x{item.listaProductos[0].cantidad}...
                                        </button>
                                    </td>
                                    <td>{glob.formatNumber(item.total_compra)}</td>
                                    <td>{item.medio_de_pago}</td>
                                    <td>
                                        <div style={{ width: '8em' }}>
                                            <select onChange={cambioEstado} id={item.id} value={item.estado} className="form-select form-select-sm rounded">
                                                {optionsSelect.map((opcion, index) => {
                                                    return (
                                                        <option key={index} value={opcion.label}>{opcion.label}</option>
                                                    )
                                                })}
                                            </select>
                                            <button id={'btnLoadingSelect' + item.id} style={{ display: 'none', backgroundColor: 'gray' }} className="btn btn-primary" type="button" disabled>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                Loading...
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        {item.comentarios ? item.comentarios.substring(0, 60) : ''}...
                                    </td>
                                    <td>
                                        <a href={route('shopping.edit', item.id)} className='btn btn-success border' style={{ cursor: 'pointer' }} >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill rounded" viewBox="0 0 16 16">
                                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                            </svg>
                                        </a>
                                        <a href={route('shopping.show', item.id)} className='btn btn-primary border' style={{ cursor: 'pointer' }} >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-printer" viewBox="0 0 16 16">
                                                <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
                                                <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z" />
                                            </svg>
                                        </a>
                                        <form style={{ marginTop: '0.2em' }} method="POST" id={item.id + "formEliminar"} onSubmit={preventDefault} action={route('shopping.store')}>
                                            <input type="hidden" name='_token' value={params.token} />
                                            <input type='hidden' name='cliente' value={item.cliente.cedula}></input>
                                            <input type='hidden' name='compra_n' value={item.compra_n}></input>
                                            <button type='submit' onClick={() => { confirmarEliminar(item.id) }} style={{ backgroundColor: 'red' }} className="btn btn-danger">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                </svg>
                                            </button>
                                        </form>
                                    </td>
                                    <td>{item.costo_medio_pago}</td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
            <DialogoCompraN url={params.url} datos={datosCompra} />
            {params.noCompras ?
                ''
                :
                <Pagination class="mt-6" links={params.pagination} />
            }
        </div>
    )
}

export default TablaListaCompras