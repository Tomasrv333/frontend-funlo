'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { subjectsApi } from '../../../../api/subjects';
import Link from 'next/link';

export default function SubjectDetailPage() {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSubject();
  }, [id]);

  const loadSubject = async () => {
    try {
      const data = await subjectsApi.getSubjectById(id);
      setSubject(data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los detalles de la materia');
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Cargando detalles...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!subject) return <div className="p-4">Materia no encontrada</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link 
          href="/pages/dashboard/subjects" 
          className="text-blue-500 hover:text-blue-600"
        >
          ← Volver a la lista
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{subject.nombre}</h1>
        
        <div className="grid gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Código</h2>
            <p className="text-gray-600">{subject.codigo}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700">Créditos</h2>
            <p className="text-gray-600">{subject.creditos}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700">Descripción</h2>
            <p className="text-gray-600">{subject.descripcion}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700">Departamento</h2>
            <p className="text-gray-600">{subject.departamento}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 