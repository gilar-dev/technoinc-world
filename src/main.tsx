// Import functions from react
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Import local components
import App from './App';
import CategoryPage from "./components/CategoryPage";
import WikiPage from './components/WikiEditor/WikiPage';
import ContributionPage from './components/ContributionEditor/ContributionPage';
import ContributionEditPage from './components/ContributionEditor/ContributionEditPage';

// Create root and start rendering the website
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/contribution" element={<ContributionPage />} />
            <Route path="/contribution/edit/:contentId" element={<ContributionEditPage />} />
            <Route path="/wiki/:categoryName" element={<CategoryPage />} />
            <Route path="/wiki/:categoryName/:contentId" element={<WikiPage />} />
            <Route path="*" element={<App />} />
        </Routes>
    </BrowserRouter>
  </StrictMode>
);