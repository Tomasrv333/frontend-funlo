"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Cookies from 'js-cookie';
import CourseCard from '../../../components/courses/courseCard';
import { useSearchParams } from 'next/navigation';

const CoursesPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ message: '', status: null });
    const [categories, setCategories] = useState([]);
    const [areas, setAreas] = useState([]);
    const [courses, setCourses] = useState([]);
    const [filters, setFilters] = useState({
        name: '',
        areaId: '',
        categoryId: '',
        rating: '',
        startDate: null,
        endDate: null,
    });

    // Leer el parámetro de búsqueda desde la URL y actualizar filtros solo cuando los parámetros estén disponibles
    useEffect(() => {
        const nameParam = searchParams.get('name'); // Obtener el parámetro 'name' desde la URL

        if (nameParam) {
            setFilters((prev) => ({
                ...prev,
                name: nameParam || '',
            }));
        }
    }, [searchParams]);

    // Cargar categorías y áreas desde el mismo endpoint
    useEffect(() => {
        const fetchCategoriesAndAreas = async () => {
            const token = Cookies.get('token');
            try {
                const response = await fetch('/api/categories/get', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'Authorization': `Bearer ${token}` }),
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setAreas(data.areas);
                } else {
                    console.error('Error al obtener categorías y áreas:', data.message);
                }
            } catch (error) {
                console.error('Error al obtener categorías y áreas:', error);
            }
        };

        fetchCategoriesAndAreas();
    }, []);

    // Cargar cursos basado en los filtros
    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            setCourses([]);
            const { name, areaId, categoryId, rating, startDate, endDate } = filters;

            const queryParams = new URLSearchParams();
            if (name) queryParams.append('name', name);
            if (areaId) queryParams.append('areaId', areaId);
            if (categoryId) queryParams.append('categoryId', categoryId);
            if (rating) queryParams.append('rating', rating);
            if (startDate) queryParams.append('startDate', startDate.toISOString());
            if (endDate) queryParams.append('endDate', endDate.toISOString());

            const requestUrl = `/api/courses/get?${queryParams.toString()}`;

            try {
                const response = await fetch(requestUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('token')}`, // Agregar el token si es necesario
                    },
                });

                const data = await response.json();
                
                if (response.ok) {
                    setCourses(data.courses || []);
                } else {
                    setNotification({ message: data.message || 'Error al obtener los cursos', status: data.status });
                }
            } catch (error) {
                console.error('Error al conectar con la API de cursos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, [filters]);

    // Manejar cambios en los filtros
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Actualizar la URL con los filtros seleccionados
        const updatedQuery = new URLSearchParams(filters).toString();
        router.push(`/courses?${updatedQuery}`); // Actualiza la URL en la barra de direcciones
    };

    const filteredCategories = filters.areaId
    ? areas.find((area) => area.id === filters.areaId)?.categories || []
    : [];

    return (
        <div className="search-bar">
            {/* Barra de búsqueda con filtros */}
            <div className="filter-wrapper w-full flex justify-between items-end">
                <div className="filter-menu flex items-center gap-3">
                    {/* Filtro de Área */}
                    <div className="w-fit flex flex-col">
                        <label>Área:</label>
                        <select
                            name="areaId"
                            value={filters.areaId}
                            onChange={handleFilterChange}
                        >
                            <option value="">Todas las áreas</option>
                            {areas.map((area) => (
                                <option key={area.id} value={area.id}>{area.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-fit flex flex-col">
                        <label>Carrera:</label>
                        <select
                            name="categoryId"
                            value={filters.categoryId}
                            onChange={handleFilterChange}
                            disabled={!filters.areaId}
                        >
                            <option value="">Todas las carreras</option>
                            {filteredCategories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro de Calificación */}
                    <div className="w-fit flex flex-col">
                        <label>Calificación:</label>
                        <select
                            name="rating"
                            value={filters.rating}
                            onChange={handleFilterChange}
                        >
                            <option value="">Todas las calificaciones</option>
                            <option value="4">4 estrellas y más</option>
                            <option value="5">5 estrellas</option>
                        </select>
                    </div>

                    {/* Filtro de Fecha de Inicio */}
                    <div className="w-fit flex flex-col">
                        <label>Fecha de inicio:</label>
                        <DatePicker
                            selected={filters.startDate}
                            onChange={(date) => setFilters({ ...filters, startDate: date })}
                            placeholderText="Selecciona una fecha"
                        />
                    </div>

                    {/* Filtro de Fecha de Fin */}
                    <div className="w-fit flex flex-col">
                        <label>Fecha de fin:</label>
                        <DatePicker
                            selected={filters.endDate}
                            onChange={(date) => setFilters({ ...filters, endDate: date })}
                            placeholderText="Selecciona una fecha"
                        />
                    </div>
                </div>

                <button onClick={() => setFilters({ ...filters })} className="btn-secondary">
                    Aplicar filtros
                </button>
            </div>

            {/* Lista de cursos filtrados */}
            <div className="courses-list mt-5 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {isLoading && <p>Cargando cursos...</p>}
                {courses.length === 0 && !isLoading && (
                    <p>No hay cursos disponibles que coincidan con los filtros aplicados.</p>
                )}
                {courses.map(course => (
                    <div
                        key={course._id}
                        className="cursor-pointer"
                        onClick={() => router.push(`/pages/dashboard/courses/${course._id}`)}
                    >
                        {/* Reemplazamos el contenido por el componente CourseCard */}
                        <CourseCard 
                            title={course.title}
                            author={course.author}
                            rating={course.rating}
                            thumbnailUrl={course.thumbnailUrl}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoursesPage;