"use client"

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const page = () => {
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useState({
    name: '',
    category: '',
    rating: '',
    startDate: null,
    endDate: null,
  });

  // useEffect(() => {
  //   // Obtener las categorías para el filtro
  //   fetch('/api/categories')
  //     .then(response => response.json())
  //     .then(data => setCategories(data));
  // }, []);

  const handleSearch = () => {
    // const query = new URLSearchParams(searchParams).toString();
    // // Realizar la búsqueda (puedes ajustar según sea necesario)
    // console.log(`Realizar búsqueda con query: ${query}`);
  };

  return (
    <div className="search-bar">
      {/* Input para la búsqueda por nombre */}
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={searchParams.name}
        onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
        className="search-input"
      />

      {/* Etiqueta 'a' con el menú desplegable de filtros */}
      <div className="filter-wrapper">
        <a href="#" className="filter-trigger">Filtros</a>
        <div className="filter-menu">
          <div>
            <label>Categoría:</label>
            <select
              value={searchParams.category}
              onChange={(e) => setSearchParams({ ...searchParams, category: e.target.value })}
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Calificación:</label>
            <select
              value={searchParams.rating}
              onChange={(e) => setSearchParams({ ...searchParams, rating: e.target.value })}
            >
              <option value="">Todas las calificaciones</option>
              <option value="4">4 estrellas y más</option>
              <option value="5">5 estrellas</option>
            </select>
          </div>

          <div>
            <label>Fecha de inicio:</label>
            <DatePicker
              selected={searchParams.startDate}
              onChange={(date) => setSearchParams({ ...searchParams, startDate: date })}
              placeholderText="Selecciona una fecha"
            />
          </div>

          <div>
            <label>Fecha de fin:</label>
            <DatePicker
              selected={searchParams.endDate}
              onChange={(date) => setSearchParams({ ...searchParams, endDate: date })}
              placeholderText="Selecciona una fecha"
            />
          </div>

          <button onClick={handleSearch} className="search-button">Aplicar filtros</button>
        </div>
      </div>
    </div>
  );
}

export default page