import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Guest({ children, globalVars }) {

    useEffect(() => {
       getImgLogo()
    }, [])

    function getImgLogo() {
        let img = ''
        if (globalVars.info == null || globalVars.info=='') {
            img = globalVars.myUrl + 'Images/Config/noPreview.jpg'
        }else{
            if(globalVars.info.logo== null){
                img = globalVars.myUrl + 'Images/Config/noPreview.jpg'
            }else{
                img = globalVars.myUrl + 'Images/Products/'+ globalVars.info.logo
            }   
        }
        document.getElementById('logo').src = img
    }
    
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
            <div className=" sm:max-w-md mt-6 px-6 py-4 shadow-md overflow-hidden sm:rounded-lg" >
                <Link href="/">
                    <img id='logo' style={{ width: '10em', height: '10em', marginTop: '1em' }} className="img-fluid rounded" alt="" />
                </Link>
            </div>
            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-gray-100 shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
