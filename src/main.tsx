import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import '@fontsource-variable/anybody/standard.css';
import '@fontsource-variable/literata/opsz.css';
import '@fontsource-variable/literata/opsz-italic.css';
import './styles/base.css';
import './styles/sections.css';
import './styles/pages.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
