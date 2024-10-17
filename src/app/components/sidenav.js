import Link from 'next/link'
import React from 'react'
import { faHouse, faPlay, faComments } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Sidenav = ({ isOpen }) => {
  return (
    <div className={`fixed h-full bg-white text-black border-r border-gray transition-all duration-300 ${isOpen ? 'w-[12vw]' : 'w-0 overflow-hidden'}`}>
      <div className={`flex flex-col p-3 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        <Link 
          href="/pages/dashboard" 
          className='flex items-center px-3 py-2 hover:bg-primary hover:text-white rounded-lg gap-3'
        >
          <div className='w-5 flex justify-center items-center'>
            <FontAwesomeIcon icon={faHouse} size='lg'/>
          </div>
          Dashboard
        </Link>
        <Link 
          href="/pages/dashboard/courses"
          className='flex items-center px-3 py-2 hover:bg-primary hover:text-white rounded-lg gap-3'
        >
          <div className='w-5 flex justify-center items-center'>
            <FontAwesomeIcon icon={faPlay} size='lg'/>
          </div>
          Cursos
        </Link>
        <Link 
          href="/pages/dashboard/forums"
          className='flex items-center px-3 py-2 hover:bg-primary hover:text-white rounded-lg gap-3'
        >
          <div className='w-5 flex justify-center items-center'>
            <FontAwesomeIcon icon={faComments} size='lg'/>
          </div>
          Foros
        </Link>
      </div>
    </div>
  )
}

export default Sidenav