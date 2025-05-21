import { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const UserContext = createContext();

// Proveedor del contexto
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Leer el ID del usuario desde localStorage al iniciar
    const storedUserId = localStorage.getItem('userId');
    console.log('[UserContext] userId en localStorage al montar:', storedUserId);
    if (storedUserId) {
      setUserId(storedUserId);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Guardar el ID del usuario en localStorage cuando cambie
    console.log('[UserContext] userId actualizado:', userId);
    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
  }, [userId]);

  const login = (id) => {
    console.log('[UserContext] login llamado con id:', id);
    if (!id) {
      console.error('[UserContext] Intento de login con id undefined o null');
      return;
    }
    setUserId(id.toString()); // Asegurarnos de que sea string
  };

  const logout = () => {
    console.log('[UserContext] logout llamado');
    setUserId(null);
    localStorage.removeItem('userId');
  };

  const value = {
    userId,
    login,
    logout,
    loading
  };

  console.log('[UserContext] Valor actual del contexto:', value);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser debe ser usado dentro de un UserProvider');
  }
  return context;
};
