import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const { title, description, videos, creatorId, categoryId, areaId, thumbnailUrl } = body;
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Extrae el token del encabezado

  const apiUrl = `${process.env.API_URL}/courses/new`;

  // Validamos que los videos, si se incluyen, sean un arreglo de objetos
  if (videos && !Array.isArray(videos)) {
    return NextResponse.json({ 
      status: 400, 
      message: 'El campo "videos" debe ser un arreglo de objetos' 
    }, { status: 400 });
  }

  // Validamos cada video para asegurarnos que tenga una URL de YouTube válida
  if (videos) {
    for (const video of videos) {
      if (!video.title || !video.url || !/^https?:\/\/(?:www\.)?youtube\.com\/.+$/.test(video.url)) {
        return NextResponse.json({
          status: 400,
          message: 'URL del video no válida en el arreglo de videos',
        }, { status: 400 });
      }
    }
  }

  try {
    // Enviamos la información a la API del backend
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({
        title,
        description,
        videos, // Incluimos los videos
        creatorId,
        categoryId,
        areaId, // Incluimos el área
        thumbnailUrl, // Incluimos la miniatura
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