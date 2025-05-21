'use client';

import Link from 'next/link';
import { faBook, faGraduationCap, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef } from 'react';

export default function SubjectCard({ subject }) {
  const dragActive = useRef(false);

  const handlePointerDown = () => {
    dragActive.current = false;
  };
  const handleDragStart = () => {
    dragActive.current = true;
  };
  const handleClick = (e) => {
    if (dragActive.current) {
      e.preventDefault();
      dragActive.current = false;
    }
  };

  return (
    <Link 
      href={`/pages/dashboard/subjects/${subject.id}`}
      className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden border border-gray-100 hover:border-blue-400 group"
      onPointerDown={handlePointerDown}
      onDragStart={handleDragStart}
      onClick={handleClick}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <FontAwesomeIcon icon={faBook} className="text-2xl text-blue-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors">
              {subject.nombre}
            </h2>
            <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded mr-2">
              {subject.codigo}
            </span>
            <span className="inline-block bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded">
              {subject.creditos} Créditos
            </span>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <FontAwesomeIcon icon={faBuilding} className="mr-2 text-gray-400" />
          <span className="line-clamp-1">{subject.departamento}</span>
        </div>
        {subject.descripcion && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
            {subject.descripcion}
          </p>
        )}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600 group-hover:text-blue-600 transition-colors">
            <FontAwesomeIcon icon={faGraduationCap} className="mr-2 text-gray-400" />
            <span>Ver detalles</span>
          </div>
          <div className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform">→</div>
        </div>
      </div>
    </Link>
  );
} 