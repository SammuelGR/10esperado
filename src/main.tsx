import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/i18n';
import '@/styles/globals.css';

import AuthProvider from '@/contexts/AuthContext';
import AppRouterProvider from '@/routes/-RouterProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppRouterProvider />
    </AuthProvider>
  </StrictMode>,
);
