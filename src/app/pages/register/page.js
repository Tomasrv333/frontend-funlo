"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import LoaderOverlay from '../../components/loaders/spinnerOverlay';
import AlertNotification from '../../components/notifications/formNotification';

export default function Register() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState({ message: '', status: null });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password })
            })

            const data = await response.json();

            if (data.status == 200) {
                // Guarda el token en una cookie
                Cookies.set('token', data.token, { 
                    expires: 7,
                    secure: true,
                    sameSite: 'strict'
                });

                // Redirigir al dashboard
                router.push('/pages/dashboard');
            } else {
                // Manejar caso de estado distinto a 200 (aunque improbable porque ya validamos el status)
                setIsLoading(false);
                setNotification({ message: data.message, status: data.status });
            }
        } catch {
            setIsLoading(false);
            setNotification({ message: 'No es posible continuar con tu solicitud, intenta de nuevo mas tarde.', status: 500 });
        }
    }

    return (
        <>
            <LoaderOverlay isLoading={isLoading} />
            <div className='flex w-full h-full justify-center items-center bg-white'>
                <div className="flex flex-col sm:w-[450px] h-fit bg-white rounded-lg p-8 gap-4 border border-gray">
                    <AlertNotification message={notification.message} status={notification.status} />
                    <h2 className='text-lg font-semibold text-primary'>Funlo</h2>
                    <h1 className='text-3xl font-bold text-black'>Registrate</h1>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                        <div className='flex flex-col'>
                            <label className='mb-2'>Usuario</label>
                            <input
                                type="text"
                                placeholder="Usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label className='mb-2'>Correo</label>
                            <input
                                type="text"
                                placeholder="Correo electronico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label className='mb-2'>Contraseña</label>
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className='flex gap-3'>
                            <input type='checkbox'></input>
                            <label>Acepto los terminos y condiciones</label>
                        </div>
                        <button type="submit">Registrarse</button>
                    </form>
                    <p className='mx-auto'>Ya tienes una cuenta? <Link href="../pages/login" className='text-primary underline cursor-pointer'>Inicia sesión</Link></p>
                    <div className='flex flex-col gap-4'>
                        <div className='flex items-center gap-2'>
                            <div className='bg-gray w-full h-[1px]'></div>
                            <p className='min-w-fit'>Ingresa con tu correo institucional</p>
                            <div className='bg-gray w-full h-[1px]'></div>
                        </div>
                        
                        <div className='bg-gray h-10 rounded-lg'></div>
                    </div>
                </div>
            </div>
        </>
    );
}