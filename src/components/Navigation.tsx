import { LogOut, Menu, NotebookText, UserCog, UserRoundPlus, X } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";


const Navigation = () => {

  const navigate = useNavigate();
  const [hasShadow, setHasShadow] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const userLogin = localStorage.getItem("userLogin");

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userLogin');
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScrollY && currentScroll > 80) {
        // Scroll vers le bas -> cacher
        setIsVisible(false);
      } else {
        // Scroll vers le haut -> montrer
        setIsVisible(true);
      }

      setLastScrollY(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleShadow = () => {
      setHasShadow(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleShadow);
    return () => window.removeEventListener("scroll", handleShadow);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsVisible(false);     // 🔥 cacher la navigation
        setIsMenuOpen(false);    // 🔥 fermer le menu mobile si ouvert
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      ref={navRef}
      id="main-nav"
      className={`
        sticky top-0 z-50 backdrop-blur-sm transition-transform duration-300 pt-10 flex justify-center
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
        ${hasShadow ? "shadow-md" : ""}
      `}>
      <div className="w-[80%] flex justify-between flex-col">
        <div className="flex w-full justify-between mb-4">
          <Button
            type="button"
            onClick={handleLogout}
            className="bg-[#001964] hover:bg-[#001964]/90 text-sm lg:text-base"
            size="lg"
          >
            <LogOut className="mr-2 h-6 w-6" />
            <span>Déconnexion</span>
          </Button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-[#001964] hover:bg-[#001964]/5"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {userLogin === "admin" ? (
            <>
              <div className="hidden lg:flex w-[80%] items-center justify-around">
                <Link to="/administration" className={`flex items-center font-bold transition-colors duration-200 hover:text-[#001964] text-2xl ${location.pathname === "/administration"
                  ? 'text-[#001964]'
                  : 'text-muted-foreground'
                  }`}
                >
                  <NotebookText className="mr-4 h-6 w-6" />
                  <span>Liste des gestionnaires</span>
                </Link>

                <Link to="/register" className={`flex items-center font-bold transition-colors duration-200 hover:text-[#001964] text-2xl ${location.pathname === "/register"
                  ? 'text-[#001964]'
                  : 'text-muted-foreground'
                  }`}
                >
                  <UserRoundPlus className="mr-4 h-6 w-6" />
                  Ajouter un gestionnaire
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="hidden lg:flex w-[80%] items-center justify-around">
                <Link to="/estimate" className={`flex items-center font-bold transition-colors duration-200 hover:text-[#001964] text-2xl ${location.pathname === "/estimate"
                  ? 'text-[#001964]'
                  : 'text-muted-foreground'
                  }`}
                >
                  <NotebookText className="mr-4 h-6 w-6" />
                  <span>Demandes de devis</span>
                </Link>

                <Link
                  to="/passwordModif"
                  className={`flex items-center font-bold transition-colors duration-200 hover:text-[#001964] text-2xl ${location.pathname === "/passwordModif"
                    ? 'text-[#001964]'
                    : 'text-muted-foreground'
                    }`}
                >
                  <UserCog className="mr-4 h-6 w-6" />
                  <span>Modifier le mot de passe</span>
                </Link>
              </div>
            </>
          )}
        </div>

        {userLogin === "admin" ? (
          <>
            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="lg:hidden border-t border-border backdrop-blur-sm">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <Link to="/administration" className={`flex items-center font-bold transition-colors duration-200 hover:text-[#001964] text-2xl ${location.pathname === "/administration"
                    ? 'text-[#001964]'
                    : 'text-muted-foreground'
                    }`}
                  >
                    <NotebookText className="mr-4 h-6 w-6" />
                    Liste des gestionnaires
                  </Link>

                  <Link to="/register" className={`flex items-center font-bold transition-colors duration-200 hover:text-[#001964] text-2xl ${location.pathname === "/register"
                    ? 'text-[#001964]'
                    : 'text-muted-foreground'
                    }`}
                  >
                    <UserRoundPlus className="mr-4 h-6 w-6" />
                    Ajouter un gestionnaire
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="lg:hidden border-t border-border backdrop-blur-sm">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <Link to="/estimate" className={`flex items-center my-6 font-bold transition-colors duration-200 hover:text-[#001964] text-2xl ${location.pathname === "/estimate"
                    ? 'text-[#001964]'
                    : 'text-muted-foreground'
                    }`}
                  >
                    <NotebookText className="mr-4 h-6 w-6" />
                    <span>Demandes de devis</span>
                  </Link>

                  <Link
                    to="/passwordModif"
                    className={`flex items-center font-bold transition-colors duration-200 hover:text-[#001964] text-2xl ${location.pathname === "/passwordModif"
                      ? 'text-[#001964]'
                      : 'text-muted-foreground'
                      }`}
                  >
                    <UserCog className="mr-4 h-6 w-6" />
                    Modifier le mot de passe
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
