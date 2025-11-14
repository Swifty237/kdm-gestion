import { LogOut, UserCog, UserRoundPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


const Navigation = () => {

  const navigate = useNavigate();
  const [hasShadow, setHasShadow] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  return (
    <nav id="main-nav" className={`
        sticky top-0 z-50 backdrop-blur-sm transition-transform duration-300 pt-10 flex justify-center
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
        ${hasShadow ? "shadow-md" : ""}
      `}>
      <div className="w-[80%] flex justify-between mb-6">
        <Button
          type="button"
          onClick={handleLogout}
          className="bg-[#001964] hover:bg-[#001964]/90 text-sm lg:text-base"
          size="lg"
        >
          <LogOut className="mr-2 h-6 w-6" />
          Déconnexion
        </Button>

        {userLogin === "admin" ? (

          <>
            <Link to="/administration" className={`flex items-center font-bold transition-colors duration-200 hover:text-[#001964] text-2xl ${location.pathname === "/administration"
              ? 'text-[#001964]'
              : 'text-muted-foreground'
              }`}
            >
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
          </>

        ) : (
          <>
            <Link to="/estimate" className={`flex font-bold transition-colors duration-200 hover:text-[#001964] text-2xl ${location.pathname === "/estimate"
              ? 'text-[#001964]'
              : 'text-muted-foreground'
              }`}
            >
              Demandes de devis
            </Link>

            <Link
              to="/passwordModif"
              className={`flex font-bold transition-colors duration-200 hover:text-[#001964] text-2xl ${location.pathname === "/passwordModif"
                ? 'text-[#001964]'
                : 'text-muted-foreground'
                }`}
            >
              <UserCog className="mr-4 h-6 w-6" />
              Modifier le mot de passe
            </Link>
          </>

        )}
      </div>
    </nav>
  );
};

export default Navigation;
