// pages/api/courses/[courseId]/comments.js
import { NextResponse } from 'next/server';

export async function POST(req, {params}) {
    const body = await req.json();
    const { userId, comment } = body;
    const courseId = params.id;
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Extrae el token del encabezado

    const apiUrl = `${process.env.API_URL}/courses/${courseId}/comments`;
    
    try {
        // Enviamos la información a la API del backend
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
          body: JSON.stringify({
            userId,
            comment,
          }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
          return NextResponse.json({
            status: data.status,
            message: data.message,
          }, { status: data.status });
        } else {
          return NextResponse.json({
            status: data.status,
            message: data.message,
          }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ 
          status: 500, 
          message: "No es posible conectarse con el servidor." 
        }, { status: 500 });
    }
}