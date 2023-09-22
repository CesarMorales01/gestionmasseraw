import React from 'react'
import GlobalFunctions from '../services/GlobalFunctions'
import Swal from 'sweetalert2'

const TablaIngresos = (params) => {
    const glob = new GlobalFunctions()

    function confirmarBorrar(item) {
        Swal.fire({
            title: '¿Eliminar ingreso por ' + item.categoria + ' de $' + glob.formatNumber(item.valor) + ' ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                loadingOn(item.id)
                document.getElementById('formEliminar' + item.id).submit()
            }
        })
    }

    function loadingOn(id) {
        document.getElementById('loadingIngreso' + id).style.display = ''
        document.getElementById('btnEliminarIngreso' + id).style.display = 'none'
    }

    return (
        <div style={{ marginTop: '0.5em' }} className='table-responsive'>
            <table className="table table-striped  roundedTable">
                <thead className='navBarFondo align-middle'>
                    <tr>
                        <th style={{ textAlign: 'center' }} scope="col">Fecha</th>
                        <th style={{ textAlign: 'center' }} scope="col">Categoria</th>
                        <th style={{ textAlign: 'center' }} scope="col">Valor</th>
                        <th style={{ textAlign: 'center' }} scope="col">Comentarios</th>
                        <th style={{ textAlign: 'center' }} scope="col">Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {params.noDatos ?
                        <tr style={{ marginTop: '1.5em' }} className='container'><td colSpan='6'>No se han encontrado resultados....</td></tr>
                        :
                        params.datos.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <th>{item.fecha}</th>
                                    <td>{item.categoria}</td>
                                    <td>$ {glob.formatNumber(item.valor)}</td>
                                    <td>{item.comentario}</td>
                                    <th style={{ textAlign: 'center' }}>
                                        <form method="get" id={"formEliminar" + item.id} action={route('income.show', item.id)} >
                                        </form>
                                        <button id={'btnEliminarIngreso' + item.id} onClick={() => confirmarBorrar(item)} className='border border-dark rounded cursorPointer' style={{ padding: '0.2em', backgroundColor: 'red', display: item.precio === 0 ? 'none' : 'inline' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                            </svg>
                                        </button>
                                        <div >
                                            <span id={'loadingIngreso' + item.id} style={{ display: 'none' }} className="spinner-border text-danger" role="status" aria-hidden="true"></span>
                                        </div>
                                    </th>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default TablaIngresos