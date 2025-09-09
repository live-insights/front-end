import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:8090/auth/login', credentials, {
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        validateStatus: () => true,
      }
      );

      if (response.status !== 200) {
        throw new Error(response.data?.message || `Erro: ${response.data} (HTTP: ${response.status})`);
      }

      if (response.data.includes("sucesso")) {
        const loggedInUser = { username: credentials.username };
        setUser(loggedInUser);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        return { success: true, message: response.data };
      } else {
        return { success: false, message: response.data || "Login falhou." };
      }
    } catch (error) {
      return { success: false, message: error.response?.data || error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async ({ username, password }) => {
  try {
    const response = await axios.post(
      'http://localhost:8090/auth/register',
      { username, password },
      {
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        validateStatus: () => true,
      }
    );

    if (response.status !== 200) {
      throw new Error(response.data || `Erro (HTTP: ${response.status})`);
    }

    if (response.data.includes('sucesso')) {
      return { success: true, message: response.data };
    } else {
      return { success: false, message: response.data || 'Erro ao registrar.' };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || error.message || 'Erro desconhecido',
    };
  }
};


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
