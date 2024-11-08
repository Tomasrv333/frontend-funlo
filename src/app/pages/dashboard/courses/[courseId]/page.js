"use client"

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import ReactPlayer from 'react-player';

const CourseDetail = ({params}) => {
    const searchParams = useSearchParams();
    const courseId = params.courseId; // Obtiene el ID del curso de la URL
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            const token = Cookies.get('token');
            
            try {
                const response = await fetch(`/api/courses/${courseId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Agrega el token si es necesario
                    }
                });
                const data = await response.json();

                if (response.ok) {
                    setCourse(data.course); // Suponiendo que la API devuelve un objeto con la propiedad 'course'
                } else {
                    setNotification({ message: data.message || 'Error al obtener el curso', status: data.status });
                }
            } catch (error) {
                console.error('Error al conectar con la API de cursos:', error);
                setNotification({ message: 'Error en la conexión al servidor', status: 500 });
            } finally {
                setLoading(false); // Cambia el estado de carga
            }
        };

        if (params) {
            fetchCourse(); // Solo se ejecuta si id está disponible
        }
    }, [params]);

    return (
        <div>
            {notification && <div>{notification.message}</div>}
            {course ? (
                <div className='flex flex-col gap-4'>
                    <h1 className='font-bold text-lg text-neutral-700'>{course.title}</h1>
                    <div className="video-container">
                        <ReactPlayer
                            url={course.url} // Pasa la URL completa del video
                            width="100%"    // Establece el ancho al 100%
                            height="50vh"   // Establece la altura automáticamente
                            controls={true} // Activa los controles del reproductor
                        />
                    </div>
                    <p>{course.description}</p>
                    {/* Muestra más detalles del curso según sea necesario */}
                </div>
            ) : (
                <div>No se encontró el curso.</div>
            )}
        </div>
    );
};

export default CourseDetail;
