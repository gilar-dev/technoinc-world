import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, BrowserRouter } from "react-router-dom";
import './index.css';

// Import local components
import App from './App.jsx';
import CategoryPage from "./components/CategoryPage.jsx";
import ContentPage from './components/ContentPage.jsx';

export const categoryList = [
  "Civilizations",
  "Characters",
  "Ideologies",
  "Organizations",
  "Parties",
  "Towns"
];

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/category/:categoryName", element: <CategoryPage /> },
  { path: "/category/:categoryName/:contentId", element: <ContentPage />}
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);