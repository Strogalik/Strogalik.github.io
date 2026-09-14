import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

function fitPresentation() {
  const native = new URLSearchParams(window.location.search).has('native');
  const scale = native ? 1 : Math.min(1, window.innerWidth / 1920);
  document.documentElement.style.setProperty('--deck-scale', String(scale));
}
fitPresentation();
window.addEventListener('resize', fitPresentation, { passive: true });
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
