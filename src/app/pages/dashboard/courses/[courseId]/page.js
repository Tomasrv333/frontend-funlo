"use client"

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import ReactPlayer from 'react-player';
import { useUser } from '../../../../context/userContext.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faHeart } from '@fortawesome/free-solid-svg-icons';

const CourseDetail = ({ params }) => {
    const { userId } = useUser();
    const courseId = params.courseId; // Obtiene el ID del curso de la URL
    const [newComment, setNewComment] = useState('');
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null); // Estado para el video seleccionado
    const [rating, setRating] = useState(0); // Estado para la calificación seleccionada
    const [hoveredRating, setHoveredRating] = useState(0); // Estado para el hover
    const [isFavorite, setIsFavorite] = useState(false);
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`/api/courses/${courseId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                const data = await response.json();
    
                if (response.ok) {
                    setCourse(data.course);
                    setSelectedVideo(data.course.videos[0]);
                    
                    // Verificar si el curso ya está en favoritos
                    setIsFavorite(data.course.isFavorite);  // Este valor se debe enviar desde el backend
                } else {
                    setNotification({ message: data.message || 'Error al obtener el curso', status: data.status });
                }
            } catch (error) {
                console.error('Error al conectar con la API de cursos:', error);
                setNotification({ message: 'Error en la conexión al servidor', status: 500 });
            } finally {
                setLoading(false);
            }
        };
    
        if (courseId) {
            fetchCourse();
        }
    }, [courseId]); 

    const handleVideoSelect = (video) => {
        setSelectedVideo(video);
    };

    const extractYoutubeThumbnail = (url) => {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : '';
    };

    // Función para manejar el hover sobre las estrellas
    const handleHover = (value) => {
        setHoveredRating(value); // Cambiar el valor del hover
    };

    // Función para manejar la selección de la calificación
    const handleRating = async (value) => {
        setRating(value); // Guardar la calificación seleccionada
        try {
            const response = await fetch(`/api/courses/rate/${courseId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ userId, rating: value }),
            });
            const data = await response.json();

            if (response.ok) {
                setNotification({ message: 'Calificación registrada con éxito', status: 200 });
                setCourse((prevCourse) => ({
                    ...prevCourse,
                    averageRating: data.averageRating, // Actualiza el promedio de calificaciones
                }));
                window.location.reload(); // Recargar la página
            } else {
                setNotification({ message: data.message || 'Error al calificar el curso', status: 500 });
            }
        } catch (error) {
            console.error('Error al calificar el curso:', error);
            setNotification({ message: 'Error en la conexión', status: 500 });
        }
    };

    // Función para obtener las estrellas
    const renderStars = () => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    onMouseEnter={() => handleHover(i)} // Cambiar el estado de hover
                    onMouseLeave={() => handleHover(0)} // Resetear el estado de hover
                    onClick={() => handleRating(i)} // Registrar la calificación al hacer click
                    className="cursor-pointer"
                >
                    <FontAwesomeIcon
                        icon={faStar} // Mostrar estrella llena
                        className={i <= (hoveredRating || rating) ? 'text-yellow-400' : 'text-gray-400'} // Cambio de color
                    />
                </span>
            );
        }
        return stars;
    };

    const handleAddComment = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) {
            setNotification({ message: 'El comentario no puede estar vacío', status: 400 });
            return;
        }

        try {
            const response = await fetch(`/api/courses/comments/${courseId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ userId, comment: newComment }),
            });

            const data = await response.json();

            if (response.ok) {
                setCourse((prevCourse) => ({
                    ...prevCourse,
                    comments: data.comments, // Actualizamos los comentarios
                }));
                setNewComment(''); // Limpiar el campo de comentario
                setNotification({ message: 'Comentario agregado exitosamente', status: 200 });
            } else {
                setNotification({ message: data.message || 'Error al agregar el comentario', status: 500 });
            }
        } catch (error) {
            console.error('Error al agregar comentario:', error);
            setNotification({ message: 'Error en la conexión', status: 500 });
        }
    };  

    const handleToggleFavorite = async () => {
        try {
            const response = await fetch(`/api/courses/favorites/${courseId}`, {
                method: isFavorite ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ userId }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setIsFavorite(!isFavorite);  // Cambiar el estado de favorito
                setNotification({ message: isFavorite ? 'Curso eliminado de favoritos' : 'Curso agregado a favoritos', status: 200 });
            } else {
                setNotification({ message: data.message || 'Error al actualizar favorito', status: 500 });
            }
        } catch (error) {
            console.error('Error al agregar/eliminar favorito:', error);
            setNotification({ message: 'Error en la conexión', status: 500 });
        }
    };    

    return (
        <div>
            {loading ? (
                <div>Cargando...</div>
            ) : course ? (
                <div className='flex flex-col gap-4'>
                    <div className='flex justify-between items-center'>
                        <h1 className='font-bold text-lg text-neutral-700'>{course.title}</h1>
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-neutral-700">Favorito:</p>
                            <button className='btn-secondary' onClick={handleToggleFavorite}>
                                <FontAwesomeIcon 
                                    icon={isFavorite ? faHeart : faHeart } 
                                    className={isFavorite ? 'text-yellow-400' : 'text-gray-400'} 
                                />
                            </button>
                        </div>
                    </div>
                    
                    <div className="video-container flex rounded-lg overflow-hidden">
                        {/* Columna de video principal */}
                        <div className="flex-1 bg-[#404040]">
                            {selectedVideo ? (
                                <ReactPlayer
                                    url={selectedVideo.url}
                                    width="100%"
                                    height="50vh"
                                    controls={true}
                                />
                            ) : (
                                <p>No hay video seleccionado</p>
                            )}
                        </div>

                        {/* Columna lateral de lista de videos */}
                        <div className="w-1/3 flex flex-col gap-2 p-4 bg-neutral-200 overflow-y-auto">
                            <p className='font-semibold text-base text-neutral-700'>Contenido</p>
                            {course.videos.map((video, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 bg-neutral-300 rounded overflow-hidden cursor-pointer"
                                    onClick={() => handleVideoSelect(video)}
                                >
                                    <img
                                        src={extractYoutubeThumbnail(video.url)}
                                        alt={video.title}
                                        className="w-24 h-16 object-cover"
                                    />
                                    <div>
                                        <p className="text-neutral-600 font-medium">{video.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <p className='font-semibold text-neutral-700 text-lg'>Descripción</p>
                    <p className=''>{course.description}</p>

                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-4'>
                            <p><span className='font-semibold text-neutral-700'>Autor:</span> {course.author}</p>
                            <p><span className='font-semibold text-neutral-700'>Fecha:</span> {new Date(course.date).toLocaleDateString()}</p>
                            <p><span className='font-semibold text-neutral-700'>Calificación:</span> {course.rating} / 5</p>
                        </div>

                        {/* Mostrar estrellas para calificar */}
                        <div className="flex items-center">
                            <p className="font-semibold text-neutral-700 mr-2">Calificar:</p>
                            {renderStars()}
                        </div>
                    </div>

                    {notification && (
                        <div className={`mt-2 ${notification.status === 200 ? 'text-green-500' : 'text-red-500'}`}>
                            {notification.message}
                        </div>
                    )}

                    {/* Sección de comentarios */}
                    <div className="comments-section">
                        <h2 className="font-semibold text-neutral-700 text-lg">Comentarios</h2>
                        {/* Formulario para agregar comentario */}
                        <div className="add-comment my-4">
                            <div className='flex items-end gap-4'>
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Escribe tu comentario..."
                                    className="w-full h-10 p-2 border-b bg-transparent focus:outline-none"
                                />
                                <button 
                                    onClick={handleAddComment}
                                    className="btn-secondary"
                                >
                                    Comentar
                                </button>
                            </div>
                        </div>

                        {course?.comments.length > 0 ? (
                            course.comments.map((comment, index) => (
                                <div key={index} className="flex items-center gap-4 py-2">
                                    <div className='w-12 h-12 rounded-full bg-neutral-300'>

                                    </div>
                                    <div>
                                        <p><span className='font-semibold text-neutral-700'>{comment.author}</span> - {new Date(comment.date).toLocaleDateString()}</p>
                                        <p>{comment.comment}</p>
                                    </div>
                                    
                                </div>
                            ))
                        ) : (
                            <p>No hay comentarios.</p>
                        )}
                    </div>
                </div>
            ) : (
                <div>No se encontró el curso.</div>
            )}
        </div>
    );
};

export default CourseDetail;