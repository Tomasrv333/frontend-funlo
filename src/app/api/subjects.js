import axios from 'axios';
//import { useUser } from '@context/userContext';

const API_URL = 'http://localhost:8000/api';

export const subjectsApi = {
  // Get all subjects
  getAllSubjects: async () => {
    try {
      console.log('Fetching subjects from:', `${API_URL}/materias`);
      const response = await axios.get(`${API_URL}/materias`);
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      
      // Extraer los datos del objeto anidado
      const subjectsData = response.data.data || response.data;
      console.log('Extracted subjects data:', subjectsData);
      
      // Asegurarnos de que devolvemos un array
      const subjects = Array.isArray(subjectsData) ? subjectsData : [];
      console.log('Processed subjects:', subjects);
      return subjects;
    } catch (error) {
      console.error('Error fetching subjects:', error);
      if (error.response) {
        // La petición fue hecha y el servidor respondió con un código de estado
        // que está fuera del rango 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        console.error('Error request:', error.request);
      } else {
        // Algo paso al preparar la petición que lanzo un Error
        console.error('Error message:', error.message);
      }
      throw error;
    }
  },

  // Get subject by ID
  getSubjectById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/materias/${id}`);
      // Extraer los datos del objeto anidado
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error fetching subject ${id}:`, error);
      throw error;
    }
  },

  // Create new subject
  createSubject: async (subjectData) => {
    try {
      const response = await axios.post(`${API_URL}/materias`, subjectData);
      // Extraer los datos del objeto anidado
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating subject:', error);
      throw error;
    }
  },

  // Update subject state
  updateSubjectState: async (id, nuevo_estado) => {
    try {
      const response = await axios.put(`${API_URL}/materias/${id}/estado`, { nuevo_estado });
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update subject descriptive letter
  updateSubjectCartaDescriptiva: async (id, carta_descriptiva) => {
    try {
      const response = await axios.put(`${API_URL}/materias/${id}/carta-descriptiva`, { carta_descriptiva });
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get subjects by user and state
  getSubjectsByUserAndState: async (userId, estado) => {
    try {
      const response = await axios.get(`${API_URL}/materias/usuario/${userId}/estado/${estado}`);
      const subjectsData = response.data.data || response.data;
      return Array.isArray(subjectsData) ? subjectsData : [];
    } catch (error) {
      throw error;
    }
  },

  // Nuevo: Obtener todas las materias con el estado personalizado para un usuario
  getAllSubjectsWithUserState: async (userId) => {
    try {
      console.log('Llamando a /materias/usuario/' + userId + '/con-estados');
      const response = await axios.get(`${API_URL}/materias/usuario/${userId}/con-estados`);
      // La respuesta es un array de objetos { materia, estado, orden }
      const subjectsData = response.data.data || response.data || [];
      
      // Asegurarnos de que cada materia tenga su orden
      const processedData = subjectsData.map(subject => ({
        ...subject,
        orden: subject.orden || 0 // Si no tiene orden, asignar 0
      }));
      
      // Ordenar por estado y luego por orden
      return processedData.sort((a, b) => {
        if (a.estado !== b.estado) {
          // Ordenar por estado: inactiva -> activa -> completada
          const estadoOrder = { inactiva: 0, activa: 1, completada: 2 };
          return estadoOrder[a.estado] - estadoOrder[b.estado];
        }
        // Si tienen el mismo estado, ordenar por orden
        return a.orden - b.orden;
      });
    } catch (error) {
      console.error('Error fetching subjects with user state:', error);
      throw error;
    }
  },

  // Nuevo: Actualizar el estado de una materia para un usuario
  updateSubjectStateForUser: async (userId, materiaId, nuevo_estado) => {
    try {
      const response = await axios.put(`${API_URL}/materias/usuario/${userId}/materia/${materiaId}/estado`, { nuevo_estado });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Nuevo: Actualizar el orden de las materias para un usuario
  updateSubjectsOrder: async (userId, materiasOrdenadas) => {
    try {
      const response = await axios.put(`${API_URL}/materias/usuario/${userId}/orden`, { materias_ordenadas: materiasOrdenadas });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Initialize user subjects
  initializeUserSubjects: async (userId) => {
    try {
      console.log('Initializing subjects for user:', userId);
      const response = await axios.post(`${API_URL}/materias/usuario/${userId}/inicializar`);
      console.log('Initialization response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error initializing user subjects:', error);
      if (error.response) {
        console.error('Initialization error response:', error.response.data);
        console.error('Initialization error status:', error.response.status);
      }
      throw error;
    }
  },

  // Load user subjects with initialization if needed
  loadUserSubjects: async (userId) => {
    try {
      console.log('Loading subjects for user:', userId);
      // First try to get existing subjects
      const response = await axios.get(`${API_URL}/materias/usuario/${userId}/con-estados`);
      console.log('Raw API Response:', response);
      console.log('Response data:', response.data);
      
      // Ajuste: aceptar array directo o data
      let subjects = [];
      if (Array.isArray(response.data)) {
        subjects = response.data;
      } else if (Array.isArray(response.data.data)) {
        subjects = response.data.data;
      } else {
        subjects = [];
      }
      console.log('Processed subjects:', subjects);
      console.log('Subjects length:', subjects.length);
      
      // If no subjects exist, initialize them
      if (subjects.length === 0) {
        console.log('No subjects found, initializing...');
        await subjectsApi.initializeUserSubjects(userId);
        // Reload subjects after initialization
        const newResponse = await axios.get(`${API_URL}/materias/usuario/${userId}/con-estados`);
        let newSubjects = [];
        if (Array.isArray(newResponse.data)) {
          newSubjects = newResponse.data;
        } else if (Array.isArray(newResponse.data.data)) {
          newSubjects = newResponse.data.data;
        } else {
          newSubjects = [];
        }
        console.log('Response after initialization:', newSubjects);
        return newSubjects;
      }
      
      return subjects;
    } catch (error) {
      console.error('Error loading user subjects:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      throw error;
    }
  },

  // Move subject between states
  moveSubject: async (userId, subjectId, newState) => {
    try {
      const response = await axios.put(
        `${API_URL}/materias/usuario/${userId}/materia/${subjectId}/estado`,
        { nuevo_estado: newState }
      );
      return response.data;
    } catch (error) {
      console.error('Error moving subject:', error);
      throw error;
    }
  },

  // Reorder subjects
  reorderSubjects: async (userId, reorderedSubjects) => {
    try {
      const response = await axios.put(
        `${API_URL}/materias/usuario/${userId}/orden`,
        { materias_ordenadas: reorderedSubjects }
      );
      return response.data;
    } catch (error) {
      console.error('Error reordering subjects:', error);
      throw error;
    }
  },
}; 