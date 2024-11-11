"use client"

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../../../context/userContext';
import AlertNotification from '../../../../../components/notifications/formNotification';

const CourseForm = () => {
    const { userId } = useUser();
    const router = useRouter();

    const [notification, setNotification] = useState({ message: '', status: null });
    const [areas, setAreas] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videos: [],
        thumbnailUrl: '',
        creatorId: userId,
        categoryId: '',
        areaId: ''
    });
    const token = Cookies.get('token');

    // Cargar áreas y categorías
    useEffect(() => {
      const fetchCategoriesAndAreas = async () => {
        try {
          const response = await fetch('/api/categories/get', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  ...(token && { 'Authorization': `Bearer ${token}` })
              }
          });
          const data = await response.json();
          console.log(data.areas)
          if (response.ok) {
              setAreas(data.areas);
          } else {
              setNotification({ message: 'Error al obtener categorías y áreas', status: response.status });
          }
        } catch (error) {
          console.error('Error al obtener categorías y áreas:', error);
        }
      };
      fetchCategoriesAndAreas();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Gestionar la lista de videos
    const handleAddVideo = () => {
        setFormData({
            ...formData,
            videos: [...formData.videos, { title: '', url: '' }]
        });
    };

    const handleVideoChange = (index, e) => {
        const { name, value } = e.target;
        const newVideos = [...formData.videos];
        newVideos[index][name] = value;
        setFormData({ ...formData, videos: newVideos });
    };

    const handleRemoveVideo = (index) => {
        const newVideos = formData.videos.filter((_, i) => i !== index);
        setFormData({ ...formData, videos: newVideos });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/courses/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.status === 200) {
                router.push('/pages/dashboard/courses/upload');
            } else {
                setNotification({ message: data.message, status: data.status });
            }
        } catch (error) {
            console.error('Error al crear el curso:', error);
            setNotification({ message: 'Error al crear el curso', status: 500 });
        }
    };

    const filteredCategories = formData.areaId
    ? areas.find((area) => area.id === formData.areaId)?.categories || []
    : [];

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
                    <label className="block text-gray-700 mb-2">URL de Miniatura:</label>
                    <input
                        type="text"
                        name="thumbnailUrl"
                        value={formData.thumbnailUrl}
                        onChange={handleChange}
                        required
                        className="w-full border rounded p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Área:</label>
                    <select
                        name="areaId"
                        value={formData.areaId}
                        onChange={handleChange}
                        required
                        className="w-full border rounded p-2"
                    >
                        <option value="">Selecciona un área</option>
                        {areas.map((area) => (
                            <option key={area._id} value={area._id}>{area.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Categoría:</label>
                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        disabled={!formData.areaId}
                        required
                        className="w-full border rounded p-2"
                    >
                      <option value="">Selecciona una categoría</option>
                      {console.log(filteredCategories)}
                      {filteredCategories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                </div>

                {/* Sección de videos */}
                <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Videos:</h3>
                    {formData.videos.map((video, index) => (
                        <div key={index} className="mb-2 border p-2 rounded">
                            <input
                                type="text"
                                name="title"
                                placeholder="Título del video"
                                value={video.title}
                                onChange={(e) => handleVideoChange(index, e)}
                                required
                                className="w-full border rounded p-2 mb-2"
                            />
                            <input
                                type="text"
                                name="url"
                                placeholder="URL de YouTube"
                                value={video.url}
                                onChange={(e) => handleVideoChange(index, e)}
                                required
                                className="w-full border rounded p-2 mb-2"
                            />
                            <button type="button" onClick={() => handleRemoveVideo(index)} className="text-red-500">
                                Eliminar Video
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddVideo} className="text-blue-500">
                        Agregar Video
                    </button>
                </div>

                <AlertNotification message={notification.message} status={notification.status} />
                <button type="submit" className="btn-primary m-auto">Crear Curso</button>
            </form>
        </div>
    );
};

export default CourseForm;