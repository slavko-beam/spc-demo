import { createApiClient } from '@spc/api-client';
import { configure } from 'mobx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { createApp } from './app/create.tsx';
import './global.css';

configure({ enforceActions: 'always' });

const App = createApp({
  apiClient: createApiClient(`${window.location.origin}/api`),
  mobileQuery: window.matchMedia('(max-width: 720px)'),
  createDataRouter: createBrowserRouter,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
