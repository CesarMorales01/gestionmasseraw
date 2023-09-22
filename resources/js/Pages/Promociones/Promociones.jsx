import React from 'react'
import GlobalFunctions from '../services/GlobalFunctions';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import Swal from 'sweetalert2'

const Promociones = (params) => {
    const glob = new GlobalFunctions()
    const [promos, setPromos] = useState(params.promos)

    useEffect(() => {
        if (params.estado != null) {
            Swal.fire({
                title: params.estado,
                icon: params.estado.includes('elimin') ? 'warning' : 'success',
                timer: 1000,
            })
        }
    }, [])

    return (
        <AuthenticatedLayout  user={params.auth} globalVars={params.globalVars}>
            <Head title="Productos" />
            <div className='container table-responsive'>
                <div style={{ marginBottom: '1em' }} align="center" className="row justify-content-center">
                    <div className="row">
                        <div style={{ textAlign: 'left', marginTop: '0.8em' }} className="col-lg-3 col-md-6 col-sm-12 col-12" >
                            <a href={route('promo.create')} style={{ color: 'black' }} className='btn bg-green-700 hover:bg-green-400 btn-sm'>Nueva promoción</a>
                        </div>
                        <div style={{ marginTop: '0.2em', textAlign: 'right' }} className="col-lg-9 col-md-6 col-sm-12 col-12" >
                        </div>
                    </div>
                </div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Descripción</th>
                            <th scope="col">Id Producto</th>
                            <th scope="col">Imagen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promos.length==0 ?
                            <tr style={{ marginTop: '1.5em' }} className='container'><td colSpan='4'>No se han encontrado resultados....</td></tr>
                            :
                            promos.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <th scope="row">
                                            {item.id}
                                            <br />
                                            <a href={route('promo.edit', item.id)} className='border' style={{ cursor: 'pointer' }} >
                                                <svg style={{ padding: '0.2em', backgroundColor: '#127b38' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-pencil-fill rounded" viewBox="0 0 16 16">
                                                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                                </svg>
                                            </a>
                                        </th>
                                        <td>{item.descripcion}</td>
                                        <td>{item.ref_producto}</td>
                                        <td>
                                            <img style={{ width: '6em', heigth: '6em' }} src={params.globalVars.urlImagenes + item.imagen} />
                                        </td>
                                        <td>{item.producto}</td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    )
}

export default Promociones