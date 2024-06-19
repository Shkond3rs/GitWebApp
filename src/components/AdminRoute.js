// src/components/AdminRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Отображаем индикатор загрузки
  }

  if (!user) {
    return <Navigate to="/" />; // Перенаправление на страницу входа, если пользователь не авторизован
  }

  if (!user.roles || !user.roles.some(role => role.role === "ROLE_ADMIN")) {
    return <Navigate to="/" />; // Перенаправление на страницу входа, если пользователь не администратор
  }

  return children;
};

export default AdminRoute;
