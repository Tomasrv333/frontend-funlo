"use client";

import { useState } from "react";
import SubjectsKanban from "./kanban";
import SubjectsList from "./list";

export default function SubjectsTabsPage() {
  const [tab, setTab] = useState("kanban");
  return (
    <div className="py-8">
      <div className="flex gap-2 mb-8">
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 ${tab === 'kanban' ? 'bg-blue-600 text-white shadow' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
          onClick={() => setTab("kanban")}
        >
          Tablero Kanban
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 ${tab === 'list' ? 'bg-blue-600 text-white shadow' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
          onClick={() => setTab("list")}
        >
          Listado
        </button>
      </div>
      {tab === "kanban" && <SubjectsKanban />}
      {tab === "list" && <SubjectsList />}
    </div>
  );
} 