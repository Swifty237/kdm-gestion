
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

const queryClient = new QueryClient();

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  return token ? children : <Navigate to="/" replace />;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const userLogin = localStorage.getItem('userLogin');

  return token && userLogin === "admin" ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
};


const App = () => {
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
  )
};

export default App;
