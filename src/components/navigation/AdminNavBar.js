// src/components/navigation/AdminNavBar.js

import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminNavBar.css';

const AdminNavBar = () => {
  return (
    <nav className="admin-nav-bar">
      <ul>
        <li>
          <NavLink to="/add-article">Статьи</NavLink>
        </li>
        <li>
          <NavLink to="/add-school">Школы</NavLink>
        </li>
        <li>
          <NavLink to="/users">Пользователи</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavBar;
