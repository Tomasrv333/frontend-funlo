"use client"

import Header from '../../components/header';
import SideNav from '../../components/sidenav';
import { useState } from 'react';

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <div className="flex h-screen flex-col md:overflow-hidden">
      <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}/>
      <div className="w-full h-full flex">
        <SideNav isOpen={isSidebarOpen}/>
        <div className={`flex-grow p-6 md:overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'ml-[12vw]' : 'ml-0'}`}>{children}</div>
      </div>
    </div>
  );
}