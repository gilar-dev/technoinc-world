import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, BrowserRouter } from "react-router-dom";
import './index.css';

// Import local components
import App from './App.jsx';
import Category from "./components/Category.jsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path:"/category/:categoryName", element: <Category /> }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);