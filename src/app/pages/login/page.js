"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AlertNotification from '../../components/notifications/formNotification';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState({ message: '', status: null });
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        })

        const data = await response.json();

        if (data.status == 200) {
            document.cookie = data.token;
            router.push('/pages/dashboard');
        } else {
            setNotification({ message: data.message, status: data.status });
        }
    }

    return (
        <div className='flex w-full h-full justify-center items-center bg-white'>
            <div className="flex flex-col sm:w-[450px] h-fit bg-white rounded-lg p-8 gap-4 border border-gray">
                <AlertNotification message={notification.message} status={notification.status} />
                <h2 className='text-lg font-semibold text-primary'>Funlo</h2>
                <h1 className='text-3xl font-bold text-black'>Inicia sesión</h1>
                <form onSubmit={handleLogin} className='flex flex-col gap-3'>
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
                    <a className='mx-auto'>Olvidaste tu contraseña?</a>
                    <button type="submit">Login</button>
                </form>
                <p className='mx-auto'>Aún no tienes cuenta? <Link href="../pages/register" className='text-primary underline cursor-pointer'>Registrate</Link></p>
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
    );
}