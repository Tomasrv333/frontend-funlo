import { NextResponse } from 'next/server';

export async function DELETE(req, {params}) {
  const courseId = params.id;
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Extrae el token del encabezado

  const apiUrl = `${process.env.API_URL}/courses/${courseId}/delete`;

  try {
    // Enviamos la información a la API del backend
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    const data = await response.json();
    console.log(data)

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