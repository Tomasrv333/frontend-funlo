import { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const UserContext = createContext();

// Proveedor del contexto
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(''); // Inicialmente vacío

  useEffect(() => {
    // Leer el ID del usuario desde localStorage al iniciar
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []); // Se ejecuta solo una vez al montar el componente

  useEffect(() => {
    // Guardar el ID del usuario en localStorage cuando cambie
    if (userId) {
      localStorage.setItem('userId', userId);
    }
  }, [userId]);

  const login = (id) => {
    setUserId(id); // Establece el ID del usuario
  };

  const logout = () => {
    setUserId(''); // Limpia el ID del usuario
    localStorage.removeItem('userId'); // Limpia el ID del localStorage
  };

  return (
    <UserContext.Provider value={{ userId, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto
export const useUser = () => {
  return useContext(UserContext);
};
