import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../navigation/AdminHeader';
import AdminNavBar from '../navigation/AdminNavBar';
// import './AdminLayout.css'; // Подключение стилей

const AdminLayout = () => {
  return (
    <div>
      <AdminHeader />
      <AdminNavBar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
