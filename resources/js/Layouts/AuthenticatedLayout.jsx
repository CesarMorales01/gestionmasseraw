import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import React, { useState, useEffect } from 'react'

export default function Authenticated({ user, header, children, globalVars }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false)

    return (
        <div className="min-h-screen bg-gray-100">
            <nav style={{ backgroundColor: '#b7723d' }} >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <a className='superTitulo tamañoLetraNav inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150' href={route('dashboard')} style={{ cursor: 'pointer' }} > <i style={{ marginRight: '0.2em' }} className="fas fa-home fa-1x"></i>Home</a>
                            </div>
                            <div className="hidden space-x-8 md:-my-px md:ml-10 md:flex">
                                <NavLink href={route('product.index')} active={route().current('product.index')}>
                                    Productos
                                </NavLink>
                                <NavLink href={route('promo.index')} active={route().current('promo.index')}>
                                    Promociones
                                </NavLink>
                                <NavLink href={route('shopping.index')} active={route().current('shopping.index')}>
                                    Ventas
                                </NavLink>
                                <NavLink href={route('customer.list', 'nothing')} active={route().current('customer.list')}>
                                    Clientes
                                </NavLink>
                                <NavLink href={route('question.index')} active={route().current('question.index')}>
                                    Preguntas
                                </NavLink>
                                <NavLink href={route('income.list', 'nothing')} active={route().current('income.list')}>
                                    Ingresos
                                </NavLink>
                                <div className="hidden md:flex md:items-center md:ml-6">
                                    <div className="ml-3 relative">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button style={{ fontSize: '1.2em' }} type="button" className="inline-flex items-center px-3 py-2 leading-4 font-medium rounded-md text-black hover:text-gray-700 focus:outline-none transition ease-in-out duration-150" >
                                                        Egresos
                                                        <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" >
                                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>
                                            <Dropdown.Content>
                                                <Dropdown.Link href={route('spend.list', 'nothing')} active={route().current('spend.list')}>Gastos</Dropdown.Link>
                                                <Dropdown.Link href={route('provider.list', 'nothing')} active={route().current('provider.list')}>Proveedores</Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>
                                <NavLink href={route('report.list', 'nothing')} active={route().current('report.list')}>
                                    Informes
                                </NavLink>
                            </div>
                        </div>
                        <div className="hidden md:flex md:items-center md:ml-6">
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button type="button" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150" >
                                                {user.name}
                                                <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('setting.index')}>Configuraciones</Dropdown.Link>
                                        <Dropdown.Link href={route('profile.edit')}>Cuenta</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Salir
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center md:hidden">
                            <button style={{ backgroundColor: 'white' }}
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ marginLeft: '0.5em' }} className={(showingNavigationDropdown ? 'block' : 'hidden') + ' md:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <NavLink href={route('product.index')} active={route().current('product.index')}>
                            Productos
                        </NavLink>
                    </div>
                    <div className="pt-2 pb-3 space-y-1">
                        <NavLink href={route('promo.index')} active={route().current('promo.index')}>
                            Promociones
                        </NavLink>
                    </div>
                    <div className="pt-2 pb-3 space-y-1">
                        <NavLink href={route('shopping.index')} active={route().current('shopping.index')}>
                            Ventas
                        </NavLink>
                    </div>
                    <div className="pt-2 pb-3 space-y-1">
                        <NavLink href={route('customer.list', 'nothing')} active={route().current('customer.list')}>
                            Clientes
                        </NavLink>
                    </div>
                    <div className="pt-2 pb-3 space-y-1">
                        <NavLink href={route('question.index')} active={route().current('question.index')}>
                            Preguntas
                        </NavLink>
                    </div>
                    <div className="pt-2 pb-3 space-y-1">
                        <NavLink href={route('income.list', 'nothing')} active={route().current('income.list')}>
                            Ingresos
                        </NavLink>
                    </div>
                    <div className="pt-2 pb-3 space-y-1">
                        <NavLink href={route('spend.list', 'nothing')} active={route().current('spend.list')}>
                            Gastos
                        </NavLink>
                    </div>
                    <div className="pt-2 pb-3 space-y-1">
                        <NavLink href={route('provider.list', 'nothing')} active={route().current('provider.list')}>
                            Proveedores
                        </NavLink>
                    </div>
                    <div className="pt-2 pb-3 space-y-1">
                        <NavLink href={route('report.list', 'nothing')} active={route().current('report.list')}>
                            Informes
                        </NavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <span className="inline-flex rounded-md">
                                    <button
                                        type="button"
                                        className="tamañoLetraNav inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                    >
                                        {user.name}

                                        <svg
                                            className="ml-2 -mr-0.5 h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </span>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route('setting.index')}>Configuraciones</Dropdown.Link>
                                <Dropdown.Link href={route('profile.edit')}>Cuenta</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Salir
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>

        </div>
    );
}
