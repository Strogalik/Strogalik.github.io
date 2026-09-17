import { useEffect } from 'react';
import slides from './slides.html?raw';
import './styles.css';

/** Fixed, editable-DOM presentation. ?native=1 preserves the 1920px Figma canvas. */
export default function App() {
  useEffect(() => {
    const resize = () => {
      const native = new URLSearchParams(window.location.search).get('native') === '1';
      document.documentElement.style.setProperty('--deck-scale', String(native ? 1 : Math.min(1, window.innerWidth / 1920)));
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);
  return <main className="deck" aria-label="TMS ASUB. Готовый SaaS. Масштабирование продаж." dangerouslySetInnerHTML={{ __html: slides }} />;
}
