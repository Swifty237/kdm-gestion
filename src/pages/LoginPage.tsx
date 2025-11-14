import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useState } from 'react';
import { Eye, EyeOff } from "lucide-react";


const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [credentials, setCredentials] = useState({
    login: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const API_URL = import.meta.env.VITE_KDM_SERVER_URI;

    try {
      const response = await fetch(`${API_URL}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (response.ok) {
        // Stocke le token (ou autre info utile)
        if (result.token) {
          localStorage.setItem('authToken', result.token);
          localStorage.setItem("userLogin", credentials.login);
        }

        setCredentials({ login: '', password: '' });

        if (credentials.login === "admin") {
          navigate("/administration");
        } else {
          navigate("/estimate");
        }

      } else {
        alert('Erreur : ' + (result.error || 'Identifiants incorrects'));
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[100vh]">
      <h2 className="text-4xl font-bold text-[#001964] underline">
        Interface de gestion / administration
      </h2>

      <section className="py-8 lg:py-16 px-4 sm:px-8 lg:px-16 mb-8 lg:mb-16 w-full">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-3 lg:gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="login" className="text-xl font-bold">Identifiant</Label>
                    <div className="flex items-center">
                      <Input
                        id="login"
                        name="login"
                        type="text"
                        value={credentials.login}
                        onChange={handleInputChange}
                        placeholder="Entrez votre identifiant"
                        className="text-xl lg:text-base"
                        required
                      />
                      {/* Faux bouton invisible pour garder l’alignement */}
                      <button
                        type="button"
                        className="p-4 opacity-0 cursor-default"
                        tabIndex={-1}
                      >
                        <Eye size={22} />
                      </button>
                    </div>

                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xl font-bold">Mot de passe</Label>
                    <div className="flex items-center">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={credentials.password}
                        onChange={handleInputChange}
                        placeholder="Entrez votre mot de passe"
                        className="text-xl lg:text-base"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="text-gray-600 hover:text-gray-800 p-4"
                      >
                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                      </button>
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#001964] hover:bg-[#001964]/90 text-xl mt-8"
                  size="lg"
                >
                  {loading ? 'Connexion...' : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Connexion
                    </>
                  )}
                </Button>

              </form>
            </div>

            <div className="order-1 lg:order-2 flex justify-center">
              <div className="flex items-center">
                <img src="/img/Logo.png" alt="KDM Logo" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
