"use client"

import Header from '../../../components/header';
import { useState } from 'react';

export default function Layout({ children }) {

  return (
    <div className="flex h-screen flex-col md:overflow-hidden">
      <div className='flex justify-between items-center px-6 py-4 border-b border-neutral-300 bg-neutral-200'>
        <h1 className='font-semibold text-neutral-700 text-xl'>Cursos</h1>
        <div className='flex gap-4 text-neutral-700 font-semibold'>
          <a href='/pages/dashboard/courses/user/favortie' className=''>Cursos favoritos</a>
          <a href='/pages/dashboard/courses/user/upload' className=''>Mis cursos</a>
          <a href='/pages/dashboard/courses/user/create' className=''>Subir curso</a>
        </div>    
      </div>
      <div className="w-full flex justify-center p-6">
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}