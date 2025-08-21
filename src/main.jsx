import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./contexts/CartProvider.jsx";
import { AuthProvider } from "./providers/AuthProvider.jsx";
import { router } from "./Router/Router";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-center" />
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
  </React.StrictMode>
);
