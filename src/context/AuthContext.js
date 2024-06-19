// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = "http://localhost:8080";
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Добавляем состояние загрузки

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      } else if (token) {
        try {
          const response = await axios.get(`${BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
          console.error(error);
        }
      }
      setLoading(false); // Устанавливаем загрузку в false после завершения
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const response = await axios.post(`${BASE_URL}/auth/sign-in?isWeb=true`, { email, password });
    localStorage.setItem('token', response.data.token);
    const userResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `${response.data.token}`
      }
    });
    setUser(userResponse.data);
    localStorage.setItem('user', JSON.stringify(userResponse.data));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
