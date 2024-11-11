import { NextResponse } from 'next/server';

export async function PUT(req, {params}) {
  const body = await req.json();
  const { title, 
    description, 
    videos, 
    thumbnailUrl, 
    categoryId, 
    areaId, } = body;
  const courseId = params.id;
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Extrae el token del encabezado

  const apiUrl = `${process.env.API_URL}/courses/${courseId}/update`;

  try {
    // Enviamos la información a la API del backend
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({
        title,
        description,
        videos, // Incluimos los videos
        categoryId,
        areaId, // Incluimos el área
        thumbnailUrl, // Incluimos la miniatura
      }),
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