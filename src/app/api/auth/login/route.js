import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const { email, password } = body;

  const apiUrl = `${process.env.API_URL}/users/login`;
  const apiUrlValidation = `${process.env.API_URL}/users/validate`;

    try {
        const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // 2. Valida el token inmediatamente después de recibirlo
            const token = data.token; // Asumimos que el token viene en la respuesta del login
            const userId = data.userId;

            try {
                const validationResponse = await fetch(apiUrlValidation, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Envía el token como encabezado
                    },
                });

                const validationData = await validationResponse.json();

                if (validationData.status == 200) {
                    // 3. Devuelve el token y el mensaje de éxito al frontend
                    return NextResponse.json({
                        status: validationData.status,
                        message: validationData.message,
                        userId: userId,
                        token: token,
                    }, { status: 200 });
                } else {
                    return NextResponse.json({
                        status: validationData.status,
                        message: validationData.message,
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
                status: data.status,
                message: data.message
            }, { status: response.status });
        }
    } catch (error) {
        return NextResponse.json({ status: 500, message: "No es posible conectarse con el servidor." }, { status: 500 });
    }
}