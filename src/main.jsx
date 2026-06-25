// Import functions from react
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Import local components
import App from './App.jsx';
import CategoryPage from "./components/CategoryPage.jsx";
import WikiPage from './components/WikiEditor/WikiPage.jsx';
import ContributionPage from './components/ContributionEditor/ContributionPage.jsx';

// Create root and start rendering the website
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/contribution" element={<ContributionPage />} />
        <Route path="/wiki/:categoryName" element={<CategoryPage />} />
        <Route path="/wiki/:categoryName/:contentId" element={<WikiPage />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);