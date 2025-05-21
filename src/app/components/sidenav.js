import Link from 'next/link'
import React from 'react'
import { faHouse, faPlay, faComments, faBook } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const navItems = [
  { href: '/pages/dashboard', icon: faHouse, label: 'Dashboard' },
  { href: '/pages/dashboard/courses', icon: faPlay, label: 'Cursos' },
  { href: '/pages/dashboard/forums', icon: faComments, label: 'Foros' },
  { href: '/pages/dashboard/subjects', icon: faBook, label: 'Materias' },
];

const Sidenav = ({ isOpen }) => {
  return (
    <aside className={`fixed h-full bg-white shadow-md transition-all duration-300 z-30 ${isOpen ? 'w-[16vw] min-w-[220px]' : 'w-0 overflow-hidden'} flex flex-col justify-between rounded-r-xl`}>
      <nav className="flex flex-col py-6 px-2 gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[15px] font-medium text-neutral-700 transition-colors hover:bg-blue-100 hover:text-blue-700 group focus:bg-blue-100 focus:text-blue-700"
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <FontAwesomeIcon icon={item.icon} size="sm" className="transition-colors group-hover:text-blue-600 group-focus:text-blue-600" />
            </span>
            <span className="transition-colors group-hover:text-blue-700 group-focus:text-blue-700">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="px-4 pb-6">
        <div className="text-xs text-neutral-400">© {new Date().getFullYear()} Funlo</div>
      </div>
    </aside>
  )
}

export default Sidenav