import { NextResponse } from 'next/server';

export async function POST(req) {
    const body = await req.json();
    const { username, email, password } = body;

    const apiUrl = `${process.env.API_URL}/users/register`;
    const apiUrlValidation = `${process.env.API_URL}/users/validation`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        // Verifica si el registro fue exitoso
        if (response.ok) {
            const token = data.token;
            
            if (!token) {
                console.error('Token no recibido en la respuesta del registro.');
                return NextResponse.json({ 
                    status: 500, 
                    message: 'No se recibió un token en la respuesta del registro.' 
                }, { status: 500 });
            }

            // Valida el token inmediatamente después de recibirlo
            try {
                const validationResponse = await fetch(apiUrlValidation, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({}),
                });

                const validationData = await validationResponse.json();

                if (validationResponse.ok) {
                    // Devuelve el token y el mensaje de éxito al frontend
                    return NextResponse.json({
                        status: validationData.status,
                        message: validationData.message,
                        token: token, // Retorna el token
                    }, { status: 200 });
                } else {
                    return NextResponse.json({
                        status: validationData.status || 400,
                        message: validationData.message || 'Error al validar el token',
                    }, { status: validationResponse.status });
                }
            } catch (error) {
                console.error('Error en la validación del token:', error);
                return NextResponse.json({
                    status: 500,
                    message: 'Error al validar el token.'
                }, { status: 500 });
            }

        } else {
            return NextResponse.json({ 
                status: 400, 
                message: data.message || 'Error en el registro' 
            }, { status: response.status });
        }
    } catch (error) {
        console.error('Error en la petición de registro:', error);
        return NextResponse.json({ 
            status: 500, 
            message: 'No es posible conectarse con el servidor.' 
        }, { status: 500 });
    }
}