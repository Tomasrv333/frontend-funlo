"use client"

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../../../context/userContext';
import AlertNotification from '../../../../../components/notifications/formNotification';

const page = () => {
    const { userId } = useUser();
    const [notification, setNotification] = useState({ message: '', status: null });
    const [categories, setCategories] = useState([]);
    const token = Cookies.get('token');
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url: '',
        creatorId: userId,
        categoryId: ''
      });
          
      useEffect(() => {
        const fetchCategories = async () => {
    
          try {
            const response = await fetch('/api/categories/get', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }) // Solo agrega el token si existe
              },
            });
    
            const data = await response.json();
    
            if (response.ok) {
              setCategories(data.categories.categories || []);
            } else {
              setNotification({ message: data.message || 'Error al obtener las categorías', status: data.status });
            }
          } catch (error) {
            console.error('Error al conectar con la API de categorías:', error);
            setNotification({ message: 'Error en la conexión al servidor', status: 500 });
          }
        };
    
        fetchCategories();
      }, []);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value, // Actualiza solo el campo correspondiente
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/courses/post', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }) // Solo agrega el token si existe
              },
              body: JSON.stringify(formData),
            });
    
            const data = await response.json();
            
            if (data.status == 200) {
                router.push('/pages/dashboard/courses/upload');
            } else {
                setNotification({message: data.message, status: data.status});
            }
        } catch (error) {
            setNotification({message: error.response?.data?.message || 'Error al crear el curso', status: 500});
        }
      };

  return (
    <div className='w-[30vw] min-w-[400px] flex items-center gap-6 m-auto'>
        <form onSubmit={handleSubmit} className='w-full'>
            <h2 className='font-semibold text-lg text-neutral-700 mb-6'>Llena los siguientes campos:</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Título:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Descripción:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">URL de YouTube:</label>
          <input
            type="text"
            name="url"
            value={formData.url}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 mb-2">Categoría:</label>
            <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full border rounded p-2"
            >
                <option value="">Selecciona una categoría</option>
                {categories.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
                ))}
            </select>
        </div>
        <AlertNotification message={notification.message} status={notification.status} />
        <button
          type="submit"
          className="btn-primary m-auto"
        >
          Crear Curso
        </button>
      </form>
    </div>
  )
}

export default page