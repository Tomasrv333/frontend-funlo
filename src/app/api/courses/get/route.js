import { NextResponse } from 'next/server';
import Cookies from 'js-cookie'; // Asegúrate de instalar el paquete `cookies`

export async function GET(req) {
  // Obtiene los parámetros de consulta desde la URL
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name') || '';
  const categoryId = searchParams.get('category') || '';
  const rating = searchParams.get('rating') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Extrae el token del encabezado

  // Construye la URL de la API con los parámetros de consulta
  const apiUrl = `${process.env.API_URL}/courses`;
  const queryParams = new URLSearchParams();

  if (name) queryParams.append('title', name);
  if (categoryId) queryParams.append('categoryId', categoryId);
  if (rating) queryParams.append('rating', rating);
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);

  const requestUrl = `${apiUrl}?${queryParams.toString()}`;

  try {
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
      // Responde con los datos de los cursos si la solicitud es exitosa
      return NextResponse.json({
        status: 200,
        courses: data,
      }, { status: 200 });
    } else {
      // Maneja errores de la API de cursos
      return NextResponse.json({
        status: response.status,
        message: data.message || 'Error al obtener los cursos',
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