import { NextResponse } from 'next/server';

export async function GET(req) {
  // Obtiene los parámetros de consulta desde la URL
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name') || ''; // Filtro por nombre de curso
  const userId = searchParams.get('userId') || '';
  const favoritesOnly = searchParams.get('favoritesOnly') || '';
  const areaId = searchParams.get('areaId') || ''; // Filtro por área (padre)
  const categoryId = searchParams.get('categoryId') || ''; // Filtro por categoría (hijo)
  const rating = searchParams.get('rating') || ''; // Filtro por calificación
  const startDate = searchParams.get('startDate') || ''; // Filtro por fecha de inicio
  const endDate = searchParams.get('endDate') || ''; // Filtro por fecha de fin
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Extrae el token del encabezado

  // Construye la URL de la API con los parámetros de consulta
  const apiUrl = `${process.env.API_URL}/courses`;

  const queryParams = new URLSearchParams();

  // Aplica los filtros de búsqueda a los parámetros de consulta
  if (name) queryParams.append('name', name);  // Filtro por nombre de curso
  if (userId) queryParams.append('userId', userId);
  if (favoritesOnly) queryParams.append('favoritesOnly', favoritesOnly);
  if (areaId) queryParams.append('areaId', areaId);  // Filtro por área
  if (categoryId) queryParams.append('categoryId', categoryId);  // Filtro por categoría
  if (rating) queryParams.append('rating', rating);  // Filtro por calificación
  if (startDate) queryParams.append('startDate', startDate);  // Filtro por fecha de inicio
  if (endDate) queryParams.append('endDate', endDate);  // Filtro por fecha de fin

  // Construir la URL de la solicitud
  const requestUrl = `${apiUrl}?${queryParams.toString()}`;

  try {
    // Realiza la solicitud a la API externa de cursos
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),  // Si el token está disponible, lo agregamos al encabezado
      },
    });
  
    // Espera la respuesta JSON de la API externa
    const data = await response.json();
    //console.log(data)
  
    // Si la respuesta es exitosa, devuelve los cursos
    if (response.ok) {
      return NextResponse.json({
        status: 200,
        courses: data || [],  // Si no hay cursos, se retorna un arreglo vacío
      }, { status: 200 });
    } else {
      // Si la respuesta de la API no es exitosa, maneja el error
      return NextResponse.json({
        status: response.status,
        message: data.message || 'Error al obtener los cursos',
      }, { status: response.status });
    }
  } catch (error) {
    console.error('Error al conectar con la API de cursos:', error);
    // Respuesta en caso de error de conexión o cualquier otro error
    return NextResponse.json({
      status: 500,
      message: 'No es posible conectarse con el servidor de cursos.',
    }, { status: 500 });
  }
}