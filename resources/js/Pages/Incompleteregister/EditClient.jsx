import React from 'react'
import GlobalFunctions from '../services/GlobalFunctions';
import { useState, useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import Swal from 'sweetalert2'
import SelectMunicipios from '../Customer/SelectMunicipios';
import DialogoAgregarTel from '../Customer/DialogoAgregarTel';
import '../../../css/general.css'

const NewClient = (params) => {

    const glob = new GlobalFunctions()
    const [newDatosPersonales, setNewDatosPersonales] = useState({
        nombre: '',
        apellidos: '',
        cedula: '',
        direccion: '',
        info_direccion: '',
        ciudad: '',
        departamento: '',
        otros: '',
        telefonos: [],
        usuario: '',
        clave: '',
        correo: '',
        fecha: glob.getFecha()
    })
    const [codigoEditar, setCodigoEditar] = useState('')

    useEffect(() => {
        if (params.estado != null) {
            Swal.fire({
                title: params.estado,
                icon: 'warning',
                timer: 1000,
            })
        }
    }, [])

    useEffect(() => {
        cargarDatos()
    }, [])

    function cargarDatos() {
        setNewDatosPersonales((valores) => ({
            ...valores,
            usuario: params.cliente.name,
            correo: params.cliente.email,
            clave: params.cliente.password
        }))
    }

    function cambioNombre(e) {
        setNewDatosPersonales((valores) => ({
            ...valores,
            nombre: e.target.value,
        }))
    }

    function cambioApellidos(e) {
        setNewDatosPersonales((valores) => ({
            ...valores,
            apellidos: e.target.value,
        }))
    }

    function cambioCedula(e) {
        setNewDatosPersonales((valores) => ({
            ...valores,
            cedula: e.target.value,
        }))
    }

    function cambioCorreo(e) {
        setNewDatosPersonales((valores) => ({
            ...valores,
            correo: e.target.value,
        }))
    }

    function cambioDireccion(e) {
        setNewDatosPersonales((valores) => ({
            ...valores,
            direccion: e.target.value,
        }))
    }

    function cambioInfoDireccion(e) {
        setNewDatosPersonales((valores) => ({
            ...valores,
            info_direccion: e.target.value,
        }))
    }

    function cambioCiudad(e) {
        let codCiudad = 0
        let nombreCiudad = ''
        let codDepto = 0
        let nombreDepto = ''
        for (let i = 0; i < params.municipios.length; i++) {
            if (params.municipios[i].id == e.target.value) {
                codCiudad = params.municipios[i].id;
                document.getElementById('codCiudad').value = codCiudad
                nombreCiudad = params.municipios[i].nombre
                codDepto = params.municipios[i].departamento_id
                document.getElementById('codDepto').value = codDepto
            }
        }
        for (let i = 0; i < params.deptos.length; i++) {
            if (params.deptos[i].id == codDepto) {
                nombreDepto = params.deptos[i].nombre
            }
        }
        document.getElementById('inputCiudad').value = nombreCiudad
        document.getElementById('inputDepartamento').value = nombreDepto
        setNewDatosPersonales((valores) => ({
            ...valores,
            ciudad: codCiudad,
            departamento: codDepto
        }))
    }

    function cambioUsuario(e) {
        setNewDatosPersonales((valores) => ({
            ...valores,
            usuario: e.target.value,
        }))
    }

    function cambioClave(e) {
        setNewDatosPersonales((valores) => ({
            ...valores,
            clave: e.target.value,
        }))
    }

    function borrarTelefono(tel) {
        const temp = newDatosPersonales.telefonos.filter((art) => art !== tel);
        setNewDatosPersonales((valores) => ({
            ...valores,
            telefonos: temp
        }))
    }

    function cerrarDialogoNewTel() {
        document.getElementById('btnCerrarDialogoNewTel').click()
    }

    function agregarTelefono(e) {
        cerrarDialogoNewTel()
        let array = []
        setNewDatosPersonales((valores) => ({
            ...valores,
            telefonos: array
        }))
        let tels = newDatosPersonales.telefonos
        tels.push(e.target.value)
        setTimeout(() => {
            setNewDatosPersonales((valores) => ({
                ...valores,
                telefonos: tels
            }))
        }, 100);
    }

    function loadingOn() {
        document.getElementById('btnModificarUsuario').style.display = 'none'
        document.getElementById('btnLoadingUsuario').style.display = 'inline'
    }

    function validarInfoDivUsuario(e) {
        e.preventDefault()
        if (validarDatosVaciosDir()) {
            if (newDatosPersonales.nombre == '' || newDatosPersonales.cedula == '') {
                alertDatosFaltantes('Ingresa nombre y/o cédula!')
            }
        } else {
            validarUsuarioExistente()
        }
    }

    function validarUsuarioExistente() {
        const url = params.globalVars.myUrl + 'api/customer/getclient/' + newDatosPersonales.cedula+"/"+newDatosPersonales.correo
        fetch(url)
            .then((response) => {
                return response.json()
            }).then((json) => {
                if (json.cliente != null) {
                    alertDatosFaltantes('Ya existe un usuario con el número de identificación ingresado!')
                } else {
                    loadingOn()
                    document.getElementById('formCrear').submit()
                }
            })
    }

    function alertDatosFaltantes(mensaje) {
        Swal.fire({
            title: mensaje,
            icon: 'warning',
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1500,
        })
    }

    function validarDatosVaciosDir() {
        let vacios = true
        if (newDatosPersonales.usuario == '' || newDatosPersonales.email == '') {
            alertDatosFaltantes('Ingresa usuario, email y/o contraseña')
            vacios = true
        } else {
            if (newDatosPersonales.direccion == '' || newDatosPersonales.ciudad == '' || newDatosPersonales.ciudad == null || newDatosPersonales.telefonos.length == 0) {
                alertDatosFaltantes('Ingresa dirección, ciudad de residencia y al menos un télefono!')
                vacios = true
            } else {
                vacios = false
            }
        }
        return vacios
    }

    function enviarBorrar() {
        document.getElementById('btnEliminar').click()
        loadingOn()
    }

    function abrirDialogoEliminar(){
        Swal.fire({
            title: '¿Eliminar este cliente?',
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
        <AuthenticatedLayout
            user={params.auth} info={params.info} urlImagenes={params.globalVars.urlImagenes}
        >
            <Head title="Clientes" />
            <div className="container">
                <h1 style={{ marginTop: '0.5em', fontSize: '1.5em' }} id="titulo" className="text-center"> {params.cliente.id == '' ? 'Nuevo cliente' : 'Editar cliente'}</h1>
                <a id='btnEliminar' style={{ display: 'none'}} href={route('customer.destroy', newDatosPersonales.cedula)}></a>
                <form action={route('registerincomplete.store')} id='formCrear' method='post' onSubmit={validarInfoDivUsuario} >
                    <input type="hidden" name='_token' value={params.token} />
                    <input type="hidden" name='fecha' value={newDatosPersonales.fecha} />
                    {/* datos personales*/}
                    <div id="div_datos_personales" style={{ backgroundColor: '#f4f4f4', padding: '0.4em' }}>
                        <div className="row justify-content-center" >
                            <div className="col-lg-4 col-sm-12" >
                                <strong style={{ fontSize: '1em' }} >Datos personales</strong>
                                <br />
                                <p style={{ textAlign: 'justify', color: 'black' }}>Nombres</p>
                                <input type="text" name='nombre' onChange={cambioNombre} id='inputNombre' className="form-control" value={newDatosPersonales.nombre == '' ? '' : newDatosPersonales.nombre} />
                                <br />
                            </div>

                            <div className="col-lg-4 col-sm-12" >
                                <br />
                                <p style={{ textAlign: 'justify', color: 'black' }}>Apellidos</p>
                                <input type="text" name='apellidos' onChange={cambioApellidos} id='inputApellidos' className="form-control" value={newDatosPersonales.apellidos == '' ? '' : newDatosPersonales.apellidos} />
                                <br />
                            </div>
                        </div>
                        <div className="row justify-content-center" >
                            <div className="col-lg-4 col-sm-12" >
                                <p style={{ textAlign: 'center', color: 'black' }}>Número de cédula</p>
                            </div>
                            <div className="col-lg-4 col-sm-12" >
                                <input name='cedula' readOnly={codigoEditar == '' ? false : true} type="number" id='inputCedula' onChange={cambioCedula} placeholder="Número de cédula" className="form-control" defaultValue={newDatosPersonales.cedula == '' ? '' : newDatosPersonales.cedula} />
                            </div>
                        </div>
                        <br />
                    </div>
                    <br />
                    {/* Direccion de envio*/}
                    <div style={{ backgroundColor: '#f4f4f4', padding: '0.5em' }}>
                        <div className="row justify-content-center" >
                            <div className="col-lg-8 col-sm-12">
                                <strong style={{ fontSize: '1em' }} >Dirección de envio</strong>
                                <textarea name='direccion' onChange={cambioDireccion} id='inputDireccion' rows="2" className="form-control" value={newDatosPersonales.direccion == '' ? '' : newDatosPersonales.direccion}></textarea>
                                <br />
                            </div>
                            <div className="col-lg-8 col-sm-12">
                                <textarea name='info_direccion' onChange={cambioInfoDireccion} id="inputInfoDireccion" rows="2" placeholder="Información adicional: apartamento, local, torre, etc. (Opcional)" className="form-control" value={newDatosPersonales.info_direccion == '' ? '' : newDatosPersonales.info_direccion}></textarea>
                                <br />
                            </div>
                        </div>
                        <div style={{ width: '70%' }} className='container'>
                            <SelectMunicipios ciudades={params.municipios} className="form-control" getMunicipio={cambioCiudad} />
                        </div>

                        <div style={{ textAlign: 'center' }} className="row justify-content-center" >
                            <div className="col-lg-4 col-sm-12" >
                                <strong style={{ fontSize: '1em' }} >Ciudad</strong>
                                <input name='ciudad' type="text" readOnly placeholder="Ciudad" className="form-control" id="inputCiudad" />
                                <input name='codCiudad' type="hidden" id="codCiudad" />
                            </div>
                            <br /><br />
                            <div className="col-lg-4 col-sm-12">
                                <strong style={{ fontSize: '1em' }} >Departamento</strong>
                                <input name='departamento' type="text" readOnly placeholder="Departamento" className="form-control" id="inputDepartamento" />
                                <input name='codDepto' type="hidden" id="codDepto" />
                                <br />
                            </div>
                        </div>

                        <p style={{ textAlign: 'center', color: 'black' }}>Télefonos (<strong style={{ color: ' red' }}>*</strong>Obligatorio)</p>
                        {/* div telefonos */}
                        <div style={{ textAlign: 'center' }} className="container">
                            <div className="row justify-content-center" >
                                <input name='telefonos[]' value={newDatosPersonales.telefonos} type='hidden' id='inputTelefonos' />
                                {newDatosPersonales.telefonos.map((item, index) => {
                                    return (
                                        <div key={index} style={{ margin: '1em' }} className="col-lg-2 col-md-2 col-sm-4 col-6 border">
                                            <p>{item}</p>
                                            <button className='rounded-circle' type="button" onClick={() => borrarTelefono(item)} style={{ backgroundColor: 'orange' }}>
                                                <svg style={{ padding: '0.2em' }} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                </svg>
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                            <button id='btnCerrarDialogoNewTel' type="button" className="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#dialogoNewTel"><i className="fa-solid fa-plus"></i>Nuevo télefono
                            </button>
                            <DialogoAgregarTel cerrarDialogo={cerrarDialogoNewTel} agregarTelefono={agregarTelefono} />
                        </div>
                        {/* fin div telefonos */}
                    </div>
                    <br />
                    {/* Datos usuario */}
                    <div style={{ backgroundColor: '#f4f4f4', padding: '0.3em' }}>
                        <div className="row justify-content-center">
                            <div className="col-lg-8 col-sm-12" >
                                <strong style={{ fontSize: '1em' }} >Datos de cuenta</strong>
                                <div style={{ backgroundColor: '#f4f4f4', padding: '0.3em' }}>
                                    <p style={{ textAlign: 'justify', color: 'black' }}>Nombre de usuario</p>
                                    <input name='usuario' type="text" onChange={cambioUsuario} className="form-control" id="inputUsuario" value={newDatosPersonales.usuario == '' ? '' : newDatosPersonales.usuario} />
                                    <br />
                                    <p style={{ textAlign: 'justify', color: 'black' }}>E-mail</p>
                                    <input name='correo' type="text" readOnly className="form-control" id="inputCorreo" defaultValue={newDatosPersonales.correo == '' ? '' : newDatosPersonales.correo} />
                                    <br />
                                </div>
                                <strong style={{ fontSize: '1em' }} >Contraseña</strong>
                                <div style={{ backgroundColor: '#f4f4f4', padding: '0.5em' }}>
                                    <input name='clave' type="password" onChange={cambioClave} id="inputClave" className="form-control" value={newDatosPersonales.clave == '' ? '' : newDatosPersonales.clave} />
                                    <br />
                                </div>
                                <div style={{ textAlign: 'center' }} className="row justify-content-center">
                                    <div className="col-12" >
                                        <PrimaryButton type='submit' id="btnModificarUsuario">{params.cliente.id == '' ? 'Crear Cliente' : 'Editar cliente'}</PrimaryButton>
                                        <button id='btnLoadingUsuario' style={{ display: 'none', backgroundColor: 'green' }} className="btn btn-primary" type="button" disabled>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Loading...
                                        </button>
                                    </div>
                                    <br /><br />
                                    <div className="col-12" >
                                        <button onClick={abrirDialogoEliminar} id='btnDialogoEliminar' style={{ marginTop: '0.5em', display: codigoEditar == '' ? 'none' : 'inline', backgroundColor: 'red' }} className="btn btn-danger" type="button">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <br />
                            </div>
                            <br />
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    )

}

export default NewClient