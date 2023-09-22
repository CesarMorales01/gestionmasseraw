import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2'
import '../../../css/general.css'
import MasImagenes from './MasImagenes'

const NewProduct = (params) => {

    const glob = new GlobalFunctions()
    const [producto, setProducto] = useState({
        id: '',
        referencia: '',
        categoria: '',
        nombre: '',
        descripcion: '',
        cantidad: 0,
        valor: '',
        imagen: ''
    })

    const [message, setMessage] = useState('')
    const [displayBtnBorrar, setDisplayBtnBorrar] = useState('none')

    useEffect(() => {
        if (params.producto.id == '') {
            setProducto({
                id: '',
                referencia: '',
                categoria: '',
                nombre: '',
                descripcion: '',
                cantidad: 0,
                costo: 0,
                valor: '',
                imagen: 'noPreview.jpg'
            })
        } else {
            setDisplayBtnBorrar('inline')
            // Se recibe un array en params.product, el id se registra en fk_producto
            let img = ''
            if (params.producto[0].nombre_imagen=='') {
                img = 'noPreview.jpg'
            } else {
                img = params.producto[0].nombre_imagen
            }
            setProducto({
                id: params.producto[0].id,
                referencia: params.producto[0].referencia,
                categoria: params.producto[0].categoria,
                nombre: params.producto[0].nombre,
                descripcion: params.producto[0].descripcion,
                cantidad: params.producto[0].cantidad,
                costo: params.producto[0].costo,
                valor: params.producto[0].valor,
                imagen: img
            })
        }
    }, [])

    useEffect(() => {
        if (params.estado != null) {
            Swal.fire({
                title: params.estado,
                icon: 'success',
                timer: 1000,
            })
        }
        if (params.categorias.length == 0) {
            Swal.fire({
                title: "Ingresa primera una categoria!",
                icon: 'warning',
                timer: 2000,
            })
            setTimeout(() => {
                window.location = params.globalVars.myUrl + "category"
            }, 2000);
        }
    }, [])

    function cambioCate(cate) {
        setProducto((valores) => ({
            ...valores,
            categoria: cate.target.value,
        }))
    }

    function cambioNombre(e) {
        setProducto((valores) => ({
            ...valores,
            nombre: e.target.value,
        }))
        if (producto.categoria == '') {
            document.getElementById('selectCate').click()
        }
    }

    function cambioRef(e) {
        setProducto((valores) => ({
            ...valores,
            referencia: e.target.value,
        }))
    }

    function cambioDescripcion(e) {
        setProducto((valores) => ({
            ...valores,
            descripcion: e.target.value,
        }))
    }

    function cambioPrecio(e) {
        setProducto((valores) => ({
            ...valores,
            valor: e.target.value,
        }))
    }

    function loadingOn() {
        document.getElementById('btnLoading').style.display = 'inline'
        document.getElementById('btnIngresar').style.display = 'none'
    }

    function validarContenidoFile() {
        let respuesta = false
        if (document.getElementById("fileImagen").files.length > 0) {
            respuesta = true
        } else {
            setMessage('Debes ingresar una imagen!')
        }
        return respuesta
    }

    function validarFuncion() {
        if (validarCampos()) {
            if (producto.id == '') {
                document.getElementById('formCrear').submit()
                loadingOn()
            } else {
                updateProduct()
                loadingOn()
            }
        }
    }

    function validarContenidoFile() {
        let respuesta = false
        if (document.getElementById("fileImagen").files.length > 0) {
            respuesta = true
        } else {
            setMessage('Debes ingresar una imagen!')
        }
        return respuesta
    }

    function validarCampos() {
        let validado = false
        if (producto.nombre != '' && producto.valor != '' && producto.categoria != '' && producto.descripcion!='') {
            validado = true
            setMessage('')
        } else {
            setMessage('Faltan datos importantes!')
        }
        return validado
    }

    function mostrarImagen(event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
            var img = document.getElementById('img');
            img.src = event.target.result;
        }
        reader.readAsDataURL(file);
    }

    function spinOff() {
        document.getElementById('spanvalidandoNombreImagen').style.display = 'none'
    }

    function setCantidad(e) {
        setProducto((valores) => ({
            ...valores,
            cantidad: e.target.value
        }))
    }

    function setPrecio(e) {
        let uti = parseInt(e.target.value) * 0.2;
        let precio = uti + parseInt(e.target.value)
        if (precio > 0) {
            setProducto((valores) => ({
                ...valores,
                valor: precio
            }))
        }
    }

    function enviarBorrar() {
        loadingOn()
        document.getElementById('eliminar').click()
    }

    function abrirDialogoEliminar() {
        Swal.fire({
            title: '¿Eliminar este producto?',
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

    function updateProduct() {
        const form = document.getElementById("formCrear")
        form.setAttribute("method", "get")
        form.action = route('product.actualizar', producto.id)
        form.submit()
    }
  
    return (
        <AuthenticatedLayout
            user={params.auth.user} globalVars={params.globalVars} >
            <Head title="Producto" />
            <div className="container justify-content-justify">
                <h1 style={{ marginTop: '0.5em', fontSize: '1.5em' }} id="titulo" className="text-center"> {producto.id == '' ? 'Ingresar' : 'Editar'} producto</h1>
                <br />
                <form method="POST" id="formCrear" action={route('product.store')} encType="multipart/form-data">
                    <div style={{ marginBottom: '1em' }} className="row justify-content-around">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                            <input type="hidden" name='_token' value={params.token} />
                            Id (default)
                            <input className='form-control rounded' type="text" name='id' readOnly value={producto.id == '' ? '' : producto.id} />
                            <br />
                            Referencia (Opcional)
                            <input className='form-control rounded' type="text" name='referencia' onChange={cambioRef} placeholder="Referencia" id="referencia" value={producto.referencia == '' ? '' : producto.referencia} />
                            <br />
                            Categoria:
                            <select onChange={cambioCate} onClick={cambioCate} name='categoria' id='selectCate' className="form-select rounded" >
                                {params.categorias.map((item, index) => {
                                    return (
                                        <option key={index} value={item.nombre} selected={item.nombre.trim() === producto.categoria}>{item.nombre}</option>
                                    )
                                })}
                            </select>
                            <br />
                            Nombre
                            <br />
                            <textarea className='form-control rounded' name='nombre' required onChange={cambioNombre} placeholder="Nombre" value={producto.nombre == '' ? '' : producto.nombre} />
                            <br />
                            Descripción
                            <br />
                            <textarea className='form-control rounded' name='descripcion' rows="2" onChange={cambioDescripcion} placeholder="Descripcion" value={producto.descripcion == '' ? '' : producto.descripcion}></textarea>
                            <br />
                            Cantidad (Opcional)
                            <br />
                            <input className='rounded' type="number" name='cantidad' onChange={setCantidad} placeholder="Cantidad" defaultValue={producto.cantidad == '' ? '' : producto.cantidad} />
                            <br /><br />
                            Costo (Opcional)
                            <br />
                            <input className='rounded' type="number" name='costo' onChange={setPrecio} placeholder="Costo producto" defaultValue={producto.costo == '' ? '' : producto.costo} />
                            <br /><br />
                            Precio de venta:
                            <br />
                            <input className='form-control rounded' name='valor' onChange={cambioPrecio} type='number' required placeholder="Valor" value={producto.valor == '' ? '' : producto.valor} />
                        </div>
                        <div style={{ marginTop: '1.5em' }} className="col-lg-6 col-md-6 col-sm-12 col-12" >
                            <input name='imagen' data-toggle="tooltip" id='fileImagen' title="Ingresa imagenes con fondo blanco, aprox 500x500 mp." type="file" disabled={producto.id == '' ? false : true} onChange={mostrarImagen} />
                            <br /><br />
                            <img onLoad={spinOff} className='border' id="img" width="140px" height="150px" src={producto.imagen == 'noPreview.jpg' ? params.globalVars.myUrl + "Images/Config/" + producto.imagen : params.globalVars.urlImagenes + producto.imagen} />
                            <span id='spanvalidandoNombreImagen' style={{ display: '' }} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            <br />
                            {producto.id == '' ? '' : producto.imagen}
                            <span style={{ color: 'red' }}>{message}</span>
                            <br /><br />
                            <div className='row'>
                                <div className='col-md-6 col-6'>
                                    <PrimaryButton id="btnIngresar" type="button" onClick={validarFuncion} className="ml-4" >
                                        {producto.id == '' ? 'Ingresar' : 'Editar'}
                                    </PrimaryButton>
                                    <PrimaryButton id='btnLoading' style={{ display: 'none' }} className="ml-4" type="button" disabled>
                                        <span style={{ marginRight: '0.2em' }} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Loading...
                                    </PrimaryButton>
                                </div>
                                <div className='col-md-6 col-6'>
                                    <button id="btnBorrar" onClick={abrirDialogoEliminar} style={{ display: displayBtnBorrar, backgroundColor: 'red' }} className="btn btn-danger" type="button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                        </svg>
                                    </button>
                                    <button id='btnLoadingBorrar' style={{ display: 'none', backgroundColor: 'red' }} className="btn btn-primary" type="button" disabled>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Loading...
                                    </button>
                                </div>
                            </div>
                            <br /><br />
                            <SecondaryButton style={{ cursor: 'pointer', display: producto.id == '' ? 'none' : '' }} type="button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-images" viewBox="0 0 16 16">
                                    <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                                    <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z" />
                                </svg>
                                <a href='#imagenes' style={{ marginLeft: '0.2em' }}>Subir más imagenes</a>
                            </SecondaryButton>
                            <br /><br />
                        </div>
                    </div>
                </form>
                {/*show cause @method dont work...*/}
                <a id='eliminar' href={route('product.show', producto.id)}></a>
            </div>
            <div style={{ display: producto.id == '' ? 'none' : 'inline' }}>
                <MasImagenes token={params.token} id={producto.id} nombre={producto.nombre} globalVars={params.globalVars} />
            </div>
        </AuthenticatedLayout>
    )
}

export default NewProduct