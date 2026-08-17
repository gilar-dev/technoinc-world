// Import functions from react
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Import local components
import App from './App';
import WikiPage from './components/WikiEditor/WikiPage';
import WikiAction from './components/WikiAction/WikiAction';
import ContributionPage from './components/ContributionEditor/ContributionPage';
import ContributionEditPage from './components/ContributionEditor/ContributionEditPage';

// Create root and start rendering the website
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/contribution" element={<ContributionPage />} />
                <Route path="/contribution/edit/:contentID" element={<ContributionEditPage />} />
                <Route path="/wiki/:contentID" element={<WikiPage />} />
                <Route path="/wiki/:contentID/:actionName" element={<WikiAction />} />
                <Route path="*" element={<App />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);