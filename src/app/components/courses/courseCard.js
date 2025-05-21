import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen, faUser, faStar } from '@fortawesome/free-solid-svg-icons'

const CourseCard = ({ thumbnailUrl, title, author, rating }) => {
  // Imagen por defecto en caso de no encontrar una URL válida
  const defaultThumbnail = 'https://via.placeholder.com/640x360.png?text=Not+Found';  // URL de la imagen de "Not Found"

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);  // Estrellas completas
    const halfStar = rating % 1 >= 0.5;   // Estrella media
    const emptyStars = 5 - Math.ceil(rating); // Estrellas vacías

    let stars = [];

    // Agregar estrellas completas
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={`full-${i}`} icon={faStar} className="text-yellow-400" />);
    }

    // Agregar estrella media si existe
    if (halfStar) {
      stars.push(<FontAwesomeIcon key="half" icon={faStar} className="text-yellow-400 opacity-50" />);
    }

    // Agregar estrellas vacías
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faStar} className="text-gray-300" />);
    }

    return stars;
  }
  
  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 hover:border-blue-400 transition-all duration-200 overflow-hidden flex flex-col h-full cursor-pointer">
      <div className="relative w-full h-36 bg-blue-50 flex items-center justify-center">
        <img
          src={thumbnailUrl || defaultThumbnail}
          alt={title}
          className="object-cover w-full h-full rounded-t-2xl group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow font-semibold">
          <FontAwesomeIcon icon={faBookOpen} className="mr-1" /> Curso
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h2 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors">{title}</h2>
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <FontAwesomeIcon icon={faUser} className="mr-1 text-blue-400" />
          <span>{author}</span>
        </div>
        <div className="flex items-center mb-2">
          {renderStars(rating)}
        </div>
        <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between text-sm">
          <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform">Ver detalles →</span>
        </div>
      </div>
    </div>
  )
}

export default CourseCard