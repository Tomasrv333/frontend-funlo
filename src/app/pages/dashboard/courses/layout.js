"use client"

import Header from '../../../components/header';
import { useState } from 'react';

export default function Layout({ children }) {

  return (
    <div className="flex h-screen p-6 flex-col md:overflow-hidden">
      <div>Search bar</div>
      <div className="w-full h-full flex">
        <div className="">{children}</div>
      </div>
    </div>
  );
}