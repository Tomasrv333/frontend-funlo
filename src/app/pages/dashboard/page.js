"use client"

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import CourseCard from '@/app/components/courses/courseCard';
import Cookies from 'js-cookie';

export default function Page() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [filters, setFilters] = useState({
        name: '',
        areaId: '',
        categoryId: '',
        rating: '',
        startDate: null,
        endDate: null,
    });

    // Cargar cursos basado en los filtros
    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            setCourses([]);
            const { name, areaId, categoryId, rating, startDate, endDate } = filters;

            const queryParams = new URLSearchParams();
            if (name) queryParams.append('name', name);
            if (areaId) queryParams.append('areaId', areaId);
            if (categoryId) queryParams.append('categoryId', categoryId);
            if (rating) queryParams.append('rating', rating);
            if (startDate) queryParams.append('startDate', startDate.toISOString());
            if (endDate) queryParams.append('endDate', endDate.toISOString());

            const requestUrl = `/api/courses/get?${queryParams.toString()}`;

            try {
                const response = await fetch(requestUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('token')}`, // Agregar el token si es necesario
                    },
                });

                const data = await response.json();
                setIsLoading(false);
                
                if (response.ok) {
                    setCourses(data.courses || []);
                } else {
                    setNotification({ message: data.message || 'Error al obtener los cursos', status: data.status });
                }
            } catch (error) {
                console.error('Error al conectar con la API de cursos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className='p-6'>
            <div 
                className="bg-primary h-[30vh] rounded-lg mb-8"
                style={{ backgroundImage: `url(/images/bg-dashboard.jpeg)`, backgroundSize: 'cover', backgroundPosition: 'center' }} 
            ></div>
            <div className="flex flex-col">
                <div className='flex gap-6'>
                    
                </div>
                <h1 className='font-semibold text-black text-xl mb-4'>Explora nuevos cursos</h1>
                {/* Lista de cursos filtrados */}
                <div className="courses-list mt-5 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                    {isLoading && <p>Cargando cursos...</p>}
                    {courses.length === 0 && !isLoading && (
                        <p>No hay cursos disponibles que coincidan con los filtros aplicados.</p>
                    )}
                    {courses.map(course => (
                        <div
                            key={course._id}
                            className="cursor-pointer"
                            onClick={() => router.push(`/pages/dashboard/courses/${course._id}`)}
                        >
                            {/* Reemplazamos el contenido por el componente CourseCard */}
                            <CourseCard 
                                title={course.title}
                                author={course.author}
                                rating={course.rating}
                                thumbnailUrl={course.thumbnailUrl}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );  
}