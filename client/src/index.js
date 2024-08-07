import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './loading.css';
import App from './App';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
     <React.StrictMode>
       <App />
     </React.StrictMode>
  </AuthProvider>
 
);

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response.status === 401) {
    localStorage.removeItem('token');
    alert('Session invalidated. Please log in again.');
    window.location.href = '/login'; 
  }
  return Promise.reject(error);
});

reportWebVitals();
