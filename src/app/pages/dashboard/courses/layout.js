"use client"

import Link from 'next/link';
import { faChalkboardTeacher, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname } from 'next/navigation';

const tabs = [
  { name: 'Todos', href: '/pages/dashboard/courses' },
  { name: 'Favoritos', href: '/pages/dashboard/courses?tab=favoritos' },
  { name: 'Mis cursos', href: '/pages/dashboard/courses?tab=mis-cursos' },
];

export default function CoursesLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <FontAwesomeIcon icon={faChalkboardTeacher} className="text-2xl text-green-600" />
              <h1 className="text-2xl font-bold text-gray-800">Cursos</h1>
            </div>
            <Link
              href="/pages/dashboard/courses/new"
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Subir curso
            </Link>
          </div>
          {/* Tabs */}
          <div className="mt-4 flex space-x-4">
            {tabs.map(tab => (
              <Link
                key={tab.name}
                href={tab.href}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${pathname === tab.href.split('?')[0] ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-green-50'}`}
              >
                {tab.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </div>
    </div>
  );
}