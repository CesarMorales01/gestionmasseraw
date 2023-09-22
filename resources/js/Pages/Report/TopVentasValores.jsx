import SecondaryButton from '@/Components/SecondaryButton'
import React from 'react'
import { useState, useEffect } from 'react'
import GlobalFunctions from '../services/GlobalFunctions'

const TopVentasValores = (params) => {

    const glob = new GlobalFunctions()

    return (
        <div className="modal fade bd-example-modal-lg" id='dialogoTopVentasValores' tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <h1 style={{ fontSize: '1.5em', marginLeft: '0.5em', textAlign: 'center', margin: '1em' }} className="superTituloNegro" >Productos mas vendidos por {params.optionSelected}</h1>
                    <div className='container' style={{ margin: '0.2em' }}>
                        <div className='container table-responsive'>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">Pos</th>
                                        <th scope="col">Producto</th>
                                        <th scope="col">Unidades V</th>
                                        <th scope="col">Valor unit</th>
                                        <th scope="col">Total vendido</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {params.productos.map((item, index) => {
                                        const total=parseInt(item.precio)*item.cant;
                                        return (
                                            <tr key={index}>
                                                <td><strong>{index+1}</strong></td>
                                                <td>{item.producto}</td>
                                                <td style={{ fontWeight: params.optionSelected=='cantidad' ? 'bold' : '', color: params.optionSelected=='cantidad' ? 'green' : '' }}>{item.cant}</td>
                                                <td>$ {glob.formatNumber(item.precio)}</td>
                                                <td style={{ fontWeight: params.optionSelected=='valores' ? 'bold' : '', color: params.optionSelected=='valores' ? 'green' : '' }}>$ {glob.formatNumber(total)}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row justify-content-around">
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                            <SecondaryButton type="button" data-dismiss="modal">Cancelar</SecondaryButton>
                        </div>
                    </div>
                    <br />
                </div>
            </div>
        </div>
    )
}

export default TopVentasValores