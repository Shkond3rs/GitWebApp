// src/components/common/LoginForm.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import LockIcon from '@mui/icons-material/Lock';
import 'react-toastify/dist/ReactToastify.css';
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('123456');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(email, password);
      navigate('/admin-page');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('Пользователь не найден', { position: "bottom-center", autoClose: 3000 });
      } else if (error.response && error.response.status === 403) {
        toast.error('Доступ запрещен', { position: "bottom-center", autoClose: 3000 });
      } else if (error.response && error.response.status === 401) {
        toast.error('Неверный пароль', { position: "bottom-center", autoClose: 3000 });
      } else {
        toast.error('Ошибка входа. Пожалуйста, попробуйте еще раз.', { position: "bottom-center", autoClose: 3000 });
      }
      console.error('Login failed', error);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="lock-icon">
        <LockIcon />
      </div>

      <h2>Вход</h2>

      <div>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          required
        />
      </div>

      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          required
        />
      </div>

      <button type="submit">Войти</button>
    </form>
  );
};

export default LoginForm;
