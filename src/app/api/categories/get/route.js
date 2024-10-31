import { NextResponse } from 'next/server';

export async function GET(req) {
  // Obtiene los parámetros de consulta desde la URL
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name') || ''; // Puedes usar este parámetro si necesitas filtrar por nombre
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Extrae el token del encabezado

  // Construye la URL de la API con los parámetros de consulta
  const apiUrl = `${process.env.API_URL}/categories`;
  const queryParams = new URLSearchParams();

  if (name) queryParams.append('name', name); // Agrega el nombre a los parámetros de consulta si es necesario

  const requestUrl = `${apiUrl}?${queryParams.toString()}`;

  try {
    console.log(token);

    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Agregar el token si está disponible
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    const data = await response.json();

    if (response.ok) {
      // Responde con los datos de las categorías si la solicitud es exitosa
      return NextResponse.json({
        status: 200,
        categories: data,
      }, { status: 200 });
    } else {
      // Maneja errores de la API de categorías
      return NextResponse.json({
        status: response.status,
        message: data.message || 'Error al obtener las categorías',
      }, { status: response.status });
    }
  } catch (error) {
    console.error('Error al conectar con la API de categorías:', error);
    // Respuesta en caso de error en la conexión o petición
    return NextResponse.json({
      status: 500,
      message: 'No es posible conectarse con el servidor de categorías.',
    }, { status: 500 });
  }
}