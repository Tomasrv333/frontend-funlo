"use client"

import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faComments, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';

export default function Page() {
  const router = useRouter();

  const modules = [
    {
      title: 'Materias',
      description: 'Explora y gestiona todas las materias académicas.',
      icon: faBook,
      color: 'bg-blue-100 text-blue-600',
      href: '/pages/dashboard/subjects',
    },
    {
      title: 'Cursos',
      description: 'Descubre cursos disponibles y accede a su contenido.',
      icon: faChalkboardTeacher,
      color: 'bg-green-100 text-green-600',
      href: '/pages/dashboard/courses',
    },
    {
      title: 'Foros',
      description: 'Participa en foros y debates académicos.',
      icon: faComments,
      color: 'bg-purple-100 text-purple-600',
      href: '/pages/dashboard/forums',
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel Principal</h1>
      <div className="grid gap-8 md:grid-cols-3">
        {modules.map((mod) => (
          <div
            key={mod.title}
            className={`group bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 hover:border-blue-400 transition-all duration-200 p-8 flex flex-col items-center cursor-pointer`}
            onClick={() => router.push(mod.href)}
          >
            <div className={`w-20 h-20 flex items-center justify-center rounded-full mb-4 text-4xl ${mod.color}`}>
              <FontAwesomeIcon icon={mod.icon} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">{mod.title}</h2>
            <p className="text-gray-500 text-center mb-4">{mod.description}</p>
            <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform">Ir a {mod.title} →</span>
          </div>
        ))}
      </div>
    </div>
  );
}