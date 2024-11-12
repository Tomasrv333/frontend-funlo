"use client"

import React, { useState, useEffect } from 'react';
import { useUser } from '@/app/context/userContext';
import CourseCard from '@/app/components/courses/courseCard';
import Cookies from 'js-cookie';

const Page = () => {
  const { userId } = useUser(); 
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [notification, setNotification] = useState(null); 

  useEffect(() => {
    const fetchFavoriteCourses = async () => {
      setIsLoading(true); 
      setCourses([]); 

      // Construir la URL con los parámetros necesarios para favoritos
      const queryParams = new URLSearchParams();
      if (userId) queryParams.append('userId', userId);
      queryParams.append('favoritesOnly', 'true'); // Parámetro para obtener solo favoritos

      const requestUrl = `/api/courses/get?${queryParams.toString()}`;

      try {
        const response = await fetch(requestUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`, 
          },
        });

        const data = await response.json();
        setIsLoading(false);

        if (response.ok) {
          setCourses(data.courses || []);
        } else {
          setNotification({ message: data.message || 'Error al obtener los cursos favoritos', status: data.status });
        }
      } catch (error) {
        console.error('Error al conectar con la API de cursos:', error);
        setNotification({ message: 'Error en la conexión', status: 500 });
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchFavoriteCourses();
    }
  }, [userId]);

  return (
    <div>
      {isLoading ? (
        <p>Cargando cursos favoritos...</p>
      ) : (
        <div>
          {notification && <p>{notification.message}</p>}
          {courses.length > 0 ? (
            <div className="courses-list mt-5 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {courses.map(course => (
                <div key={course._id} className="cursor-pointer">
                  {/* Usamos el componente CourseCard para mostrar cada curso */}
                  <CourseCard
                    title={course.title}
                    author={course.author}
                    rating={course.rating}
                    thumbnailUrl={course.thumbnailUrl}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p>No tienes cursos favoritos.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;