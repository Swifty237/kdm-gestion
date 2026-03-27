import { ReactNode, useEffect, useState } from 'react';
import Navigation from './Navigation';
import { useLocation } from "react-router-dom";
import NavHeightProvider from '@/context/NavHeightProvider';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const updateNavHeight = () => {
      const nav = document.getElementById('main-nav');
      if (nav) {
        setNavHeight(nav.offsetHeight);
      }
    };

    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);

    return () => window.removeEventListener('resize', updateNavHeight);
  }, []);

  const hideNavRoutes = ["/"];
  const shouldHideNav = hideNavRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen">
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