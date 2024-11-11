import { NextResponse } from 'next/server';

// Definir el endpoint GET para obtener categorías y áreas
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name') || '';
  const token = req.headers.get('Authorization')?.split(' ')[1];

  const apiUrl = `${process.env.API_URL}/categories`;
  const queryParams = new URLSearchParams();

  if (name) {
    queryParams.append('name', name);
  }

  const requestUrl = `${apiUrl}?${queryParams.toString()}`;

  try {
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    const data = await response.json();
    if (response.ok) {
      const areas = data.data
        .filter((item) => item.type === 'area')
        .map((area) => ({
          id: area._id,
          name: area.name,
          categories: area.subcategories.map((category) => ({
            id: category._id,
            name: category.name,
          })),
        }));

      return NextResponse.json({
        status: 200,
        areas,
      }, { status: 200 });
    } else {
      return NextResponse.json({
        status: response.status,
        message: data.message || 'Error al obtener las categorías y áreas',
      }, { status: response.status });
    }
  } catch (error) {
    console.error('Error al conectar con la API de categorías y áreas:', error);
    return NextResponse.json({
      status: 500,
      message: 'No es posible conectarse con el servidor de categorías y áreas.',
    }, { status: 500 });
  }
}