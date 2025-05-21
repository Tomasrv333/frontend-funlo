import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

const forums = [];

const ForumsPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FontAwesomeIcon icon={faComments} className="text-blue-600 mr-2" /> Foros
        </h1>
        <a href="/pages/dashboard/forums/new" className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          <span className="mr-2">+ Nuevo Foro</span>
        </a>
      </div>
      {forums.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4">
            <svg width="80" height="80" fill="none" viewBox="0 0 80 80">
              <rect width="80" height="80" rx="16" fill="#e0e7ff" />
              <path d="M24 56V24h32v32H24zm4-4h24V28H28v24zm8-12h8v2h-8v-2z" fill="#6366f1" />
            </svg>
          </div>
          <div className="text-gray-500 text-lg mb-2 font-semibold">No hay foros disponibles</div>
          <p className="text-gray-400 mb-6">Crea un nuevo foro para iniciar una conversación.</p>
          <a href="/pages/dashboard/forums/new" className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            <span className="mr-2">+ Nuevo Foro</span>
          </a>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Aquí irían las tarjetas de foros */}
        </div>
      )}
    </div>
  );
};

export default ForumsPage;