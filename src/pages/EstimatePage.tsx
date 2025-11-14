import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Archive, ArchiveRestore, Trash } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Devis {
  _id: string;
  name: string;
  email: string;
  entreprise?: string;
  telephone?: string;
  service: string;
  date?: string;
  archived?: boolean;  // <-- IMPORTANT
}

const EstimatePage = () => {
  const [devisList, setDevisList] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Séparation des devis
  const devisNonArchives = devisList.filter(d => !d.archived);
  const devisArchives = devisList.filter(d => d.archived);

  return (
    <div className="flex flex-col items-center min-h-screen pt-16">
      <Tabs defaultValue="nonTraites" className="w-[80%]">

        {/* ONGLET SELECTEUR */}
        <TabsList className="mb-6 flex bg-[white] justify-around">
          <TabsTrigger
            value="nonTraites"
            className="data-[state=active]:bg-[#001964] data-[state=active]:text-white text-xl px-8 py-2">
            Devis à traiter
          </TabsTrigger>
          <TabsTrigger
            value="archives"
            className="data-[state=active]:bg-[#001964] data-[state=active]:text-white text-xl px-8 py-2"
          >
            Devis archivés
          </TabsTrigger>
        </TabsList>

        {/* ONGLET 1 */}
        <TabsContent value="nonTraites">
          <p className="text-xl my-8 font-bold">Demande de devis à traiter</p>
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <Table className="w-full border border-gray-300 shadow-lg">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="border p-2 text-left">Nom</TableHead>
                  <TableHead className="border p-2 text-left">Email</TableHead>
                  <TableHead className="border p-2 text-left">Entreprise</TableHead>
                  <TableHead className="border p-2 text-left">Téléphone</TableHead>
                  <TableHead className="border p-2 text-left">Service</TableHead>
                  <TableHead className="border p-2 text-left">Date</TableHead>
                  <TableHead className="border p-2 text-center">Gestion</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {devisNonArchives.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Aucun devis à traiter.
                    </TableCell>
                  </TableRow>
                ) : (
                  devisNonArchives.map((devis) => (
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
                      <TableCell className="border p-2">{devis.service}</TableCell>
                      <TableCell className="border p-2">{devis.date || '-'}</TableCell>

                      <TableCell className="border p-2 text-center">
                        <Button className="bg-[#001964] hover:bg-[#001964]/90 text-sm">
                          <Archive className="mr-2 h-4 w-4" />
                          Archiver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        {/* ONGLET 2 */}
        <TabsContent value="archives">
          <p className="text-xl my-8 font-bold">Devis archivés</p>

          <Table className="w-full border border-gray-300 shadow-lg">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="border p-2 text-left">Nom</TableHead>
                <TableHead className="border p-2 text-left">Email</TableHead>
                <TableHead className="border p-2 text-left">Service</TableHead>
                <TableHead className="border p-2 text-left">Date</TableHead>
                <TableHead className="border p-2 text-left">Gestion</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {devisArchives.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Aucun devis archivé.
                  </TableCell>
                </TableRow>
              ) : (
                devisArchives.map((devis) => (
                  <TableRow key={devis._id}>
                    <TableCell className="border p-2">{devis.name}</TableCell>
                    <TableCell className="border p-2">{devis.email}</TableCell>
                    <TableCell className="border p-2">{devis.service}</TableCell>
                    <TableCell className="border p-2">{devis.date || '-'}</TableCell>
                    <TableCell className="border p-2">
                      <div className="flex items-center justify-around">
                        <Button className="bg-[#001964] hover:bg-[#001964]/90 text-sm">
                          <ArchiveRestore className="mr-2 h-4 w-4" />
                          Restorer
                        </Button>

                        <Button className="bg-[#eb2f06] hover:bg-[#eb2f06]/90 text-sm">
                          <Trash className="mr-2 h-4 w-4" />
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default EstimatePage;
