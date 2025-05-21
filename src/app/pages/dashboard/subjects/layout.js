'use client';

import { useState } from 'react';
import Link from 'next/link';
import { faBook, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SubjectsLayout({ children }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <FontAwesomeIcon icon={faBook} className="text-2xl text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Materias Académicas</h1>
            </div>
            <Link
              href="/pages/dashboard/subjects/new"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Nueva Materia
            </Link>
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