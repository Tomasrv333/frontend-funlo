'use client';

import { useState, useEffect } from 'react';
import { subjectsApi } from '../../api/subjects';
import Link from 'next/link';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const data = await subjectsApi.getAllSubjects();
      setSubjects(data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar las materias');
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Cargando materias...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Materias Académicas</h1>
        <Link 
          href="/subjects/new" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Nueva Materia
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Link 
            href={`/subjects/${subject.id}`} 
            key={subject.id}
            className="block p-4 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{subject.nombre}</h2>
            <p className="text-gray-600">{subject.codigo}</p>
            <p className="text-gray-600">Créditos: {subject.creditos}</p>
          </Link>
        ))}
      </div>
    </div>
  );
} 