// src/components/navigation/SecondaryNavBar.js

import React from 'react';
import { NavLink } from 'react-router-dom';
import './SecondaryNavBar.css';

const SecondaryNavBar = () => {
  return (
    <nav className="secondary-nav-bar">
      <ul>
        <li className="dropdown">
          <span>Статьи и тесты</span>
          <div className="dropdown-content">
            <NavLink to="/add-article">Добавить статью</NavLink>
            <NavLink to="/edit-article">Редактировать статью</NavLink>
          </div>
        </li>
        <li className="dropdown">
          <span>Представители</span>
          <div className="dropdown-content">
            <NavLink to="/add-artist">Добавить представителя</NavLink>
            <NavLink to="/edit-artist">Редактировать представителя</NavLink>
          </div>
        </li>
        <li className="dropdown">
          <span>Статьи представителей</span>
          <div className="dropdown-content">
            <NavLink to="/add-artist-article">Добавить статью</NavLink>
            <NavLink to="/edit-artist-article">Редактировать статью</NavLink>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default SecondaryNavBar;
