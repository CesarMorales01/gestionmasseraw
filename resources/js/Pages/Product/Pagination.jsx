import React from 'react';
import { Link } from '@inertiajs/react';
export default function Pagination({ links }) {

    function getClassName(active) {
        if (active) {
            return "mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-gray focus:border-primary focus:text-primary bg-blue-700 text-white";
        } else {
            return "mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-primary focus:text-primary";
        }
    }

    function validarNumero(link){
        if(isNaN(link)){
           return ''
        }else{
          return link
        }
    }

    return (
        links.length > 3 && (
            <div className="mb-4">
                <div className="flex flex-wrap mt-8">
                    {links.map((link, key) => (
                        link.url === null ?
                            (<div key={key}
                                className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded"
                                style={{ display: validarNumero(link.label)!='' ? 'inline' : 'none' }}
                            >{link.label}</div>) :

                            (<Link key={key}
                                className={getClassName(link.active)}
                                href={link.url}
                                style={{ display: validarNumero(link.label)!='' ? 'inline' : 'none' }}
                            >{validarNumero(link.label)}</Link>)
                    ))}
                </div>
            </div>
        )
    );
}