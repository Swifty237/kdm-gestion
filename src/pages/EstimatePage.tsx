import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Archive, ArchiveRestore, ChevronLeft, ChevronRight, Trash, Play } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ConfirmDialog from "@/components/ConfirmDialog";


interface Devis {
  _id: string;
  civility: string;
  name: string;
  email: string;
  entreprise?: string;
  telephone?: string;
  service: string;
  offer: string;
  billingAddress: string;
  devisNumber: string;
  archived: boolean;
  inManagement: boolean;
  message: string;
  duration: string;
  distance: string;
  estimatedAmount: string;
  finalAmount: string;
  date?: string;
  adjustmentReason: string;
  adjustmentAmount: string;
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
    contactCivility: string;
    contactName: string;
    entreprise: string;
    date: string;
  }
  createdAt?: string;
}

const EstimatePage = () => {
  const [devisList, setDevisList] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingManageId, setLoadingManageId] = useState<string | null>(null); // Pour gérer l'état de chargement du bouton
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("estimate_active_tab") || "nonTraites"
  );

  const [activeColumn, setActiveColumn] = useState(0);
  const tableHeads = ["Nom", "Service", "Email", "Entreprise", "Numéro devis", "Date de création"];

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDevisId, setSelectedDevisId] = useState<string | null>(null);

  // État pour la recherche
  const [searchTerm, setSearchTerm] = useState("");


  const API_URL = import.meta.env.VITE_KDM_SERVER_URI;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem("estimate_active_tab", value);
    // Réinitialiser la recherche quand on change d'onglet
    setSearchTerm("");
  };


  const archiveDevis = async (id: string) => {
    setLoading(true)

    try {

      const response = await fetch(`${API_URL}/api/devis/${id}/archive`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        // Mise à jour instantanée du state côté client
        setDevisList(prev =>
          prev.map(d => d._id === id ? { ...d, archived: true } : d)
        );
        setLoading(false);
      } else {

        console.error("Erreur lors de l'archivage");
        setLoading(false);
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      setLoading(false);
    }
  };

  const unArchiveDevis = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/devis/${id}/unarchive`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        // Mise à jour immédiate dans le state React
        setDevisList(prev =>
          prev.map(d => d._id === id ? { ...d, archived: false } : d)
        );
        setLoading(false);
      } else {
        console.error("Erreur lors de la désarchivage");
        setLoading(false);
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      setLoading(false);
    }
  };

  const deleteDevis = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/devis/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDevisList(prev => prev.filter(d => d._id !== id));
        setLoading(false);
      } else {
        console.error("Erreur lors de la suppression");
        setLoading(false);
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      setLoading(false);
    }
  };

  const switchAttribut = (devis: Devis) => {
    switch (activeColumn) {
      case 0:
        return devis.name;
      case 1:
        return devis.service;
      case 2:
        return devis.email;
      case 3:
        return devis.entreprise;
      case 4:
        return `Devis n° ${devis.devisNumber}`;
      case 5:
        // Formatage optionnel de la date
        return devis.createdAt ? new Date(devis.createdAt).toLocaleDateString() : "-";
      default:
        return "-";
    }
  };

  const manageDevis = async (id: string) => {
    setLoadingManageId(id);

    try {

      const response = await fetch(`${API_URL}/api/devis/${id}/manage`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}) // ✅ IMPORTANT: Envoyer un objet vide
      });

      if (response.ok) {
        // const data = await response.json();
        setDevisList(prev =>
          prev.map(d => d._id === id ? { ...d, inManagement: true } : d)
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Erreur lors de l'activation de la gestion:", errorData);
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
    } finally {
      setLoadingManageId(null);
    }
  };

  // Fonction de filtrage
  const filterDevis = (devis: Devis) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      devis.name?.toLowerCase().includes(term) ||
      devis.email?.toLowerCase().includes(term) ||
      devis.entreprise?.toLowerCase().includes(term) ||
      devis.devisNumber?.toLowerCase().includes(term)
    );
  };

  useEffect(() => {
    const fetchDevis = async () => {
      try {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Séparation et filtrage
  const devisNonArchives = devisList.filter(d => !d.archived && filterDevis(d));
  const devisArchives = devisList.filter(d => d.archived && filterDevis(d));

  return (
    <div className="flex flex-col items-center min-h-screen pt-16">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-[80%]">

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
          <p className="text-xl mt-8 mb-4 font-bold text-center">Demande de devis à traiter</p>

          {/* Barre de recherche */}
          <div className="mb-8 flex justify-center">
            <input
              type="text"
              placeholder="Rechercher par nom, email, entreprise ou numéro de devis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#001964] focus:border-transparent"
            />
          </div>

          {loading ? (
            <p className="text-center">Chargement...</p>
          ) : (
            <>
              <Table className="hidden lg:table w-full border border-gray-300 shadow-lg">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="border p-2 text-left">Civilité et nom</TableHead>
                    <TableHead className="border p-2 text-left">Service</TableHead>
                    <TableHead className="border p-2 text-left">Email</TableHead>
                    <TableHead className="border p-2 text-left">Entreprise</TableHead>
                    <TableHead className="border p-2 text-center">Numéro devis</TableHead>
                    <TableHead className="border p-2 text-center">Date de création</TableHead>
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
                          <Link to={`/estimateDetails/${devis._id}`} className="flex">{devis.civility} {devis.name}</Link>
                        </TableCell>
                        <TableCell className="border p-2">
                          <Link to={`/estimateDetails/${devis._id}`} className="flex">{devis.service}</Link>
                        </TableCell>
                        <TableCell className="border p-2">
                          <Link to={`/estimateDetails/${devis._id}`} className="flex">{devis.email}</Link>
                        </TableCell>
                        <TableCell className="border p-2">
                          <Link to={`/estimateDetails/${devis._id}`} className="flex">{devis.entreprise || '-'}</Link>
                        </TableCell>
                        <TableCell className="border p-2">
                          <Link to={`/estimateDetails/${devis._id}`} className="flex items-center justify-center"> Devis n° {devis.devisNumber || '-'}</Link>
                        </TableCell>
                        <TableCell className="border p-2 text-center">
                          {devis.createdAt ? new Date(devis.createdAt).toLocaleDateString() : '-'}
                        </TableCell>

                        <TableCell className="border p-2">
                          <div className="flex justify-around">
                            <div className="relative group">
                              <Button
                                type="button"
                                onClick={() => archiveDevis(devis._id)}
                                className="bg-gray-400 hover:bg-gray-500 text-sm lg:text-base"
                              >
                                <Archive className="h-6 w-6" />
                              </Button>

                              {/* Tooltip */}
                              <span
                                className=" absolute z-[55] left-1/2 -translate-x-1/2 -bottom-3
                                          whitespace-nowrap
                                          bg-black text-white text-xs px-2 py-1 rounded
                                          opacity-0 group-hover:opacity-100
                                          transition-opacity duration-200
                                        "
                              >
                                Archiver
                              </span>
                            </div>

                            {devis.inManagement ? (
                              <span className="bg-green-100 text-green-800 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                                En cours...
                              </span>
                            ) : (
                              <div className="relative group">
                                <Button
                                  type="button"
                                  onClick={() => manageDevis(devis._id)}
                                  disabled={loadingManageId === devis._id}
                                  className="bg-[#16a085] hover:bg-[#1abc9c] text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {loadingManageId === devis._id ? (
                                    <span className="flex items-center gap-2">
                                      <span className="animate-spin">⚪</span>
                                      Chargement...
                                    </span>
                                  ) : (
                                    <Play className="h-6 w-6" />
                                  )}
                                </Button>
                                <span className="absolute z-[55] left-1/2 -translate-x-1/2 -bottom-3 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  Activer la gestion
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <div className="lg:hidden">
                {devisNonArchives.length !== 0 ? (
                  <div className="flex items-center justify-center gap-4 my-4 lg:hidden">
                    <Button
                      className="py-2 px-3 border rounded-full bg-[#bdc3c7] hover:bg-[#001964]"
                      onClick={() => setActiveColumn(prev => Math.max(0, prev - 1))}
                    >
                      <ChevronLeft />
                    </Button>

                    <span className="font-semibold">
                      {tableHeads[activeColumn]}
                    </span>

                    <Button
                      className="py-2 px-3 border rounded-full bg-[#bdc3c7] hover:bg-[#001964]"
                      onClick={() => setActiveColumn(prev => Math.min(tableHeads.length - 1, prev + 1))}
                    >
                      <ChevronRight />
                    </Button>
                  </div>
                ) : <></>}

                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="border">{tableHeads[activeColumn]}</TableHead>
                      <TableHead className="border">Gestion</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {devisNonArchives.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-4">
                          Aucun devis à traiter.
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {devisNonArchives.map((row) => (
                          <TableRow key={row._id}>
                            <TableCell>
                              <Link to={`/estimateDetails/${row._id}`} className="flex">
                                {switchAttribut(row) ? switchAttribut(row) : "-"}
                              </Link>
                            </TableCell>
                            <TableCell className="">
                              <div className="flex items-center gap-2">
                                <div className="relative group">
                                  <Button
                                    type="button"
                                    onClick={() => archiveDevis(row._id)}
                                    className="bg-gray-400 hover:bg-gray-500 text-sm lg:text-base"
                                  >
                                    <Archive className="h-6 w-6" />
                                  </Button>
                                  <span className="absolute z-[55] right-1/7 -translate-x-1/2 -bottom-4 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    Archiver
                                  </span>
                                </div>

                                {row.inManagement ? (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
                                    En cours...
                                  </span>
                                ) : (
                                  <div className="relative group">
                                    <Button
                                      type="button"
                                      onClick={() => manageDevis(row._id)}
                                      disabled={loadingManageId === row._id}
                                      className="bg-[#16a085] hover:bg-[#1abc9c] text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {loadingManageId === row._id ? (
                                        <span className="animate-spin">⚪</span>
                                      ) : (
                                        <Play className="h-6 w-6" />
                                      )}
                                    </Button>
                                    <span className="absolute z-[55] right-1/7 -translate-x-1/2 -bottom-4 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                      Activer la gestion
                                    </span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </TabsContent>

        {/* ONGLET 2 */}
        <TabsContent value="archives">
          <p className="text-xl mt-8 mb-4 font-bold text-center">Devis archivés</p>

          {/* Barre de recherche */}
          <div className="mb-8 flex justify-center">
            <input
              type="text"
              placeholder="Rechercher par nom, email, entreprise ou numéro de devis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#001964] focus:border-transparent"
            />
          </div>

          {loading ? (
            <p className="text-center">Chargement...</p>
          ) : (
            <>
              <Table className=" hidden lg:table w-full border border-gray-300 shadow-lg">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="border p-2 text-left">Civilité et nom</TableHead>
                    <TableHead className="border p-2 text-left">Service</TableHead>
                    <TableHead className="border p-2 text-left">Email</TableHead>
                    <TableHead className="border p-2 text-left">Entreprise</TableHead>
                    <TableHead className="border p-2 text-center">Numéro devis</TableHead>
                    <TableHead className="border p-2 text-center">Date de création</TableHead>
                    <TableHead className="border p-2 text-center">Gestion</TableHead>
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
                        <TableCell className="border p-2">
                          <Link to={`/estimateDetails/${devis._id}`} className="flex">{devis.civility} {devis.name}</Link>
                        </TableCell>
                        <TableCell className="border p-2">
                          <Link to={`/estimateDetails/${devis._id}`} className="flex">{devis.service}</Link>
                        </TableCell>
                        <TableCell className="border p-2">
                          <Link to={`/estimateDetails/${devis._id}`} className="flex">{devis.email}</Link>
                        </TableCell>
                        <TableCell className="border p-2">
                          <Link to={`/estimateDetails/${devis._id}`} className="flex">{devis.entreprise || '-'}</Link>
                        </TableCell>
                        <TableCell className="border p-2">
                          <Link to={`/estimateDetails/${devis._id}`} className="flex justify-center">Devis n° {devis.devisNumber || '-'}</Link>
                        </TableCell>
                        <TableCell className="border p-2 text-center">
                          {devis.createdAt ? new Date(devis.createdAt).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className="border p-2">
                          <div className="flex items-center justify-around">
                            <div className="relative group">
                              <Button
                                type="button"
                                onClick={() => unArchiveDevis(devis._id)}
                                className="bg-gray-400 hover:bg-gray-500 text-sm lg:text-base"
                              >
                                <ArchiveRestore className="h-4 w-4" />
                              </Button>

                              {/* Tooltip */}
                              <span
                                className=" absolute z-[54] right-1/7 -translate-x-1/2 -bottom-4
                                          whitespace-nowrap
                                          bg-black text-white text-xs px-2 py-1 rounded
                                          opacity-0 group-hover:opacity-100
                                          transition-opacity duration-200
                                        "
                              >
                                Restorer
                              </span>
                            </div>

                            <div className="relative group">
                              <Button
                                type="button"
                                onClick={() => {
                                  setSelectedDevisId(devis._id);
                                  setConfirmOpen(true);
                                }}
                                className="bg-red-400 hover:bg-red-600 text-sm lg:text-base"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>

                              {/* Tooltip */}
                              <span
                                className=" absolute z-[55] right-1/7 -translate-x-1/2 -bottom-4
                                          whitespace-nowrap
                                          bg-black text-white text-xs px-2 py-1 rounded
                                          opacity-0 group-hover:opacity-100
                                          transition-opacity duration-200
                                        "
                              >
                                Supprimer
                              </span>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <div className="lg:hidden">

                {devisArchives.length !== 0 ? (
                  <div className="flex items-center justify-center gap-4 my-4 lg:hidden">
                    <Button
                      className="py-2 px-3 border rounded-full bg-[#bdc3c7] hover:bg-[#001964]"
                      onClick={() => setActiveColumn(prev => Math.max(0, prev - 1))}
                    >
                      <ChevronLeft />
                    </Button>

                    <span className="font-semibold">
                      {tableHeads[activeColumn]}
                    </span>

                    <Button
                      className="py-2 px-3 border rounded-full bg-[#bdc3c7] hover:bg-[#001964]"
                      onClick={() => setActiveColumn(prev => Math.min(tableHeads.length - 1, prev + 1))}
                    >
                      <ChevronRight />
                    </Button>
                  </div>
                ) : <></>}

                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="border">{tableHeads[activeColumn]}</TableHead>
                      <TableHead className="border">Gestion</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>

                    {devisArchives.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-4">
                          Aucun devis archivé.
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {devisArchives.map((row) => (
                          <TableRow key={row._id}>
                            <TableCell>
                              <Link to={`/estimateDetails/${row._id}`} className="flex">
                                {switchAttribut(row) ? switchAttribut(row) : "-"}
                              </Link>
                            </TableCell>
                            <TableCell className="">
                              <div className="flex items-center justify-around">
                                <div className="relative group">
                                  <Button
                                    type="button"
                                    onClick={() => unArchiveDevis(row._id)}
                                    className="bg-gray-400 hover:bg-gray-500 text-sm lg:text-base"
                                  >
                                    <ArchiveRestore className="h-4 w-4" />
                                  </Button>

                                  {/* Tooltip */}
                                  <span
                                    className=" absolute z-[54] right-1/7 -translate-x-1/2 -bottom-4
                                          whitespace-nowrap
                                          bg-black text-white text-xs px-2 py-1 rounded
                                          opacity-0 group-hover:opacity-100
                                          transition-opacity duration-200
                                        "
                                  >
                                    Restorer
                                  </span>
                                </div>

                                <div className="relative group">
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      setSelectedDevisId(row._id);
                                      setConfirmOpen(true);
                                    }}
                                    className="bg-red-400 hover:bg-red-600 text-sm lg:text-base"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>

                                  {/* Tooltip */}
                                  <span
                                    className=" absolute z-[55] right-1/7 -translate-x-1/2 -bottom-4
                                          whitespace-nowrap
                                          bg-black text-white text-xs px-2 py-1 rounded
                                          opacity-0 group-hover:opacity-100
                                          transition-opacity duration-200
                                        "
                                  >
                                    Supprimer
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={confirmOpen}
        title="Supprimer ce devis ?"
        description="Voulez-vous vraiment supprimer ce devis ?"
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={() => {
          if (selectedDevisId) {
            deleteDevis(selectedDevisId);
          }
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
      />

    </div>
  );
};

export default EstimatePage;
