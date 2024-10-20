import React from 'react'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  const router = useRouter();

  function handleLogout() {
    Cookies.remove('token');
    router.push('/pages/login');
  }

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
        <div className='flex items-center gap-4'>
          <input type='text' placeholder='Buscar'></input>
          <button type='button' onClick={handleLogout}>Cerrar sesión</button>
        </div>
    </div>
  )
}

export default Header