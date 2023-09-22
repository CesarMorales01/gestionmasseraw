import React from 'react'
import GlobalFunctions from '../services/GlobalFunctions'
import Pagination from './Pagination'

export const TablaProductos = (params) => {

    const glob = new GlobalFunctions()


    function setSizeText(id) {
        const text = document.getElementById('textarea' + id)
        const letras = text.value
        const size = Math.round(letras.length / 44)
        text.rows = size + 1
    }

    function defaultSize(id) {
        document.getElementById('textarea' + id).rows = "1"
    }

    return (
        <div style={{ marginTop: '0.5em' }} className='container table-responsive'>
            <table className="table table-striped roundedTable">
                <thead className='navBarFondo align-middle'>
                    <tr>
                        <th  style={{ textAlign: 'center' }} scope="col">Codigo</th>
                        <th  style={{ textAlign: 'center' }} scope="col">Categoria</th>
                        <th  style={{ textAlign: 'center' }} scope="col">Nombre</th>
                        <th  style={{ textAlign: 'center' }} scope="col">Cant</th>
                        <th  style={{ textAlign: 'center' }} scope="col">Precio</th>
                    </tr>
                </thead>
                <tbody>
                    {params.noProductos ?
                        <tr style={{ marginTop: '1.5em' }} className='container'><td colSpan='6'>No se han encontrado resultados....</td></tr>
                        :
                        params.productos.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">
                                        {item.id}
                                        <br />
                                        <a href={route('product.edit', item.id)} className='border' style={{ cursor: 'pointer' }} >
                                            <svg style={{ padding: '0.2em', backgroundColor: '#127b38' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-pencil-fill rounded" viewBox="0 0 16 16">
                                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                            </svg>
                                        </a>
                                    </th>
                                    <td>{item.categoria}</td>
                                    <td>{item.nombre}</td>
                                    <td>{item.cantidad}</td>
                                    <td>${glob.formatNumber(item.valor)}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            {params.noProductos ?
                ''
                :
                <Pagination class="mt-6" links={params.pagination} />
            }
        </div>
    )
}
