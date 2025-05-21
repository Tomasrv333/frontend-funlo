"use client";

import { useState, useEffect } from 'react';
import { subjectsApi } from '../../../api/subjects';
import SubjectCard from '../../../components/subjects/SubjectCard';
import SubjectFilters from '../../../components/subjects/SubjectFilters';

export default function SubjectsList() {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      // Cambiar a obtener todas las materias sin estado de usuario
      const data = await subjectsApi.getAllSubjects();
      const processedData = Array.isArray(data) ? data : [];
      processedData.sort((a, b) => {
        if (a.orden !== undefined && b.orden !== undefined) {
          return a.orden - b.orden;
        }
        return 0;
      });
      setSubjects(processedData);
      setFilteredSubjects(processedData);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar las materias: ' + (err.message || 'Error desconocido'));
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    let filtered = [...subjects];
    if (filters.departamento) {
      filtered = filtered.filter(subject => subject.departamento === filters.departamento);
    }
    if (filters.creditos) {
      const [min, max] = filters.creditos.split('-').map(Number);
      filtered = filtered.filter(subject => {
        const creditos = Number(subject.creditos);
        if (max) {
          return creditos >= min && creditos <= max;
        } else {
          return creditos >= min;
        }
      });
    }
    filtered.sort((a, b) => {
      switch (filters.ordenarPor) {
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        case 'codigo':
          return a.codigo.localeCompare(b.codigo);
        case 'creditos':
          return Number(a.creditos) - Number(b.creditos);
        case 'departamento':
          return a.departamento.localeCompare(b.departamento);
        default:
          return 0;
      }
    });
    setFilteredSubjects(filtered);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando materias...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    </div>
  );

  return (
    <div>
      <SubjectFilters onFilterChange={handleFilterChange} />
      {filteredSubjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No hay materias disponibles</div>
          <p className="text-gray-400">Utiliza los filtros para ajustar tu búsqueda o crea una nueva materia.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSubjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  );
}