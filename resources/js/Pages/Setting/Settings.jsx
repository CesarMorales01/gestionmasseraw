import React from 'react'
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react';
import "react-color-palette"
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';

const Settings = (params) => {

    const [datosPagina, setDatosPagina] = useState({
        'id': '',
        'logo': '',
        'color_pagina': 'gray',
        'imagen': '',
        'comision': 0
    })
    const [campoTelefono, setCampoTelefono] = useState('')
    const [telefonos, setTelefonos] = useState(params.telefonos)

    useEffect(() => {
        if (params.globalVars.info != null) {
            setDatosPagina(params.globalVars.info)
        }
    }, [])

    useEffect(() => {
        getImgLogo()
    }, [datosPagina])

    useEffect(() => {
        getImgImagen()
    }, [datosPagina.imagen])


    function getImgLogo() {
        let img = ''
        if (datosPagina.logo == null || datosPagina.logo=='') {
            img = params.globalVars.myUrl + 'Images/Config/noPreview.jpg'
        }else{
            img = params.globalVars.myUrl + 'Images/Products/'+ datosPagina.logo
        }
        document.getElementById('logo').src = img
    }

    function getImgImagen() {
        let img = ''
        if (datosPagina.imagen == null || datosPagina.imagen=='') {
            img = params.globalVars.myUrl + 'Images/Config/noPreview.jpg'
        }else{
            img = params.globalVars.myUrl + 'Images/Products/'+ datosPagina.imagen
        }
        document.getElementById('imagen').src = img
    }


    function borrarTelefono(tel) {
        const temp = telefonos.filter((art) => art !== tel);
        setTelefonos(temp)
    }

    function cambioTelefono(event) {
        setCampoTelefono(event.target.value)
    }

    function agregarTelefono() {
        if (campoTelefono !== '') {
            let tels = []
            tels = telefonos
            tels.push(campoTelefono)
            setTelefonos(tels)
            setCampoTelefono('')
        } else {
            alert('Ingresa un número teléfonico!')
        }
    }

    function alert(mensaje) {
        Swal.fire({
            title: mensaje,
            icon: 'warning',
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1500,
        })
    }

    function cambioNombre(e) {
        setDatosPagina((valores) => ({
            ...valores,
            nombre: e.target.value,
        }))
    }

    function cambioDescripcion(e) {
        setDatosPagina((valores) => ({
            ...valores,
            descripcion_pagina: e.target.value,
        }))
    }

    function cambioDireccion(e) {
        setDatosPagina((valores) => ({
            ...valores,
            direccion_pagina: e.target.value,
        }))
    }

    function cambioCorreo(e) {
        setDatosPagina((valores) => ({
            ...valores,
            correo: e.target.value,
        }))
    }

    function cambioComision(e) {
        setDatosPagina((valores) => ({
            ...valores,
            comision: e.target.value,
        }))
    }

    function loadingOn() {
        document.getElementById('btnLoading').style.display = 'inline'
        document.getElementById('btnIngresar').style.display = 'none'
    }

    function fetchIngresarDatos(e) {
        e.preventDefault()
        if (datosPagina.nombre === '' || datosPagina.nombre === undefined) {
            alert('Faltan datos importantes!')
        } else {
            loadingOn()
            document.getElementById('formCrear').submit()
        }
    }

    function mostrarLogo(event) {
        var file = event.target.files[0]
        var reader = new FileReader();
        reader.onload = function (event) {
            var img = document.getElementById('logo');
            img.src = event.target.result;
        }
        reader.readAsDataURL(file)
    }

    function mostrarImagen(event) {
        var file = event.target.files[0]
        var reader = new FileReader();
        reader.onload = function (event) {
            var img = document.getElementById('imagen');
            img.src = event.target.result;
        }
        reader.readAsDataURL(file)
    }

    function spinOff() {
        document.getElementById('spanvalidandoNombreImagen').style.display = 'none'
    }

    function cambiarColor(e) {
        setDatosPagina((valores) => ({
            ...valores,
            color_pagina: e.target.value,
        }))
    }

    function cambiarFb(e) {
        setDatosPagina((valores) => ({
            ...valores,
            linkfb: e.target.value,
        }))
    }

    function cambiarInsta(e) {
        setDatosPagina((valores) => ({
            ...valores,
            linkinsta: e.target.value,
        }))
    }

    return (
        <AuthenticatedLayout user={params.auth} globalVars={params.globalVars} >
            <Head title="Productos" />
            <div className="container justify-content-justify">
                <h1 style={{ marginTop: '0.5em', fontSize: '1.5em' }} id="titulo" className="text-center">Configuración aplicacion web</h1>
                <h5 className="text-center">(Algunos de estos datos son usados en caso de extender a página web) </h5>
                <form onSubmit={fetchIngresarDatos} method="POST" id="formCrear" action={route('setting.store')} encType="multipart/form-data">
                    <div className="row justify-content-around">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                            <input type="hidden" name='_token' value={params.token} />
                            <input type="hidden" name='id' value={datosPagina.id == '' ? '' : datosPagina.id} />
                            Nombre de la aplicación
                            <input className='form-control' name='nombre' type="text" onChange={cambioNombre} placeholder="Este nombre se mostrará junto al logo" value={datosPagina.nombre} />
                            <br />
                            ¿Quienes somos?
                            <textarea className='form-control' name='descripcion_pagina' onChange={cambioDescripcion} placeholder="Descripción" value={datosPagina.descripcion_pagina} />
                            <br />
                            Dirección
                            <textarea className='form-control' name='direccion_pagina' onChange={cambioDireccion} placeholder="Dirección" value={datosPagina.direccion_pagina} />
                            <br />
                            Email
                            <input className='form-control' name='correo' type="text" onChange={cambioCorreo} value={datosPagina.correo} />
                            <br />
                            Porcentate comisión pasarela de pagos (Solo para pagos en linea: n° de 1 a 100)
                            <input className='form-control' type="number" step="any" name='comision' onChange={cambioComision} defaultValue={datosPagina.comision_pasarela_pagos} />
                            <br />
                            <input type='hidden' name='telefonos[]' value={telefonos}></input>
                            <p style={{ textAlign: 'left', color: 'black' }}>Télefonos <span style={{ textAlign: 'left', color: 'red' }}><strong>*</strong></span></p>
                            {/* div telefonos */}
                            <div style={{ textAlign: 'center' }} className="container">
                                <div className="row justify-content-center" >
                                    {telefonos.map((item, index) => {
                                        return (
                                            <div key={index} style={{ margin: '1em' }} className="col-lg-4 col-md-4 col-sm-4 col-4 border">
                                                <p>{item}</p>
                                                <button onClick={() => borrarTelefono(item)} style={{ marginBottom: '0.4em', height: '1.24m', width: '1.4em', cursor: 'pointer', backgroundColor: 'red', padding: '0.1em' }} className="btn btn-danger" type="button">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="row">
                                    <div className="col-sm-8 col-8">
                                        <input onChange={cambioTelefono} type="number" className="form-control" value={campoTelefono} placeholder="Nuevo número télefono" />
                                    </div>
                                    <div className="col-sm-4 col-4">
                                        <SecondaryButton type="button" onClick={agregarTelefono} className="btn btn-primary align-middle">Agregar</SecondaryButton>
                                    </div>
                                </div>
                            </div>
                            <br />
                            {/* fin div telefonos */}

                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 col-12" >
                            Enlace a perfil en facebook
                            <input className='form-control' name='fb' type="text" onChange={cambiarFb} value={datosPagina.linkfb} />
                            Enlace a perfil en instagram
                            <input className='form-control' name='insta' type="text" onChange={cambiarInsta} value={datosPagina.linkinsta} />
                            <label className="form-label">Color barra navegación</label>
                            <input style={{ cursor: 'pointer' }} name='color_pagina' type="color" className="form-control form-control-color" onChange={cambiarColor} value={datosPagina.color_pagina} title="Choose your color" />
                            <br />
                            Logo (Se muestra al inicio de la página)
                            <input name='logo' data-toggle="tooltip" id='fileLogo' title="" onChange={mostrarLogo} type="file" />
                            <input name='logoAnterior' type='hidden' value={datosPagina.logo}></input>
                            <br />
                            <img onLoad={spinOff} className='border' alt='' id="logo" width="80px" height="80px" />
                            <br /><br />
                            Imagen publicitaria (Se muestra en la sección contactos)
                            <input name='imagenAnterior' type='hidden' value={datosPagina.imagen}></input>
                            <input name='imagen' data-toggle="tooltip" id='fileImagen' title="" onChange={mostrarImagen} type="file" />
                            <br />
                            <img className='border' id="imagen" width="140px" height="150px"  />
                            <span id='spanvalidandoNombreImagen' style={{ display: 'none' }} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            <br />
                            {datosPagina.imagen == '' ? '' : datosPagina.imagen}
                            <br /><br />
                        </div>
                        <div style={{ textAlign: 'center' }} >
                            <PrimaryButton id="btnIngresar" className="btn btn-success" type="submit">Guardar cambios</PrimaryButton>
                            <button id='btnLoading' style={{ display: 'none', backgroundColor: 'green' }} className="btn btn-primary" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Loading...
                            </button>
                        </div>

                        <br /> <br />
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    )
}

export default Settings