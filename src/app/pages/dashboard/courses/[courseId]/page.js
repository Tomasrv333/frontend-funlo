"use client"

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import ReactPlayer from 'react-player';
import { useUser } from '../../../../context/userContext.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faHeart, faCalendar, faUser, faCommentDots } from '@fortawesome/free-solid-svg-icons';

const TABS = [
  { key: 'contenido', label: 'Contenido' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'comentarios', label: 'Comentarios' },
];

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
    const [activeTab, setActiveTab] = useState('contenido');
    const commentsRef = useRef(null);

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

    const getVideoThumbnail = (url) => {
        // Extrae miniatura de YouTube si es posible
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
            const id = match ? match[1] : null;
            return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
        }
        return null;
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

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'comentarios' && commentsRef.current) {
            setTimeout(() => commentsRef.current.scrollIntoView({ behavior: 'smooth' }), 100);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            {loading ? (
                <div className="flex justify-center items-center h-64 text-lg text-gray-500">Cargando...</div>
            ) : course ? (
                <div className="flex flex-col gap-8">
                    {/* Header visual */}
                    <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-gray-100">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                {course.title}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                <span className="flex items-center gap-1"><FontAwesomeIcon icon={faUser} className="text-blue-500" /> {course.author}</span>
                                <span className="flex items-center gap-1"><FontAwesomeIcon icon={faCalendar} className="text-blue-300" /> {course.date ? new Date(course.date).toLocaleDateString() : 'Sin fecha'}</span>
                                <span className="flex items-center gap-1"><FontAwesomeIcon icon={faStar} className="text-yellow-400" /> {course.averageRating || 0} / 5</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleToggleFavorite}
                                className={`rounded-full p-3 shadow transition-colors duration-200 bg-white border border-blue-100 hover:bg-blue-50 focus:ring-2 focus:ring-blue-300 relative group ${isFavorite ? 'animate-pulse' : ''}`}
                                title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                            >
                                <FontAwesomeIcon icon={faHeart} className={isFavorite ? 'text-blue-500' : 'text-gray-300'} size="lg" />
                                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">{isFavorite ? 'Favorito' : 'Favorito'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Video principal y playlist */}
                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Frame principal */}
                            <div className="flex-1 min-w-0">
                                <div className="w-full rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center mb-4" style={{ minHeight: '360px', aspectRatio: '16/9' }}>
                                    {selectedVideo && selectedVideo.url ? (
                                        <ReactPlayer url={selectedVideo.url} width="100%" height="100%" controls style={{ borderRadius: '0.75rem', minHeight: '360px', maxHeight: '60vh' }} />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center w-full h-full">
                                            <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
                                                <rect width="64" height="64" rx="12" fill="#e0e7ff" />
                                                <path d="M24 44V20l20 12-20 12z" fill="#6366f1" />
                                            </svg>
                                            <span className="text-gray-400 mt-2">No hay video seleccionado</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Playlist visual */}
                            {course.videos && course.videos.length > 1 && (
                                <div className="w-full md:w-64 flex-shrink-0">
                                    <h3 className="font-semibold text-md mb-2 text-gray-700">Lista de reproducción</h3>
                                    <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0">
                                        {course.videos.map((video, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleVideoSelect(video)}
                                                className={`flex items-center gap-3 p-2 rounded-lg border transition-colors duration-150 text-left min-w-[180px] md:min-w-0 w-full md:w-full ${selectedVideo && selectedVideo.url === video.url ? 'bg-blue-100 border-blue-400 text-blue-700 font-semibold' : 'bg-white border-gray-200 hover:bg-blue-50 text-gray-700'}`}
                                                style={{ maxWidth: '100%' }}
                                            >
                                                {getVideoThumbnail(video.url) ? (
                                                    <img src={getVideoThumbnail(video.url)} alt={video.title || `Video ${idx + 1}`} className="w-12 h-8 object-cover rounded" />
                                                ) : (
                                                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">Sin miniatura</div>
                                                )}
                                                <div className="flex flex-col items-start overflow-hidden">
                                                    <span className="text-xs text-gray-500">Video {idx + 1}</span>
                                                    <span className="truncate max-w-[100px] md:max-w-[120px]">{video.title || `Video ${idx + 1}`}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Descripción */}
                        <div className="mb-6">
                            <h2 className="font-semibold text-lg mb-2">Descripción</h2>
                            <p className="text-gray-700">{course.description}</p>
                        </div>

                        {/* Calificación */}
                        <div className="mb-6">
                            <h2 className="font-semibold text-lg mb-2">Califica este curso</h2>
                            <div className="flex items-center gap-2">
                                {renderStars()}
                                {notification && (
                                    <span className={`ml-4 text-sm ${notification.status === 200 ? 'text-green-500' : 'text-red-500'}`}>{notification.message}</span>
                                )}
                            </div>
                        </div>

                        {/* Comentarios */}
                        <div>
                            <h2 className="font-semibold text-lg mb-2 flex items-center gap-2"><FontAwesomeIcon icon={faCommentDots} className="text-blue-400" /> Comentarios</h2>
                            <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                    placeholder="Escribe tu comentario..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Comentar</button>
                            </form>
                            {course.comments && course.comments.length > 0 ? (
                                <div className="space-y-4">
                                    {course.comments.map((comment, idx) => (
                                        <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-100 animate-fade-in-up">
                                            <div className="text-sm text-gray-700 mb-1 font-semibold">{comment.userName || 'Usuario'}</div>
                                            <div className="text-gray-600 text-sm">{comment.comment}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-gray-400">No hay comentarios.</div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center h-64 text-lg text-gray-500">No se encontró el curso.</div>
            )}
        </div>
    );
};

export default CourseDetail;