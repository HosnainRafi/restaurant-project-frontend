import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { CartProvider } from './contexts/CartProvider.jsx';
import { AuthProvider } from './providers/AuthProvider.jsx';
import AppWrapper from './components/AppWrapper';



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <AppWrapper />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
