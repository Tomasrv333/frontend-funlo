import { NextResponse } from 'next/server';

async function handlePost(req, { params }) {
    const courseId = params.id; // Extraemos el ID del curso desde los parámetros de la URL
    const { userId } = await req.json(); // Extraemos el userId del cuerpo de la solicitud
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Extraemos el token de la cabecera Authorization

    const apiUrl = `${process.env.API_URL}/courses/${courseId}/favorites`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
            body: JSON.stringify({ userId }),
        });

        const data = await response.json();

        if (response.ok) {
            return NextResponse.json({
                status: data.status,
                message: data.message,
            }, { status: data.status });
        } else {
            return NextResponse.json({
                status: 500,
                message: data.message || 'Error al agregar a favoritos',
            }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: 'No es posible conectarse con el servidor.',
        }, { status: 500 });
    }
}

async function handleDelete(req, { params }) {
    const courseId = params.courseId; // Extraemos el ID del curso desde los parámetros de la URL
    const { userId } = await req.json(); // Extraemos el userId del cuerpo de la solicitud
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Extraemos el token de la cabecera Authorization

    const apiUrl = `${process.env.API_URL}/courses/${courseId}/favorites`;

    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
            body: JSON.stringify({ userId }),
        });

        const data = await response.json();

        if (response.ok) {
            return NextResponse.json({
                status: data.status,
                message: data.message,
            }, { status: data.status });
        } else {
            return NextResponse.json({
                status: 500,
                message: data.message || 'Error al eliminar de favoritos',
            }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: 'No es posible conectarse con el servidor.',
        }, { status: 500 });
    }
}

// Exportamos explícitamente las funciones para cada método HTTP
export { handlePost as POST, handleDelete as DELETE };