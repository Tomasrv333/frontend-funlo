import React from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  const router = useRouter();

  function handleLogout() {
    Cookies.remove('token');
    router.push('/pages/login');
  }

  function handleSearchChange(e) {
    const searchQuery = e.target.value;
    router.push(`/pages/dashboard/courses?name=${searchQuery}`); // Redirige a la página de cursos con el nombre de búsqueda
  }

  return (
    <div className="flex justify-between items-center bg-neutral-100 border-b border-neutral-300 text-white px-6 py-2">
      <div className="w-[13.7vw] min-w-[200px] flex items-center justify-between gap-6">
        <h1 className="font-bold text-lg text-neutral-600">Funlo</h1>
        <FontAwesomeIcon
          className="cursor-pointer text-neutral-600 border border-neutral-300 rounded py-2 px-2.5 max-w-8"
          icon={isSidebarOpen ? faTimes : faBars}
          onClick={onToggleSidebar}
        />
      </div>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Buscar"
          onChange={handleSearchChange} // Cambia el valor del campo para filtrar los cursos
        />
        <button type="button" onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </div>
  );
};

export default Header;