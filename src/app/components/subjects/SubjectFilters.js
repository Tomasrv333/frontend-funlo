'use client';

import { useState } from 'react';
import { faFilter, faTimes, faBuilding, faLayerGroup, faSort } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SubjectFilters({ onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    departamento: '',
    creditos: '',
    ordenarPor: 'nombre'
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${isOpen ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}`}
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faFilter} className="mr-2" />
        {isOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
      </button>

      <div
        className={`transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}
        style={{ background: isOpen ? '#f0f6ff' : 'transparent', borderRadius: '1rem', boxShadow: isOpen ? '0 2px 8px rgba(0,0,0,0.04)' : 'none' }}
      >
        {isOpen && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FontAwesomeIcon icon={faBuilding} className="mr-2 text-blue-400" />
                  Departamento
                </label>
                <select
                  name="departamento"
                  value={filters.departamento}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos los departamentos</option>
                  <option value="Ingeniería">Ingeniería</option>
                  <option value="Ciencias">Ciencias</option>
                  <option value="Humanidades">Humanidades</option>
                  <option value="Medicina">Medicina</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FontAwesomeIcon icon={faLayerGroup} className="mr-2 text-green-400" />
                  Créditos
                </label>
                <select
                  name="creditos"
                  value={filters.creditos}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos los créditos</option>
                  <option value="1-3">1-3 créditos</option>
                  <option value="4-6">4-6 créditos</option>
                  <option value="7-9">7-9 créditos</option>
                  <option value="10+">10+ créditos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FontAwesomeIcon icon={faSort} className="mr-2 text-purple-400" />
                  Ordenar por
                </label>
                <select
                  name="ordenarPor"
                  value={filters.ordenarPor}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="nombre">Nombre</option>
                  <option value="codigo">Código</option>
                  <option value="creditos">Créditos</option>
                  <option value="departamento">Departamento</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 