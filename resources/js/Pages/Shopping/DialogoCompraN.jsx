import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton'

const DialogoCompraN = (params) => {
    const glob = new GlobalFunctions()
    const [lista, setLista] = useState([])
    const [cliente, setCliente] = useState(0)
    const [compran, setCompran] = useState(0)
    const [idCompra, setIdCompra] = useState(0)

    useEffect(() => {
        if (Object.keys(params.datos).length > 0) {
            if (params.datos.id != idCompra) {
                const array = []
                setIdCompra(params.datos.id)
                setLista(array)
                setCliente(params.datos.cliente.cedula)
                setCompran(params.datos.compra_n)
            }
        }
    })

    useEffect(() => {
        fetchProductos()
    }, [idCompra])

    function fetchProductos() {
        const enlace = params.url + 'shopping/shoppingproducts/' + cliente+'/'+compran
        fetch(enlace).then((response) => {
            return response.json()
        }).then((json) => {
            setLista(json)
            setTimeout(() => {
                setTotal()
            }, 200);
        })
    }

    function setTotal() {
        let total = 0
        if (lista.length > 0) {
            lista.map((item) => {
                let subtotal = parseInt(item.precio * item.cantidad)
                total = total + subtotal
            })
        }
        return total
    }

    return (
        <div className="modal fade" id='dialogoCompraN' tabIndex="-1" >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{compran == 0 ? '' : 'Lista productos compra N°: ' + params.datos.compra_n + '. ' + params.datos.cliente.nombre}</h5>
                    </div>
                    <div className="modal-body">
                        <div className='container table-responsive'>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Producto</th>
                                        <th scope="col">Cantidad</th>
                                        <th scope="col">Precio Unidad</th>
                                        <th scope="col">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    <tr style={{ display: lista.length == 0 ? '' : 'none' }}>
                                        <td>
                                            <div className='container'>
                                                <div style={{ textAlign: 'center', margin: '1em' }} className="spinner-border text-primary" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    {lista.map((item, index) => {
                                        const subt = parseInt(item.precio * item.cantidad)
                                        return (
                                            <tr scope="row" key={index}>
                                                <th>{item.producto}</th>
                                                <td>{item.cantidad}</td>
                                                <td>{glob.formatNumber(item.precio)}</td>
                                                <td>{glob.formatNumber(subt)}</td>
                                            </tr>
                                        )
                                    })}
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th>Total compra:</th>
                                        <th id='thTotal'>{glob.formatNumber(setTotal())}</th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <PrimaryButton type="button" data-dismiss="modal">Close</PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DialogoCompraN