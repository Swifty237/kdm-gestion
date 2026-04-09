import { ReactNode, useLayoutEffect, useState } from 'react';
import Navigation from './Navigation';
import { useLocation } from "react-router-dom";
import NavHeightProvider from '@/context/NavHeightProvider';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [navHeight, setNavHeight] = useState(0);

  const hideNavRoutes = ["/"];
  const shouldHideNav = hideNavRoutes.includes(location.pathname);

  useLayoutEffect(() => {
    // Si la navigation est masquée, on remet la hauteur à 0 et on arrête
    if (shouldHideNav) {
      setNavHeight(0);
      return;
    }

    const nav = document.getElementById('main-nav');
    if (!nav) return;

    const updateHeight = () => setNavHeight(nav.offsetHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(nav);

    return () => observer.disconnect();
  }, [shouldHideNav]); // ← dépendance clé

  return (
    <div className="relative min-h-screen">
      {!shouldHideNav && <Navigation />}
      <main style={{ paddingTop: `${navHeight}px` }}>
        <NavHeightProvider height={navHeight}>
          {children}
        </NavHeightProvider>
      </main>
    </div>
  );
};

export default Layout;