import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions'
import Swal from 'sweetalert2'
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

const DialogoNewCategory = (params) => {
    const glob = new GlobalFunctions()
    const [categoria, setCategoria] = useState({
        id: '',
        nombre: '',
        imagen: ''
    })

    useEffect(() => {
        if (params.category.id != categoria.id) {
            setCategoria(params.category)
        }
    })

    function mostrarAlertDatosFaltantes() {
        Swal.fire({
            title: 'Faltan datos importantes!',
            icon: 'warning',
            timer: 1000
        })
    }

    function cambioNombre(cate) {
        setCategoria((valores) => ({
            ...valores,
            nombre: cate.target.value,
        }))
    }

    function mostrarImagen(event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
            var img = document.getElementById('ingresarImg');
            img.src = event.target.result;
        }
        reader.readAsDataURL(file);
        setCategoria((valores) => ({
            ...valores,
            imagen: event.target.files[0].name
        }))
    }

    function loadingOn() {
        document.getElementById('btnIngresar').style.display = 'none'
        document.getElementById('btnLoading').style.display = 'inline'
    }

    function validarCampos(e) {
        e.preventDefault()
        if (categoria.nombre != '' && categoria.imagen != '') {
            if (categoria.id == '') {
                document.getElementById('formCrear').submit()
            } else {
                updateCategoria()
            }
            loadingOn()
        } else {
            mostrarAlertDatosFaltantes()
        }
    }

    function updateCategoria() {
        const form = document.getElementById("formCrear")
        form.action = route('category.actualizar', categoria.id)
        form.submit()
    }

    function enviarBorrar(){
        document.getElementById('btnEliminar').click()
        loadingOn()
    }


    function abrirDialogoEliminar(){
        Swal.fire({
            title: '¿Eliminar esta categoria?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si, eliminar!'
          }).then((result) => {
            if (result.isConfirmed) {
              enviarBorrar()
            }
          })
    }

    return (
        <div className="modal fade bd-example-modal-lg" id='dialogoNuevaCategoria' tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 style={{ fontSize: '1.5em', marginLeft: '0.5em' }} className="modal-title">{params.category.id == '' ? 'Crear categoria' : 'Editar categoria'}</h1>
                        <button onClick={abrirDialogoEliminar} id='btnDialogoEliminar' style={{ marginTop: '0.5em', display: params.category.id == '' ? 'none' : '', backgroundColor: 'red' }} className="btn btn-danger" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                            </svg>
                        </button>
                        <a id='btnEliminar' style={{ display: 'none'}} href={route('category.destroy', categoria.id)}></a>
                    </div>
                    <div className='container' style={{ margin: '0.2em' }}>
                        <form method="POST" id="formCrear" onSubmit={validarCampos} action={route('category.store')} encType="multipart/form-data">
                            <input type="hidden" name='_token' value={params.token} />
                            <input type="hidden" name='id' value={params.category.id == '' ? '' : params.category.id} />
                            <input type="hidden" name='idAnterior' value={params.category.id} />
                            <input type="hidden" name='nombreImagenAnterior' value={params.category.id == '' ? '' : params.category.imagen} />
                            <input name='categoria' onChange={cambioNombre} className='form-control' type="text" placeholder='Nombre categoria' value={categoria.nombre} />
                            <div style={{ padding: '0.4em', marginTop: '0.8em' }} className='row border'>
                                <div className='col-lg-12 col-md-12 col-sm-12 col-12'>
                                    <input name='imagen' data-toggle="tooltip" title="" type="file" id="fileImg" onChange={mostrarImagen} />
                                </div>
                                <div style={{ marginTop:'0.2em' }} className='col-lg-12 col-md-12 col-sm-12 col-12'>
                                    <img id="ingresarImg" width="140px" height="150px" src={params.category.id == '' ? params.url + 'Images/Config/noPreview.jpg' : params.urlImagenes + params.category.imagen} />
                                </div>
                                <br />
                            </div>
                            <div className="modal-footer">
                                <SecondaryButton type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</SecondaryButton>
                                <PrimaryButton type='submit' id="btnIngresar" style={{ display: 'inline' }} className="btn btn-success">{params.category.id == '' ? 'Crear categoria' : 'Editar categoria'}</PrimaryButton>
                                <PrimaryButton id='btnLoading' style={{ display: 'none', backgroundColor: 'red' }} className="btn btn-primary" type="button" disabled>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Loading...
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DialogoNewCategory