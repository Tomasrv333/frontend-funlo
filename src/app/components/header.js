import React from 'react'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  return (
    <div className='flex justify-between items-center bg-primary text-white px-6 py-2'>
        <div className='flex items-center gap-6'>
            <FontAwesomeIcon
                className='cursor-pointer'
                icon={isSidebarOpen ? faTimes : faBars} 
                size='lg' 
                onClick={onToggleSidebar}
            />
            <h1 className='font-bold text-lg'>Funlo</h1>
        </div>
        <input type='text' placeholder='Buscar'></input>
    </div>
  )
}

export default Header