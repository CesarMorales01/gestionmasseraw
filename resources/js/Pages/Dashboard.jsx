import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import '../../css/general.css'
import logoProducts from '../../../public/Images/Config/products.jpg'
import logoRegistradora from '../../../public/Images/Config/registradora.jpg'
import logoClientes from '../../../public/Images/Config/clientes.webp'
import logoIngresos from '../../../public/Images/Config/ingresos.jpg'
import logoEgresos from '../../../public/Images/Config/spend.jpg'
import logoInformes from '../../../public/Images/Config/reports.webp'
import logoProviders from '../../../public/Images/Config/provider.jpg'
import Progressbar from './UIGeneral/ProgressBar'
import React, { useState, useEffect } from 'react'

export default function Dashboard(params) {
    const [progressBar, setProgressBar] = useState(false)

    function goProducts() {
        window.location = params.globalVars.myUrl + "product"
        setProgressBar(true)
    }


    function goVentas() {
        window.location = params.globalVars.myUrl + "shopping"
        setProgressBar(true)
    }

    function goClientes() {
        window.location = params.globalVars.myUrl + "customer/list/nothing"
        setProgressBar(true)
    }

    function goIngresos() {
        window.location = params.globalVars.myUrl + "income/list/nothing"
        setProgressBar(true)
    }

    function goEgresos() {
        window.location = params.globalVars.myUrl + "spend/list/nothing"
        setProgressBar(true)
    }

    function goInformes() {
        window.location = params.globalVars.myUrl + "report/list/nothing"
        setProgressBar(true)
    }

    function goProviders() {
        window.location = params.globalVars.myUrl + "provider/list/nothing"
        setProgressBar(true)
    }


    return (
        <AuthenticatedLayout
            user={params.auth}
            globalVars={params.globalVars}
        >
            <Head title={params.globalVars.info==null ? 'Gestion pymes' : params.globalVars.info.nombre} />
            <div className="py-2">
                <div style={{ display: progressBar ? '' : 'none' }}>
                    <Progressbar progress={progressBar}></Progressbar>
                </div>
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg py-3">
                    <div style={{ textAlign: 'center' }} className="container">
                        <div className="row justify-content-center" >
                            <div style={{ marginBottom: '1em' }} className="col-lg-4 col-md-4 col-sm-6 col-6"  >
                                <div onClick={goProducts} className="card border border-primary card-flyer pointer">
                                    <img style={{ width: '12em', height: '10em', marginTop: '1em' }} src={logoProducts} className="card-img-top img-fluid centerImg" alt="" />
                                    <div style={{ textAlign: 'center' }} className="card-body">
                                        <h2 className="card-title superTitulo">Productos</h2>
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginBottom: '1em' }} className="col-lg-4 col-md-4 col-sm-6 col-6"  >
                                <div onClick={goVentas} className="card border border-primary card-flyer pointer">
                                    <img style={{ width: '10em', height: '10em', marginTop: '1em' }} src={logoRegistradora} className="card-img-top img-fluid centerImg" alt="" />
                                    <div style={{ textAlign: 'center' }} className="card-body">
                                        <h2 className="card-title superTitulo">Ventas</h2>
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginBottom: '1em' }} className="col-lg-4 col-md-4 col-sm-6 col-6"  >
                                <div onClick={goClientes} className="card border border-primary card-flyer pointer">
                                    <img style={{ width: '10em', height: '10em', marginTop: '1em' }} src={logoClientes} className="card-img-top img-fluid centerImg" alt="" />
                                    <div style={{ textAlign: 'center' }} className="card-body">
                                        <h2 className="card-title superTitulo">Clientes</h2>
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginBottom: '1em' }} className="col-lg-4 col-md-4 col-sm-6 col-6"  >
                                <div onClick={goIngresos} className="card border border-primary card-flyer pointer">
                                    <img style={{ width: '10em', height: '10em', marginTop: '1em' }} src={logoIngresos} className="card-img-top img-fluid centerImg" alt="" />
                                    <div style={{ textAlign: 'center' }} className="card-body">
                                        <h2 className="card-title superTitulo">Ingresos</h2>
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginBottom: '1em' }} className="col-lg-4 col-md-4 col-sm-6 col-6"  >
                                <div onClick={goEgresos} className="card border border-primary card-flyer pointer">
                                    <img style={{ width: '12em', height: '10em', marginTop: '1em' }} src={logoEgresos} className="card-img-top img-fluid centerImg" alt="" />
                                    <div style={{ textAlign: 'center' }} className="card-body">
                                        <h2 className="card-title superTitulo">Gastos</h2>
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginBottom: '1em' }} className="col-lg-4 col-md-4 col-sm-6 col-6"  >
                                <div onClick={goProviders} className="card border border-primary card-flyer pointer">
                                    <img style={{ width: '12em', height: '10em', marginTop: '1em' }} src={logoProviders} className="card-img-top img-fluid centerImg" alt="" />
                                    <div style={{ textAlign: 'center' }} className="card-body">
                                        <h2 className="card-title superTitulo">Proveedores</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-6 col-6"  >
                                <div onClick={goInformes} className="card border border-primary card-flyer pointer">
                                    <img style={{ width: '12em', height: '10em', marginTop: '1em' }} src={logoInformes} className="card-img-top img-fluid centerImg" alt="" />
                                    <div style={{ textAlign: 'center' }} className="card-body">
                                        <h2 className="card-title superTitulo">Informes</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
