import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import GlobalFunctions from '../services/GlobalFunctions';

export default function Login({ status, canResetPassword, globalVars }) {
    const glob = new GlobalFunctions();
    const [message, setMessage] = useState('')
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        validarRemember()
        return () => {
            reset('password');
        };
    }, []);

    useEffect(() => {
        if (errors.email == 'These credentials do not match our records.') {
            setMessage('Email o contraseña inválidos!')
            loadingOff()
            setTimeout(() => {
                setMessage('')
            }, 5000);
        }
    });

    function validarRemember() {
        if (glob.getCookie('email') != '') {
            setData((valores) => ({
                ...valores,
                email: glob.getCookie('email'),
                password: glob.getCookie('password'),
                remember: true
            }))
        }
    }

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    function loadingOn() {
        document.getElementById('btnLogin').style.display = 'none'
        document.getElementById('btnLoginLoading').style.display = ''
    }

    function loadingOff() {
        document.getElementById('btnLogin').style.display = ''
        document.getElementById('btnLoginLoading').style.display = 'none'
    }

    function goLogin() {
        loadingOn()
        var validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        if (validEmail.test(data.email)) {}else{
            loadingOff()
        }
    }

    return (
        <GuestLayout globalVars={globalVars}>
            <Head title="Log in" />

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <form id='formLogin' onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <span style={{ color: 'red' }}>{message}</span>
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Contraseña" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ml-2 text-sm text-gray-600">Recuerdame</span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-4">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    )}
                    <button onClick={goLogin} id='btnLogin' style={{ backgroundColor: 'green' }} className="ml-4 btn btn-primary" disabled={processing}>
                        Iniciar sesión
                    </button>
                    <button type='button' id='btnLoginLoading' disabled style={{ backgroundColor: 'gray', display: 'none' }} className="ml-4 btn btn-primary">
                        <span style={{ marginRight: '0.2em' }} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Loading...
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
