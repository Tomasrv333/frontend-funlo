"use client"

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Cookies from 'js-cookie';
import CourseCard from '../../../components/courses/courseCard';

const CoursesPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', status: null });
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({
      name: '',
      categoryId: '',
      rating: '',
      startDate: null,
      endDate: null
  });

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      const token = Cookies.get('token');

      try {
        const response = await fetch('/api/categories/get', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }) // Solo agrega el token si existe
          },
        });

        const data = await response.json();

        if (response.ok) {
          setCategories(data.categories.categories || []);
        } else {
          setNotification({ message: data.message || 'Error al obtener las categorías', status: data.status });
        }
      } catch (error) {
        console.error('Error al conectar con la API de categorías:', error);
        setNotification({ message: 'Error en la conexión al servidor', status: 500 });
      }
    };

    fetchCategories();
  }, []);

  // Cargar cursos basado en los filtros
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      const { name, categoryId, rating, startDate, endDate } = filters;

      const queryParams = new URLSearchParams();
      if (name) queryParams.append('name', name);
      if (categoryId) queryParams.append('category', categoryId);
      if (rating) queryParams.append('rating', rating);
      if (startDate) queryParams.append('startDate', startDate.toISOString());
      if (endDate) queryParams.append('endDate', endDate.toISOString());

      const requestUrl = `/api/courses/get?${queryParams.toString()}`;

      try {
          const response = await fetch(requestUrl, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${Cookies.get('token')}` // Agregar el token si es necesario
              }
          });

          const data = await response.json();
          if (response.ok) {
              setCourses(data.courses || []);
          } else {
              setNotification({ message: data.message || 'Error al obtener los cursos', status: data.status });
          }
      } catch (error) {
          console.error('Error al conectar con la API de cursos:', error);
          setNotification({ message: 'Error en la conexión al servidor', status: 500 });
      } finally {
          setIsLoading(false);
      }
    };

    fetchCourses();
  }, [filters]);

    // Manejar cambios en los filtros
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const getYouTubeThumbnail = (url) => {
      // Verifica que la URL no sea undefined o una cadena vacía
      if (!url || typeof url !== 'string') {
          console.error('URL no válida:', url);
          return ''; // Retorna una cadena vacía o una URL de imagen por defecto
      }
  
      const videoId = url.split('v=')[1];
      if (!videoId) {
          console.error('No se pudo obtener el video ID de la URL:', url);
          return ''; // Retorna una cadena vacía o una URL de imagen por defecto
      }
  
      return `https://img.youtube.com/vi/${videoId}/0.jpg`;
  };
  

    return (
        <div className="search-bar">
            {/* Barra de búsqueda con filtros */}
            <div className="filter-wrapper w-full flex justify-between items-end">
                <div className="filter-menu flex items-center gap-3">
                    <div className='w-fit flex flex-col'>
                        <label>Categoría:</label>
                        <select
                            value={filters.categoryId}
                            onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map(category => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className='w-fit flex flex-col'>
                        <label>Calificación:</label>
                        <select
                            value={filters.rating}
                            onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                        >
                            <option value="">Todas las calificaciones</option>
                            <option value="4">4 estrellas y más</option>
                            <option value="5">5 estrellas</option>
                        </select>
                    </div>

                    <div className='w-fit flex flex-col'>
                        <label>Fecha de inicio:</label>
                        <DatePicker
                            selected={filters.startDate}
                            onChange={(date) => setFilters({ ...filters, startDate: date })}
                            placeholderText="Selecciona una fecha"
                        />
                    </div>

                    <div className='w-fit flex flex-col'>
                        <label>Fecha de fin:</label>
                        <DatePicker
                            selected={filters.endDate}
                            onChange={(date) => setFilters({ ...filters, endDate: date })}
                            placeholderText="Selecciona una fecha"
                        />
                    </div>
                </div>
                <button onClick={() => setFilters({ ...filters })} className="btn-secondary">
                    Aplicar filtros
                </button>
            </div>

            {/* Lista de cursos filtrados */}
            <div className="courses-list mt-5 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {isLoading && <p>Cargando cursos...</p>}
                {courses.length === 0 && !isLoading && (
                    <p>No hay cursos disponibles que coincidan con los filtros aplicados.</p>
                )}
                {courses.map(course => (
                    <div
                        key={course._id}
                        className='cursor-pointer'
                        onClick={() => router.push(`/pages/dashboard/courses/${course._id}`)}
                    >
                        {/* Reemplazamos el contenido por el componente CourseCard */}
                        <CourseCard 
                            url={course.url}
                            title={course.title}
                            author={course.author}
                            rating={course.rating}
                        />
                    </div>
                ))}
            </div>

            {notification.message && (
                <div className={`notification ${notification.status === 200 ? 'success' : 'error'}`}>
                    {notification.message}
                </div>
            )}
        </div>
    );
};

export default CoursesPage;
