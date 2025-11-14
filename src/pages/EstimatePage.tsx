import { Button } from '@/components/ui/button';
import { LogOut, UserCog } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Devis {
  _id: string;
  name: string;
  email: string;
  entreprise?: string;
  telephone?: string;
  service: string;
  date?: string;
  departure: {
    surface: string;
    volume: string;
    rooms: string;
    floor: string;
    elevator: boolean;
    elevatorSize: string;
    stairsSize: string;
    address: string;
  };
  arrival: {
    floor: string;
    elevator: boolean;
    elevatorSize: string;
    stairsSize: string;
    address: string;
    contactName: string;
    entreprise: string;
    date: string;
  }
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
        Demande de devis à traiter
      </p>

      <div className="w-[80%] overflow-x-auto shadow-lg">
        {loading ? (
          <p>Chargement des devis...</p>
        ) : devisList.length === 0 ? (
          <p>Aucun devis trouvé.</p>
        ) : (
          <Table className="w-full border border-gray-300">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="border p-2 text-left">Nom</TableHead>
                <TableHead className="border p-2 text-left">Email</TableHead>
                <TableHead className="border p-2 text-left">Entreprise</TableHead>
                <TableHead className="border p-2 text-left">Téléphone</TableHead>
                <TableHead className="border p-2 text-left">Service</TableHead>
                <TableHead className="border p-2 text-left">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devisList.map((devis) => (
                <TableRow key={devis._id}>
                  <TableCell className="border p-2">
                    <Link to={`/estimateDetails/${devis._id}`} className="flex">{devis.name}</Link>
                  </TableCell>
                  <TableCell className="border p-2">
                    <Link to={`/estimateDetails/${devis._id}`} className="flex">{devis.email}</Link>
                  </TableCell>
                  <TableCell className="border p-2">
                    <Link to={`/estimateDetails/${devis._id}`} className="flex">{devis.entreprise || '-'}</Link>
                  </TableCell>
                  <TableCell className="border p-2">
                    <Link to={`/estimateDetails/${devis._id}`} className="flex">{devis.telephone || '-'}</Link>
                  </TableCell>
                  <TableCell className="border p-2">
                    <Link to={`/estimateDetails/${devis._id}`} className="flex">{devis.service}</Link>
                  </TableCell>
                  <TableCell className="border p-2">
                    <Link to={`/estimateDetails/${devis._id}`} className="flex">{devis.date || '-'}</Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default EstimatePage;
