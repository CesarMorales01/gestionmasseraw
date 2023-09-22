import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function ForgotPassword({ status, message, email, globalVars }) {

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    useEffect(() => {
        if (status == 'Se ha enviado un correo con la nueva contraseña!') {
            enviaremail()
        }
    });

    function enviaremail() {
        const enlace = globalVars.myUrl + 'mail.php?app=' + globalVars.myUrl + "&to=" + email + "&message=" + message+"&subject=Esta es la nueva clave!"
        fetch(enlace)
            .then((response) => {
                return response.json()
            }).then((json) => {
                console.log(json)
            })
    }

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout globalVars={globalVars}>
            <Head title="Forgot Password" />
            <div className="mb-4 text-sm text-gray-600">
                Olvidaste tu contraseña? No hay problema. Solo dános tu correo electronico y te enviaremos un link para reiniciar la contraseña.
            </div>
            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}
            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ml-4" disabled={processing}>
                        Enviar link de reinicio de contraseña
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}

