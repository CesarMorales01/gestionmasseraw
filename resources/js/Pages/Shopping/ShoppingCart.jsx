import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions';
import Swal from 'sweetalert2'
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

const ShoppingCart = (params) => {
    const glob = new GlobalFunctions()
    const [productos, setProductos] = useState([])
    const [idEliminar, setIdEliminar] = useState('')
    const [superCantidad, setSuperCantidad] = useState({
        id: '',
        cantidad: 0
    })

    useEffect(() => {
        revisarDatos()
    })

    function revisarDatos() {
        if (params.productosCarrito.length != productos.length) {
            setProductos(params.productosCarrito)
        }
    }

    function abrirDialogoElimininar(cod) {
        setIdEliminar(cod)
        Swal.fire({
            title: '¿Eliminar este producto?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById('inputGoNuevaCompra').click()
            }
        })
    }

    function validarInventario(item) {
        let mostrar = ''
        //validar si se esta editando: validar si mostrar
        if (params.editando != '') {
            params.productos.forEach(element => {
                let encontrarProducto = null
                if (element.id == item.codigo) {
                    encontrarProducto = element
                    // si cantidad en productos no es null no mostrar
                    if (element.cantidad != null) {
                        mostrar = 'none'
                    }
                }
            });
        }
        return mostrar
    }

    function setCodSuperCant(e) {
        setSuperCantidad((valores) => ({
            ...valores,
            id: e
        }))
    }

    function cambioSuperCant(e) {
        setSuperCantidad((valores) => ({
            ...valores,
            cantidad: e.target.value
        }))
        setTimeout(() => {
            setSuperCantidad((valores) => ({
                ...valores,
                cantidad: 0
            })) 
        }, 4000);
    }

    return (
        <div className='border'>
            <input type='hidden' id='inputGoNuevaCompra' onClick={() => params.borrarProducto(idEliminar)} ></input>
            <div className="row" style={{ color: 'green', marginTop: '0.4em' }}>
                <div className="align-self-center">
                    <h5 style={{ textAlign: 'center' }} >Carrito de compras</h5>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Producto</th>
                            <th scope="col">Valor</th>
                            <th scope="col">Cant</th>
                            <th scope="col">Subtotal</th>
                            <th scope="col">Sumar</th>
                            <th scope="col">Restar</th>
                            <th scope="col">Borrar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((item, index) => {
                            return (
                                <tr className='align-middle' key={index} >
                                    <td>{item.nombre}</td>
                                    <td>${glob.formatNumber(item.precio)}</td>
                                    <td>
                                        <button onClick={() => setCodSuperCant(item.id)} data-toggle="modal" data-target="#cantModal" className='btn btn-outline-success'>{item.cantidad}</button>
                                    </td>
                                    <td>${glob.formatNumber(item.precio * item.cantidad)}</td>
                                    <td>
                                        <button style={{ display: validarInventario(item) }} onClick={() => params.masCant(item)} className="btn btn-light btn-sm">
                                            <svg style={{ color: 'green' }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                            </svg>
                                        </button>
                                    </td>
                                    <td>
                                        <button style={{ display: validarInventario(item) }} onClick={() => params.menosCant(item)} className="btn btn-light btn-sm">
                                            <svg style={{ color: 'green' }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-dash-square" viewBox="0 0 16 16">
                                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                                            </svg>
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={() => abrirDialogoElimininar(item.id)} className='btn btn-danger btn-sm'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div id="cantModal" className="modal" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 style={{ textAlign: 'center' }} className="modal-title">Ingresar cantidad</h3>
                        </div>
                        <div className="modal-body">
                            <p style={{ fontSize: '0.8em' }}>(Este método no válida inventario)</p>
                            <input onChange={cambioSuperCant} value={superCantidad.cantidad} className="form-control rounded" type='number' ></input>
                        </div>
                        <div className="modal-footer">
                            <SecondaryButton type="button" data-dismiss="modal">Cancelar</SecondaryButton>
                            <PrimaryButton data-dismiss="modal" type="button" onClick={() => params.cambioCant(superCantidad)} className="btn btn-primary">Aceptar</PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShoppingCart