import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import React from 'react'
import { useState, useEffect } from 'react'

const DialogoAgregarTel = (params) => {
    const [telefono, setTelefono] = useState('')

    function limpiarInput() {
        document.getElementById('inputNewTel').value = ''
    }

    function cambiarTelefono(e) {
        setTelefono(e.target.value)
    }

    function agregarTel() {
        document.getElementById('inputTelHidden').click()
    }

    return (
        <div className="modal fade" id="dialogoNewTel">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <span id="alert_check_contra" style={{ color: 'black' }} >Nuevo telefono</span>
                        <br /><br />
                        <input type="number" defaultValue='' onChange={cambiarTelefono} id="inputNewTel" className="form-control rounded" />
                    </div>
                    <div className="row justify-content-around">
                        <div onClick={limpiarInput} className="col-3">
                            <SecondaryButton type="button" onClick={params.cerrarDialogo} style={{ backgroundColor: '#d22c21' }} data-dismiss="modal">Cancelar</SecondaryButton>
                        </div>
                        <div onClick={limpiarInput} className="col-3">
                            <input type='hidden' id='inputTelHidden' onClick={params.agregarTelefono} value={telefono} />
                            <PrimaryButton type="button" onClick={agregarTel} style={{ backgroundColor: '#228b22' }}>Agregar</PrimaryButton>
                        </div>
                    </div>
                    <br /><br />
                </div>
            </div>
        </div>
    )
}

export default DialogoAgregarTel