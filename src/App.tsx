import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import EstimatePage from "./pages/EstimatePage";
import NotFound from "./pages/NotFound";
import AdministrationPage from "./pages/AdministrationPage";
import PasswordModifPage from "./pages/PasswordModifPage";
import { useEffect } from "react";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/" replace />;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  const userLogin = localStorage.getItem("userLogin");
  return token && userLogin === import.meta.env.VITE_KDM_ADMIN ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
};

const App = () => {
  useEffect(() => {
    // N’exécute pas en local
    if (import.meta.env.DEV) {
      console.log("Environnement local détecté → initAdmin ignoré");
      return;
    }

    // Ne lance l’appel qu’une seule fois par navigateur
    const alreadyInitialized = localStorage.getItem("adminInitDone");
    if (alreadyInitialized) {
      console.log("Admin déjà initialisé sur ce navigateur.");
      return;
    }

    const initAdmin = async () => {
      try {
        console.log("Initialisation de l’admin en cours…");

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/initAdmin`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();
        console.log("Réponse initAdmin :", data.message || data.error);

        // On enregistre que l’initialisation a été faite sur ce navigateur
        localStorage.setItem("adminInitDone", "true");
      } catch (err) {
        console.error("Erreur lors de l'initialisation admin :", err);
      }
    };

    initAdmin();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route
                path="/estimate"
                element={
                  <PrivateRoute>
                    <EstimatePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/passwordModif"
                element={
                  <PrivateRoute>
                    <PasswordModifPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/administration"
                element={
                  <AdminRoute>
                    <AdministrationPage />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
