import SecondaryButton from '@/Components/SecondaryButton'
import React from 'react'
import { useState, useEffect } from 'react'
import GlobalFunctions from '../services/GlobalFunctions'

const TopClientesValores = (params) => {

    const glob = new GlobalFunctions()
    const [datos, setDatos] = useState([])


    return (
        <div className="modal fade bd-example-modal-lg" id='dialogoTopClientes' tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <h1 style={{ fontSize: '1.5em', marginLeft: '0.5em', textAlign: 'center', margin: '1em' }} className="superTituloNegro" >Top clientes por {params.optionSelected}</h1>
                    <div className='container' style={{ margin: '0.2em' }}>
                        <div className='container table-responsive'>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">Pos</th>
                                        <th scope="col">Nombre cliente</th>
                                        <th scope="col">Número de compras realizadas</th>
                                        <th scope="col">Total valor de las compras realizadas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {params.clientes.map((item, index) => {
                                        let nombre =item.nombre
                                        if(item.apellidos!=null){
                                            nombre=nombre+" "+item.apellidos
                                        }
                                        return (
                                            <tr key={index}>
                                                <td><strong>{index+1}</strong></td>
                                                <td>{nombre}</td>
                                                <td style={{ fontWeight: params.optionSelected=='cantidad' ? 'bold' : '', color: params.optionSelected=='cantidad' ? 'green' : '' }}>{item.cantidadDeCompras}</td>
                                                <td style={{ fontWeight: params.optionSelected=='valores' ? 'bold' : '', color: params.optionSelected=='valores' ? 'green' : '' }}>$ {glob.formatNumber(item.totalValorCompra)}</td>
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

export default TopClientesValores