import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faStarHalfAlt, faStar as faStarRegular } from '@fortawesome/free-solid-svg-icons'

const courseCard = ({ url, title, author, rating }) => {
  // Imagen por defecto en caso de no encontrar una URL válida
  const defaultThumbnail = 'https://via.placeholder.com/640x360.png?text=Not+Found';  // URL de la imagen de "Not Found"

  // Función para extraer el video ID de la URL de YouTube
  const getVideoThumbnailUrl = (videoUrl) => {
    // Comprobar que videoUrl no sea undefined ni vacío
    if (!videoUrl || typeof videoUrl !== 'string') {
      return defaultThumbnail; // Si no se pasa una URL válida, devuelve la imagen por defecto
    }

    // Expresión regular para extraer el ID del video
    const youtubeIdRegex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = videoUrl.match(youtubeIdRegex);
    if (match) {
      // Construir la URL de la miniatura con el ID extraído
      return `https://img.youtube.com/vi/${match[1]}/0.jpg`;
    }

    // Si no se encuentra un ID válido, devuelve la imagen por defecto
    return defaultThumbnail;
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);  // Estrellas completas
    const halfStar = rating % 1 >= 0.5;   // Estrella media
    const emptyStars = 5 - Math.ceil(rating); // Estrellas vacías

    let stars = [];

    // Agregar estrellas completas
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={`full-${i}`} icon={faStar} className="text-yellow-500" />);
    }

    // Agregar estrella media si existe
    if (halfStar) {
      stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} className="text-yellow-500" />);
    }

    // Agregar estrellas vacías
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faStarRegular} className="text-yellow-500" />);
    }

    return stars;
  }

  const thumbnailUrl = getVideoThumbnailUrl(url); // Obtener la URL de la miniatura
  
  return (
    <div className='w-full rounded-lg overflow-hidden border bg-white'>
        <div 
          className='w-full h-36' 
          style={{ backgroundImage: `url(${thumbnailUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} 
        ></div>
        <div className='p-4'>
            <p className='font-semibold text-base text-neutral-700 leading-tight'>{title}</p>
            <span className='text-xs'>{author}</span>
            <p className='flex items-center'>
              {renderStars(rating)} {/* Mostrar las estrellas */}
            </p>
        </div>
    </div>
  )
}

export default courseCard