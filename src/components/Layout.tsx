import { ReactNode } from 'react';
import Navigation from './Navigation';
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  // Liste des routes où la navigation doit être masquée
  const hideNavRoutes = ["/"];

  const shouldHideNav = hideNavRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col">
      {!shouldHideNav && <Navigation />}  {/* ← caché si on est sur / */}
      <main className="min-h-screen flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;