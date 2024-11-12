"use client"

import React, { useState, useEffect } from 'react';
import { useUser } from '../../../../../context/userContext';
import Cookies from 'js-cookie';

const Page = () => {
  const { userId } = useUser(); 
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [notification, setNotification] = useState(null); 
  const [editCourse, setEditCourse] = useState(null); // Estado para el curso que se está editando

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true); 
      setCourses([]); 

      const queryParams = new URLSearchParams();
      if (userId) queryParams.append('userId', userId);

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
          setNotification({ message: data.message || 'Error al obtener los cursos', status: data.status });
        }
      } catch (error) {
        console.error('Error al conectar con la API de cursos:', error);
        setNotification({ message: 'Error en la conexión', status: 500 });
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchCourses();
    }
  }, [userId]);

  const handleEditCourse = (course) => {
    setEditCourse(course); // Cargar el curso a editar
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await fetch(`/api/courses/delete/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        window.location.reload();
        setNotification({ message: 'Curso eliminado exitosamente', status: 'success' });
      } else {
        setNotification({ message: data.message || 'Error al eliminar el curso', status: 'error' });
      }
    } catch (error) {
      console.error('Error al eliminar el curso:', error);
      setNotification({ message: 'Error en la conexión', status: 'error' });
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const { title, description, videos, thumbnailUrl, categoryId, areaId } = editCourse;

    try {
      const response = await fetch(`/api/courses/put/${editCourse._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
        body: JSON.stringify({
          title, 
          description, 
          videos, 
          thumbnailUrl, 
          categoryId, 
          areaId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.reload();
        setNotification({ message: 'Curso actualizado correctamente', status: 'success' });
        setEditCourse(null); // Cerrar el formulario de edición
      } else {
        setNotification({ message: data.message || 'Error al actualizar el curso', status: 'error' });
      }
    } catch (error) {
      console.error('Error al actualizar el curso:', error);
      setNotification({ message: 'Error en la conexión', status: 'error' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditCourse({ ...editCourse, [name]: value });
  };

  const handleChangeVideos = (e, index) => {
    const { name, value } = e.target;
    const updatedVideos = [...editCourse.videos];
    updatedVideos[index][name] = value;
    setEditCourse({ ...editCourse, videos: updatedVideos });
  };

  const handleAddVideo = () => {
    setEditCourse({
      ...editCourse,
      videos: [...editCourse.videos, { title: '', url: '' }]
    });
  };  

  const handleDeleteVideo = (index) => {
    setEditCourse({
      ...editCourse,
      videos: editCourse.videos.filter((_, i) => i !== index) // Eliminar el video en la posición index
    });
  };  

  return (
    <div>
      <h1 className='font-bold text-lg text-neutral-700 mb-4'>Mis Cursos</h1>
      {isLoading ? (
        <p>Cargando...</p>
      ) : notification ? (
        <div className={`alert ${notification.status === 'success' ? 'alert-success' : 'alert-error'}`}>{notification.message}</div>
      ) : (
        <ul className=' flex flex-col gap-4'>
          {courses.length === 0 ? (
            <li>No tienes cursos disponibles.</li>
          ) : (
            courses.map(course => (
              <li key={course._id} className='bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200'>
                <div className='flex justify-between items-center'>
                  <div className='flex items-center gap-8'>
                    <img src={course.thumbnailUrl} alt={course.title} className='w-32 h-20 object-cover bg-neutral-300' />
                    <div className='flex flex-col'>
                      <strong>Título:</strong>
                      <p>{course.title}</p>
                    </div>
                    <div className='flex flex-col'>
                      <strong>Videos: </strong>
                      <p>{course.videos.length}</p>
                    </div>
                    <div className='flex flex-col'>
                      <strong>Calificación: </strong>
                      <p>{course.rating || 'No calificado'}</p>
                    </div>
                    <div className='flex flex-col'>
                      <strong>Fecha de creación:</strong>
                      <p> {new Date(course.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 mr-4'>
                    <button className='btn-secondary' onClick={() => handleEditCourse(course)}>Actualizar</button>
                    <button className='btn-secondary' onClick={() => handleDeleteCourse(course._id)}>Eliminar</button>
                  </div>
                </div>
                {editCourse && editCourse._id === course._id && (
                  <div className='p-4'>
                    <h2 className='text-neutral-700 font-semibold mb-2'>Editar Curso</h2>
                    <form onSubmit={handleSubmitEdit}>
                      <div className='flex gap-4'>
                        <div className='w-full flex flex-col'>
                          <label>Título:</label>
                          <input type="text" name="title" value={editCourse.title} onChange={handleChange} />
                        </div>
                        <div className='w-full flex flex-col'>
                          <label>Descripción:</label>
                          <textarea name="description" value={editCourse.description} onChange={handleChange} />
                        </div>
                        <div className='w-full flex flex-col'>
                          <label>Miniatura (URL):</label>
                          <input type="text" name="thumbnailUrl" value={editCourse.thumbnailUrl} onChange={handleChange} />
                        </div>
                      </div>
                      
                      <div className='mt-2'>
                        <label>Videos:</label>
                        {editCourse.videos.map((video, index) => (
                          <div key={index} className='flex gap-4 mb-2'>
                            <input 
                              className='w-full'
                              type="text" 
                              name="title" 
                              placeholder="Título del video" 
                              value={video.title} 
                              onChange={(e) => handleChangeVideos(e, index)} 
                            />
                            <input 
                              className='w-full'
                              type="text" 
                              name="url" 
                              placeholder="URL del video" 
                              value={video.url} 
                              onChange={(e) => handleChangeVideos(e, index)} 
                            />
                            <button className='btn-secondary' type="button" onClick={() => handleDeleteVideo(index)}>Eliminar</button>
                          </div>
                        ))}
                      </div>
                      <div className='flex justify-between mt-4'>
                        <button className='btn-secondary' type="button" onClick={handleAddVideo}>Agregar Video</button>
                        <button className='btn-primary' type="submit">Guardar Cambios</button>
                      </div>
                    </form>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default Page;