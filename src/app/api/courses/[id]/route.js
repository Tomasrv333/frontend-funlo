// src/app/pages/api/courses/[id].js

import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    const courseId = params.id; // Obtiene el ID del curso desde los parámetros

    // Aquí se debe implementar la lógica para acceder a la API de cursos o base de datos
    const apiUrl = `${process.env.API_URL}/courses/${courseId}`; // Asegúrate de que esta URL sea correcta
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Extrae el token del encabezado

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }), // Agrega el token si está disponible
            },
        });

        const data = await response.json();

        if (response.ok) {
            // Responde con los datos del curso si la solicitud es exitosa
            return NextResponse.json({
                status: 200,
                course: data, // Asumiendo que la API devuelve los datos del curso
            }, { status: 200 });
        } else {
            // Maneja errores de la API de cursos
            return NextResponse.json({
                status: response.status,
                message: data.message || 'Error al obtener el curso',
            }, { status: response.status });
        }
    } catch (error) {
        console.error('Error al conectar con la API de cursos:', error);
        // Respuesta en caso de error en la conexión o petición
        return NextResponse.json({
            status: 500,
            message: 'No es posible conectarse con el servidor de cursos.',
        }, { status: 500 });
    }
}
