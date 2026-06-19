// Import functions from react
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, BrowserRouter } from "react-router-dom";
import './index.css';

// Import local components
import App from './App.jsx';
import CategoryPage from "./components/CategoryPage.jsx";
import WikiPage from './components/WikiPage.jsx';
import ContributionPage from './components/ContributionPage.jsx';

// Define main category list for the wiki
export const categoryList = [
  "Civilizations",
  "Characters",
  "Ideologies",
  "Organizations",
  "Parties",
  "Towns"
];

// SPA dynamic routes
const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/contribution", element: <ContributionPage /> },
  { path: "/category/:categoryName", element: <CategoryPage /> },
  { path: "/category/:categoryName/:contentId", element: <WikiPage />},
  { path: "*", element: <App /> }
]);

// Create root and start rendering the website
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);