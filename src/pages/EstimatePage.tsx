import { Button } from '@/components/ui/button';
import { LogOut, UserCog } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface Devis {
  _id: string;
  name: string;
  email: string;
  entreprise?: string;
  telephone?: string;
  service: string;
  date?: string;
  createdAt?: string;
}

const EstimatePage = () => {
  const navigate = useNavigate();
  const [devisList, setDevisList] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  useEffect(() => {
    const fetchDevis = async () => {
      try {
        const API_URL = import.meta.env.VITE_KDM_SERVER_URI;
        const response = await fetch(`${API_URL}/api/devis`);
        const data = await response.json();

        if (response.ok) {
          setDevisList(data);
        } else {
          console.error("Erreur lors de la récupération des devis:", data.error);
        }
      } catch (err) {
        console.error("Erreur réseau:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDevis();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4">
      <div className="w-[80%] flex justify-between items-center mb-6">
        <Button
          type="button"
          onClick={handleLogout}
          className="bg-[#001964] hover:bg-[#001964]/90 text-sm lg:text-base"
          size="lg"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>

        <Link
          to="/passwordModif"
          className="text-[#001964] font-semibold text-2xl flex items-center"
        >
          <UserCog className="mr-4 h-6 w-6" />
          Modifier le mot de passe
        </Link>
      </div>

      <h2 className="text-4xl font-bold text-[#001964] underline mb-8">
        Itnterface de gestion
      </h2>

      <p className="text-xl mb-8 font-bold">
        Listes des devis
      </p>

      <div className="w-[80%] overflow-x-auto">
        {loading ? (
          <p>Chargement des devis...</p>
        ) : devisList.length === 0 ? (
          <p>Aucun devis trouvé.</p>
        ) : (
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Nom</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Entreprise</th>
                <th className="border p-2 text-left">Téléphone</th>
                <th className="border p-2 text-left">Service</th>
                <th className="border p-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {devisList.map((devis) => (
                <tr key={devis._id}>
                  <td className="border p-2">{devis.name}</td>
                  <td className="border p-2">{devis.email}</td>
                  <td className="border p-2">{devis.entreprise || '-'}</td>
                  <td className="border p-2">{devis.telephone || '-'}</td>
                  <td className="border p-2">{devis.service}</td>
                  <td className="border p-2">{devis.date || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EstimatePage;
