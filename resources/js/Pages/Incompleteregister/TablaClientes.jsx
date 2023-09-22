import React from 'react'

const TablaClientes = (params) => {

    return (
        <div className='table-responsive'>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Usuario</th>
                        <th scope="col">Correo</th>
                        <th scope="col">Contraseña</th>
                    </tr>
                </thead>
                <tbody>
                    {params.noClientes ?
                        <tr style={{ marginTop: '1.5em' }} className='container'><td colSpan='4'>No se han encontrado resultados....</td></tr>
                        :
                        params.clientes.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">
                                        <a href={route('registerincomplete.edit', item.email)} className='btn btn-sm' style={{ cursor: 'pointer', backgroundColor: '#127b38' }} >
                                            <svg style={{ padding: '0.2em' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-pencil-fill rounded" viewBox="0 0 16 16">
                                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                            </svg>
                                        </a>
                                    </th>
                                    <td >
                                        {item.name}
                                    </td>
                                    <td>{item.email}</td>
                                    <td>{item.password}</td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>

        </div>
    )
}

export default TablaClientes