import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

import AddArticlePage from './pages/AddArticlePage';
import EditArticlePage from './pages/EditArticlePage';

import AddArtistPage from './pages/AddArtistPage';
import EditArtistPage from './pages/EditArtistPage';

import AddArtistArticlePage from './pages/AddArtistArticlePage';
import EditArtistArticlePage from './pages/EditArtistArticlePage';

import AddSchoolPage from './pages/AddSchoolPage';
// import EditArtistArticlePage from './pages/EditArtistArticlePage';

import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/layout/AdminLayout';
import RoleChangerPage from './pages/RoleChangerPage';

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LoginPage />} /> {/* Стартовая страница */}
          
          {/* Защищенные маршруты для администратора */}
          <Route element={<AdminLayout />}>
            <Route path="/admin-page" element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            } />
            <Route path="/add-article" element={
              <AdminRoute>
                <AddArticlePage />
              </AdminRoute>
            } />
            <Route path="/edit-article" element={
              <AdminRoute>
                <EditArticlePage />
              </AdminRoute>
            } />
            <Route path="/add-artist" element={
              <AdminRoute>
                <AddArtistPage />
              </AdminRoute>
            } />
            <Route path="/edit-artist" element={
              <AdminRoute>
                <EditArtistPage />
              </AdminRoute>
            } />
            <Route path="/add-artist-article" element={
              <AdminRoute>
                <AddArtistArticlePage />
              </AdminRoute>
            } />
            <Route path="/edit-artist-article" element={
              <AdminRoute>
                <EditArtistArticlePage />
              </AdminRoute>
            } />
            <Route path="/add-school" element={
              <AdminRoute>
                <AddSchoolPage />
              </AdminRoute>
            } />
            <Route path="/edit-school" element={
              <AdminRoute>
                <div>Редактировать школу</div>
              </AdminRoute>
            } />
            <Route path="/users" element={
              <AdminRoute>
                <RoleChangerPage />
              </AdminRoute>
            } />
          </Route>
        </Routes>
        <ToastContainer />
      </div>
    </AuthProvider>
  );
}

export default App;
