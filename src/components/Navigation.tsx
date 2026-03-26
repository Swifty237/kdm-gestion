import { LogOut, Menu, NotebookText, UserCog, UserRoundPlus, X } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasShadow, setHasShadow] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const userLogin = localStorage.getItem("userLogin");

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userLogin');
    localStorage.removeItem("estimate_active_tab");
    navigate('/');
  };

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
        setIsMenuOpen(false);    // fermer le menu mobile si ouvert
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
        fixed top-0 left-0 w-full z-50 backdrop-blur-sm transition-shadow duration-300 pt-7 pb-2 flex justify-center
        ${hasShadow ? "shadow-md bg-white/90" : "bg-white/50"}
      `}>
      <div className="w-[90%] lg:w-[80%] flex justify-between flex-col">
        <div className="flex w-full justify-between items-center mb-4">
          <div className="relative group">
            <Button
              type="button"
              onClick={handleLogout}
              className="bg-[#001964] hover:bg-[#001964]/90 text-sm lg:text-base"
            >
              <LogOut className="h-5 w-5" />
            </Button>

            {/* Tooltip */}
            <span
              className=" absolute left-0 -translate-x-1/2 -bottom-7
                          whitespace-nowrap
                          bg-black text-white text-xs px-2 py-1 rounded
                          opacity-0 group-hover:opacity-100
                          transition-opacity duration-200
                        "
            >
              Déconnexion
            </span>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-[#001964] hover:bg-[#001964]/5"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {userLogin === "admin" ? (
            <>
              <div className="hidden lg:flex flex-1 items-center justify-end space-x-8">
                <Link to="/administration" className={`flex items-center font-bold transition-colors duration-200 hover:text-[#001964] text-lg ${location.pathname === "/administration"
                  ? 'text-[#001964]'
                  : 'text-muted-foreground'
                  }`}
                >
                  <NotebookText className="mr-2 h-5 w-5" />
                  <span>Liste des gestionnaires</span>
                </Link>

                <Link to="/register" className={`flex items-center font-bold transition-colors duration-200 hover:text-[#001964] text-lg ${location.pathname === "/register"
                  ? 'text-[#001964]'
                  : 'text-muted-foreground'
                  }`}
                >
                  <UserRoundPlus className="mr-2 h-5 w-5" />
                  Ajouter un gestionnaire
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="hidden lg:flex items-center justify-end space-x-20">
                <Link to="/estimate" className={`flex items-center font-bold transition-colors duration-200 hover:text-[#001964] text-lg ${location.pathname === "/estimate"
                  ? 'text-[#001964]'
                  : 'text-muted-foreground'
                  }`}
                >
                  <NotebookText className="mr-2 h-5 w-5" />
                  <span>Demandes de devis</span>
                </Link>

                <Link
                  to="/passwordModif"
                  className={`flex items-center font-bold transition-colors duration-200 hover:text-[#001964] text-lg ${location.pathname === "/passwordModif"
                    ? 'text-[#001964]'
                    : 'text-muted-foreground'
                    }`}
                >
                  <UserCog className="mr-2 h-5 w-5" />
                  Modifier le mot de passe
                </Link>
              </div>
            </>
          )}
        </div>

        {userLogin === "admin" ? (
          <>
            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="lg:hidden border-t border-border backdrop-blur-sm mt-2">
                <div className="px-2 pt-2 pb-3 space-y-4">
                  <Link
                    to="/administration"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center font-bold transition-colors duration-200 hover:text-[#001964] text-lg py-2 ${location.pathname === "/administration"
                      ? 'text-[#001964]'
                      : 'text-muted-foreground'
                      }`}
                  >
                    <NotebookText className="mr-2 h-5 w-5" />
                    Liste des gestionnaires
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center font-bold transition-colors duration-200 hover:text-[#001964] text-lg py-2 ${location.pathname === "/register"
                      ? 'text-[#001964]'
                      : 'text-muted-foreground'
                      }`}
                  >
                    <UserRoundPlus className="mr-2 h-5 w-5" />
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
              <div className="lg:hidden border-t border-border backdrop-blur-sm mt-2">
                <div className="px-2 pt-2 pb-3 space-y-4">
                  <Link
                    to="/estimate"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center font-bold transition-colors duration-200 hover:text-[#001964] text-lg py-2 ${location.pathname === "/estimate"
                      ? 'text-[#001964]'
                      : 'text-muted-foreground'
                      }`}
                  >
                    <NotebookText className="mr-2 h-5 w-5" />
                    <span>Demandes de devis</span>
                  </Link>

                  <Link
                    to="/passwordModif"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center font-bold transition-colors duration-200 hover:text-[#001964] text-lg py-2 ${location.pathname === "/passwordModif"
                      ? 'text-[#001964]'
                      : 'text-muted-foreground'
                      }`}
                  >
                    <UserCog className="mr-2 h-5 w-5" />
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