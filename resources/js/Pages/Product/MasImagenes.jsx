import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2'

const MasImagenes = (params) => {
    const glob = new GlobalFunctions()
    const [imagenes, setImagenes] = useState([])
    const [id, setId] = useState('')
    const [mensajeImgs, setMensajeImgs] = useState('')
    const [imagenEliminar, setImagenEliminar] = useState({
        id:'',
        nombre:''
    })
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileId, setFileId] = useState(Math.random())
    const [cargar, setCargar] = useState(true)

    
    useEffect(() => {
        checkId()
    })
    
    function checkId() {
        if (id != params.id) {
            setId(params.id)
        }
    }

    useEffect(() => {
        if (cargar) {
            fetchImagenes()
        }
    }, [imagenes, id])

    function fetchImagenes() {
        const url = params.globalVars.myUrl + 'api/product/getimages/' + params.id
        fetch(url)
            .then((response) => {
                return response.json()
            }).then((json) => {
                setCargar(false)
                setImagenes(json)
            })
    }

    function sweetAlert(mensaje){
        Swal.fire({
            title: mensaje,
            icon: 'warning',
            timer: 2000,
        })
    }

    function loadingOffImgs() {
        document.getElementById('btnIngresarImg').style.display = 'inline'
        document.getElementById('btnLoadingImg').style.display = 'none'
    }

    function loadingOnImgs() {
        document.getElementById('btnIngresarImg').style.display = 'none'
        document.getElementById('btnLoadingImg').style.display = 'inline'
    }

    function reiniciarImagenes() {
        const array = []
        setImagenes(array)
        setCargar(true)
    }

    function mostrarImagenImgs(event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
            var img = document.getElementById('ingresarImg');
            img.src = event.target.result;
        }
        reader.readAsDataURL(file);
    }

    function abrirDialogoEliminarImagen(item) {
        setImagenEliminar((valores) => ({
            ...valores,
            id: item.id,
            nombre: item.nombre_imagen
        }))
        document.getElementById('botonDialogoEliminarImg').click()
    }

    function fetchBorrarImagen() {
        loadingOnImgs()
        const url = params.globalVars.myUrl+ 'product/deleteimage/'+imagenEliminar.id+"/"+imagenEliminar.nombre+"/"+params.id
        fetch(url)
            .then((response) => {
                return response.json()
            }).then((json) => {
                if (json=='ok') {
                    setFileId(Math.random())
                    setMensajeImgs('Imagen eliminada.')
                    document.getElementById('botonDialogoEliminarImg').click()
                    reiniciarImagenes()
                    loadingOffImgs()
                } else {
                    // Puede estar ocupada por una promocion u otro error al eliminar la imagen....
                   sweetAlert('¡Imagen ocupada por una promoción!')
                   document.getElementById('botonDialogoEliminarImg').click()
                   loadingOffImgs()
                }
            })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (selectedFile!=null) {
            loadingOnImgs()
            const formData = new FormData();
            const fileName = selectedFile.name
            formData.append("image", selectedFile);
            const url = params.globalVars.myUrl + 'product/image/' + params.id + "?_token=" + params.token + "&name=" + fileName
            try {
                const response = await axios.post(url, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                }).then((res) => {
                    if (res.data=='ok') {
                        document.getElementById(fileId).value=""
                        setFileId(Math.random())
                        setMensajeImgs('Imagen guardada.')
                        reiniciarImagenes()
                        document.getElementById('ingresarImg').src = params.globalVars.myUrl + 'Images/Config/noPreview.jpg'
                        loadingOffImgs()
                    } else {
                        setMensajeImgs('Problemas al guardar la imagen!')
                    }
                }).catch((error) => {
                });
            } catch (error) {
            }
        }else{
            setMensajeImgs("Debes seleccionar una imagen!")
        }  
    }

    const handleFileSelect = (event) => {
        mostrarImagenImgs(event)
        setSelectedFile(event.target.files[0])
    }

    return (
        <div className='container' id='imagenes'>
            <hr></hr>
            <h1 style={{ textAlign: 'center', margin: '1em', fontSize: '1.5em' }} >Imagenes de {params.nombre}</h1>
            <div className='container' style={{ margin: '0.2em' }}>
                <div style={{ padding: '0.2em' }} className='row'>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                        <input data-toggle="tooltip" title="Ingresa imagenes con fondo blanco, aprox 500x500 mp." type="file" id={fileId} onChange={handleFileSelect} />
                        <span style={{ color: 'red' }}>{mensajeImgs}</span>
                        <br />
                        <span id='spanvalidandoNombreImagenImgs' style={{ display: 'none' }} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                        <img id="ingresarImg" width="140px" height="150px" src={params.globalVars.myUrl + 'Images/Config/noPreview.jpg'} />
                    </div>
                    <br />
                    <div style={{ marginTop: '0.4em' }} className="col text-center">
                        
                        <PrimaryButton type='submit' id="btnIngresarImg" className="ml-4" >Ingresar imagen</PrimaryButton>
                        <button id='btnLoadingImg' style={{ display: 'none', backgroundColor: 'red' }} className="btn btn-primary" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </button>
                    </div>
                    </form>
                </div>
                <div style={{ marginTop: '0.4em' }} className="container">
                    <div className="row border">
                        <h6 style={{ textAlign: 'center', marginTop: '0.4em' }}>Imagenes almacenadas:</h6>
                        <span id='inputNombreImagen'></span>
                        {imagenes.map((item, index) => {
                            return (
                                <div key={index} className="col-lg-3 col-md-4 col-sm-6 col-6">
                                    {/* dialogo eliminar*/}
                                    <button className='rounded-circle' type="button" onClick={() => abrirDialogoEliminarImagen(item)} style={{ display: imagenes.length > 1 ? 'inline' : 'none', backgroundColor: 'orange' }}>
                                        <svg style={{ padding: '0.2em' }} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                        </svg>
                                    </button>
                                    
                                    <img onLoad={loadingOffImgs} className="img-fluid" src={params.globalVars.urlImagenes  + item.nombre_imagen} />
                                </div>
                            )
                        })}
                    </div>
                </div>

                <br />
            </div>
            <button id='botonDialogoEliminarImg' data-bs-toggle="modal" data-bs-target="#dialogoEliminarImgs" style={{ display: 'none' }}></button>
            <div className="modal fade" id="dialogoEliminarImgs" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Eliminar imagen {imagenEliminar.nombre}?</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-footer">
                            <SecondaryButton type="button" data-bs-dismiss="modal" >Cancelar</SecondaryButton>
                            <PrimaryButton type="button" onClick={fetchBorrarImagen} >Confirmar</PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}

export default MasImagenes