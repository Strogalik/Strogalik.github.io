import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import './styles/tokens.css';
import './styles/globals.css';
import './styles/shell.css';
import './styles/components.css';
import './styles/pages.css';
import './styles/responsive.css';
import './styles/quality-pass.css';
import './styles/phase-one.css';
import './styles/interaction-pass.css';
import './styles/expansion-pass.css';
import './styles/fuel-pass.css';
import './styles/driver-pass.css';
import './styles/directory-fuel-pass.css';
import './styles/final-pass.css';
import './styles/interaction-v2.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
