/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Archive, ArchiveRestore, ChevronLeft, ChevronRight, Trash, Play } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useNavHeight } from '@/context/NavHeightContext';

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
  };
  createdAt?: string;
}

const EstimatePage = () => {
  const [devisList, setDevisList] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingManageId, setLoadingManageId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("estimate_active_tab") || "nonTraites"
  );
  const [activeColumn, setActiveColumn] = useState(0);
  const tableHeads = ["Nom", "Service", "Email", "Entreprise", "Numéro devis", "Date de création", "Gestion"];
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDevisId, setSelectedDevisId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDevisIds, setSelectedDevisIds] = useState<Set<string>>(new Set());
  const [loadingAction, setLoadingAction] = useState(false);
  const [confirmDeleteMultiple, setConfirmDeleteMultiple] = useState(false);

  const navHeight = useNavHeight();

  const [currentPageNonTraites, setCurrentPageNonTraites] = useState(1);
  const [currentPageArchives, setCurrentPageArchives] = useState(1);
  const ITEMS_PER_PAGE = 10;


  const API_URL = import.meta.env.VITE_KDM_SERVER_URI;

  // Réinitialiser la sélection quand la recherche ou l'onglet change
  useEffect(() => {
    setSelectedDevisIds(new Set());
  }, [searchTerm, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem("estimate_active_tab", value);
    setSearchTerm("");
  };

  const archiveDevis = async (id: string) => {
    // Fonction utilitaire pour un seul devis (utilisée par les actions groupées)
    const response = await fetch(`${API_URL}/api/devis/${id}/archive`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`Erreur archivage ${id}`);
    return id;
  };

  const unArchiveDevis = async (id: string) => {
    const response = await fetch(`${API_URL}/api/devis/${id}/unarchive`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`Erreur désarchivage ${id}`);
    return id;
  };

  const deleteDevis = async (id: string) => {
    const response = await fetch(`${API_URL}/api/devis/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`Erreur suppression ${id}`);
    return id;
  };

  const manageDevis = async (id: string) => {
    const response = await fetch(`${API_URL}/api/devis/${id}/manage`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!response.ok) throw new Error(`Erreur activation gestion ${id}`);
    return id;
  };

  const handleManageSingleDevis = async (id: string) => {
    setLoadingManageId(id);
    try {
      await manageDevis(id);
      // Mise à jour immédiate du state
      setDevisList(prev =>
        prev.map(d => d._id === id ? { ...d, inManagement: true } : d)
      );
    } catch (err) {
      console.error("Erreur activation gestion", err);
    } finally {
      setLoadingManageId(null);
    }
  };

  // Actions groupées
  const archiveSelectedDevis = async () => {
    if (selectedDevisIds.size === 0) return;
    setLoadingAction(true);
    try {
      const promises = Array.from(selectedDevisIds).map(id => archiveDevis(id));
      await Promise.all(promises);
      // Mise à jour locale : passer archived à true pour les devis concernés
      setDevisList(prev =>
        prev.map(d => (selectedDevisIds.has(d._id) ? { ...d, archived: true } : d))
      );
      setSelectedDevisIds(new Set());
    } catch (err) {
      console.error("Erreur lors de l'archivage groupé", err);
    } finally {
      setLoadingAction(false);
    }
  };

  const unArchiveSelectedDevis = async () => {
    if (selectedDevisIds.size === 0) return;
    setLoadingAction(true);
    try {
      const promises = Array.from(selectedDevisIds).map(id => unArchiveDevis(id));
      await Promise.all(promises);
      setDevisList(prev =>
        prev.map(d => (selectedDevisIds.has(d._id) ? { ...d, archived: false } : d))
      );
      setSelectedDevisIds(new Set());
    } catch (err) {
      console.error("Erreur lors du désarchivage groupé", err);
    } finally {
      setLoadingAction(false);
    }
  };

  const deleteSelectedDevis = async () => {
    if (selectedDevisIds.size === 0) return;
    setLoadingAction(true);
    try {
      const promises = Array.from(selectedDevisIds).map(id => deleteDevis(id));
      await Promise.all(promises);
      setDevisList(prev => prev.filter(d => !selectedDevisIds.has(d._id)));
      setSelectedDevisIds(new Set());
    } catch (err) {
      console.error("Erreur lors de la suppression groupée", err);
    } finally {
      setLoadingAction(false);
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
        return devis.createdAt ? new Date(devis.createdAt).toLocaleDateString() : "-";
      case 6:
        return devis.inManagement ? "En cours" : (
          <div>
            <Button
              type="button"
              onClick={() => handleManageSingleDevis(devis._id)}
              disabled={loadingManageId === devis._id}
              className="bg-[#16a085] hover:bg-[#1abc9c] text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed flex"
            >
              {loadingManageId === devis._id ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⚪</span>
                  Chargement...
                </span>
              ) : (
                <Play className="" />
              )}
            </Button>
            <span className="absolute z-[55] left-1/2 -translate-x-1/2 -bottom-3 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Activer la gestion
            </span>
          </div>
        );
      default:
        return "-";
    }
  };

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
    setSelectedDevisIds(new Set());
    // Réinitialiser la page courante selon l'onglet actif
    if (activeTab === "nonTraites") {
      setCurrentPageNonTraites(1);
    } else {
      setCurrentPageArchives(1);
    }
  }, [searchTerm, activeTab]);

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
  }, []);

  const devisNonArchives = devisList.filter(d => !d.archived && filterDevis(d));
  const devisArchives = devisList.filter(d => d.archived && filterDevis(d));

  // Pagination pour l'onglet "nonTraites"
  const totalPagesNonTraites = Math.ceil(devisNonArchives.length / ITEMS_PER_PAGE);
  const startIndexNonTraites = (currentPageNonTraites - 1) * ITEMS_PER_PAGE;
  const paginatedNonArchives = devisNonArchives.slice(startIndexNonTraites, startIndexNonTraites + ITEMS_PER_PAGE);

  // Pagination pour l'onglet "archives"
  const totalPagesArchives = Math.ceil(devisArchives.length / ITEMS_PER_PAGE);
  const startIndexArchives = (currentPageArchives - 1) * ITEMS_PER_PAGE;
  const paginatedArchives = devisArchives.slice(startIndexArchives, startIndexArchives + ITEMS_PER_PAGE);

  useEffect(() => {
    if (activeTab === "nonTraites" && currentPageNonTraites > totalPagesNonTraites && totalPagesNonTraites > 0) {
      setCurrentPageNonTraites(totalPagesNonTraites);
    }
    if (activeTab === "archives" && currentPageArchives > totalPagesArchives && totalPagesArchives > 0) {
      setCurrentPageArchives(totalPagesArchives);
    }
  }, [devisNonArchives, devisArchives, activeTab, totalPagesNonTraites, totalPagesArchives]);


  // Fonction pour la case à cocher "tout sélectionner"
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = activeTab === "nonTraites"
        ? paginatedNonArchives.map(d => d._id)
        : paginatedArchives.map(d => d._id);
      setSelectedDevisIds(new Set(allIds));
    } else {
      setSelectedDevisIds(new Set());
    }
  };

  // Fonction pour basculer la sélection d'une ligne
  const toggleSelect = (id: string) => {
    setSelectedDevisIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // Indique si toutes les lignes affichées sont sélectionnées
  const allSelected = activeTab === "nonTraites"
    ? devisNonArchives.length > 0 && devisNonArchives.every(d => selectedDevisIds.has(d._id))
    : devisArchives.length > 0 && devisArchives.every(d => selectedDevisIds.has(d._id));

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div
        className="bg-[#001964] w-full h-[2px] fixed"
        style={{
          top: `${navHeight}px`,
          zIndex: 99
        }}
      >
      </div>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-[80%] mt-2">
        <TabsList
          className="sticky mb-6 flex bg-[white] justify-around z-10"
          style={{ top: `${navHeight + 10}px` }}
        >
          <TabsTrigger
            value="nonTraites"
            className="bg-white data-[state=active]:bg-[#001964] data-[state=active]:text-white shadow-md text-lg w-full py-4">
            Demandes à traiter
          </TabsTrigger>
          <TabsTrigger
            value="archives"
            className="bg-white data-[state=active]:bg-[#001964] data-[state=active]:text-white shadow-md text-lg w-full py-4"
          >
            Demandes archivées
          </TabsTrigger>
        </TabsList>

        {/* ONGLET 1 : Devis à traiter */}
        <TabsContent value="nonTraites">

          <div className="my-4 md:flex justify-around items-center w-full">
            <div>
              <p className="text-xl mt-8 font-bold text-center">Demandes à traiter / en cours</p>
              <p className="text-lg text-gray-500 italic text-center">( {`${devisNonArchives.length} demandes`} )</p>
            </div>

            <div className="md:w-[50%] flex items-center justify-center">
              <input
                type="text"
                placeholder="Rechercher par nom, email, entreprise ou numéro de devis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#001964] focus:border-transparent"
              />
            </div>

            <Button
              size="sm"
              onClick={archiveSelectedDevis}
              disabled={selectedDevisIds.size === 0 || loadingAction}
              className="bg-gray-400 hover:bg-gray-500 text-sm my-2 hidden lg:flex"
            >
              <Archive className="h-4 w-4" />
              <span>Archiver la selection</span>
            </Button>
          </div>
          {loading ? (
            <p className="text-center">Chargement...</p>
          ) : (
            <>
              {/* Tableau grand écran */}
              <table className="hidden lg:table w-full border border-gray-300 shadow-lg">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="border p-2 text-left">Civilité et nom</TableHead>
                    <TableHead className="border p-2 text-left">Service</TableHead>
                    <TableHead className="border p-2 text-left">Email</TableHead>
                    <TableHead className="border p-2 text-left">Entreprise</TableHead>
                    <TableHead className="border p-2 text-center">Numéro devis</TableHead>
                    <TableHead className="border p-2 text-center">Date de création</TableHead>
                    <TableHead className="border p-2 text-center">Gestion</TableHead>
                    <TableHead className="border p-2 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <label className="flex items-center gap-1 text-sm">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            disabled={devisNonArchives.length === 0}
                          />

                        </label>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devisNonArchives.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        Aucun devis à traiter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedNonArchives.map((devis) => (
                      <TableRow key={devis._id}>
                        <TableCell className="border p-2">
                          <Link to={`/estimateDetails/${devis._id}`} className="flex">
                            {devis.civility} {devis.name}
                          </Link>
                        </TableCell>
                        <TableCell className="border p-2">
                          <Link to={`/estimateDetails/${devis._id}`} className="flex">
                            {devis.service}
                          </Link>
                        </TableCell>
                        <TableCell className="border p-2">
                          <Link to={`/estimateDetails/${devis._id}`} className="flex">
                            {devis.email}
                          </Link>
                        </TableCell>
                        <TableCell className="border p-2">
                          <Link to={`/estimateDetails/${devis._id}`} className="flex">
                            {devis.entreprise || '-'}
                          </Link>
                        </TableCell>
                        <TableCell className="border p-2 text-center">
                          <Link to={`/estimateDetails/${devis._id}`} className="flex justify-center">
                            Devis n° {devis.devisNumber || '-'}
                          </Link>
                        </TableCell>
                        <TableCell className="border p-2 text-center">
                          {devis.createdAt ? new Date(devis.createdAt).toLocaleDateString() : '-'}
                        </TableCell>

                        <TableCell className="border p-2">
                          <div className="flex justify-center">
                            {devis.inManagement ? (
                              <span className="bg-green-100 text-green-800 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                                En cours...
                              </span>
                            ) : (
                              <div className="relative group">
                                <Button
                                  type="button"
                                  onClick={() => handleManageSingleDevis(devis._id)}
                                  disabled={loadingManageId === devis._id}
                                  className="bg-[#16a085] hover:bg-[#1abc9c] text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed flex"
                                >
                                  {loadingManageId === devis._id ? (
                                    <span className="flex items-center gap-2">
                                      <span className="animate-spin">⚪</span>
                                      Chargement...
                                    </span>
                                  ) : (
                                    <Play />
                                  )}
                                </Button>
                                <span className="absolute z-[55] right-0 -translate-x-1/2 -bottom-3 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  Activer la gestion
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="border p-2 text-center">
                          <input
                            type="checkbox"
                            checked={selectedDevisIds.has(devis._id)}
                            onChange={() => toggleSelect(devis._id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </table>

              {devisNonArchives.length > ITEMS_PER_PAGE && (
                <div className="hidden lg:flex justify-center items-center gap-4 my-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPageNonTraites(p => Math.max(1, p - 1))}
                    disabled={currentPageNonTraites === 1}
                    className="px-4 py-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Précédent
                  </Button>
                  <span className="text-sm">
                    Page {currentPageNonTraites} sur {totalPagesNonTraites}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPageNonTraites(p => Math.min(totalPagesNonTraites, p + 1))}
                    disabled={currentPageNonTraites === totalPagesNonTraites}
                    className="px-4 py-2"
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Version mobile */}
              <div className="lg:hidden">
                {devisNonArchives.length !== 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center gap-4 my-4">
                      <Button
                        className="py-2 px-3 border rounded-full bg-[#bdc3c7] hover:bg-[#001964]"
                        onClick={() => setActiveColumn(prev => Math.max(0, prev - 1))}
                      >
                        <ChevronLeft />
                      </Button>
                      <span className="font-semibold">{tableHeads[activeColumn]}</span>
                      <Button
                        className="py-2 px-3 border rounded-full bg-[#bdc3c7] hover:bg-[#001964]"
                        onClick={() => setActiveColumn(prev => Math.min(tableHeads.length - 1, prev + 1))}
                      >
                        <ChevronRight />
                      </Button>
                    </div>

                    <div className="">
                      <Button
                        size="sm"
                        onClick={archiveSelectedDevis}
                        disabled={selectedDevisIds.size === 0 || loadingAction}
                        className="bg-gray-400 hover:bg-gray-500 text-xs"
                      >
                        <Archive className="relative group" />
                      </Button>
                      <span className="absolute z-[55] right-0 -translate-x-0 -top-3 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Archiver la selection
                      </span>
                    </div>
                  </div>
                )}
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="border">{tableHeads[activeColumn]}</TableHead>
                      <TableHead className="border">
                        <div className="flex flex-col items-center gap-4 mt-2">
                          <label className="text-xs my-2">
                            <input
                              type="checkbox"
                              checked={allSelected}
                              onChange={(e) => handleSelectAll(e.target.checked)}
                              disabled={devisNonArchives.length === 0}
                            />
                          </label>
                        </div>
                      </TableHead>
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
                      paginatedNonArchives.map((row) => (
                        <TableRow key={row._id}>
                          <TableCell>
                            <Link to={`/estimateDetails/${row._id}`} className="flex">
                              {switchAttribut(row) || "-"}
                            </Link>
                          </TableCell>
                          <TableCell className="border p-2 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedDevisIds.has(row._id)}
                                onChange={() => toggleSelect(row._id)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {devisNonArchives.length > ITEMS_PER_PAGE && (
                  <div className="flex justify-center items-center gap-4 my-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPageNonTraites(p => Math.max(1, p - 1))}
                      disabled={currentPageNonTraites === 1}
                      className="px-4 py-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Précédent
                    </Button>
                    <span className="text-sm">
                      Page {currentPageNonTraites} sur {totalPagesNonTraites}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPageNonTraites(p => Math.min(totalPagesNonTraites, p + 1))}
                      disabled={currentPageNonTraites === totalPagesNonTraites}
                      className="px-4 py-2"
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </TabsContent>

        {/* ONGLET 2 : Devis archivés */}
        <TabsContent value="archives">
          <div className="my-4 md:flex justify-around w-full">
            <div>
              <p className="text-xl mt-8 font-bold text-center">Demandes archivées</p>
              <p className="text-lg text-gray-500 italic text-center">( {`${devisArchives.length} demandes`} )</p>
            </div>

            <div className="md:w-[50%] my-4 flex items-center justify-center">
              <input
                type="text"
                placeholder="Rechercher par nom, email, entreprise ou numéro de devis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#001964] focus:border-transparent"
              />
            </div>

            <div className="hidden lg:flex gap-2 items-center">
              <div className="relative group">
                <Button
                  size="sm"
                  onClick={unArchiveSelectedDevis}
                  disabled={selectedDevisIds.size === 0 || loadingAction}
                  className="bg-gray-400 hover:bg-gray-500 text-sm"
                >
                  <ArchiveRestore className="h-4 w-4" />
                  <span>Désarchiver la selection</span>
                </Button>
                {/* <span className="absolute z-[55] right-0 -translate-x-0 -top-3 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Désarchiver la selection
                </span> */}
              </div>

              <div className="relative group">
                <Button
                  size="sm"
                  onClick={() => setConfirmDeleteMultiple(true)}
                  disabled={selectedDevisIds.size === 0 || loadingAction}
                  className="bg-red-400 hover:bg-red-600 text-sm"
                >
                  <Trash className="h-4 w-4" />
                  <span>Supprimer la selection</span>
                </Button>

                {/* <span className="absolute z-[55] right-0 -translate-x-0 -top-3 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Supprimer la selection
                </span> */}
              </div>
            </div>
          </div>
          {loading ? (
            <p className="text-center">Chargement...</p>
          ) : (
            <>
              {/* Tableau grand écran */}
              <Table className="hidden lg:table w-full border border-gray-300 shadow-lg">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="border p-2 text-left">Civilité et nom</TableHead>
                    <TableHead className="border p-2 text-left">Service</TableHead>
                    <TableHead className="border p-2 text-left">Email</TableHead>
                    <TableHead className="border p-2 text-left">Entreprise</TableHead>
                    <TableHead className="border p-2 text-center">Numéro devis</TableHead>
                    <TableHead className="border p-2 text-center">Date de création</TableHead>
                    <TableHead className="border p-2 text-center">
                      <div className="flex flex-col items-center gap-4">

                        <label className="flex items-center gap-1 text-sm">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            disabled={devisArchives.length === 0}
                          />

                        </label>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devisArchives.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Aucun devis archivé.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedArchives.map((devis) => (
                      <TableRow key={devis._id}>
                        <TableCell className="border p-2">
                          <Link to={`/estimateDetails/${devis._id}`} className="flex">
                            {devis.civility} {devis.name}
                          </Link>
                        </TableCell>
                        <TableCell className="border p-2">
                          <Link to={`/estimateDetails/${devis._id}`} className="flex">
                            {devis.service}
                          </Link>
                        </TableCell>
                        <TableCell className="border p-2">
                          <Link to={`/estimateDetails/${devis._id}`} className="flex">
                            {devis.email}
                          </Link>
                        </TableCell>
                        <TableCell className="border p-2">
                          <Link to={`/estimateDetails/${devis._id}`} className="flex">
                            {devis.entreprise || '-'}
                          </Link>
                        </TableCell>
                        <TableCell className="border p-2 text-center">
                          <Link to={`/estimateDetails/${devis._id}`} className="flex justify-center">
                            Devis n° {devis.devisNumber || '-'}
                          </Link>
                        </TableCell>
                        <TableCell className="border p-2 text-center">
                          {devis.createdAt ? new Date(devis.createdAt).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className="border p-2 text-center">
                          <input
                            type="checkbox"
                            checked={selectedDevisIds.has(devis._id)}
                            onChange={() => toggleSelect(devis._id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Version mobile */}
              <div className="lg:hidden">
                {devisArchives.length !== 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center gap-4 my-4">
                      <Button
                        className="py-2 px-3 border rounded-full bg-[#bdc3c7] hover:bg-[#001964]"
                        onClick={() => setActiveColumn(prev => Math.max(0, prev - 1))}
                      >
                        <ChevronLeft />
                      </Button>
                      <span className="font-semibold">{tableHeads[activeColumn]}</span>
                      <Button
                        className="py-2 px-3 border rounded-full bg-[#bdc3c7] hover:bg-[#001964]"
                        onClick={() => setActiveColumn(prev => Math.min(tableHeads.length - 1, prev + 1))}
                      >
                        <ChevronRight />
                      </Button>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        onClick={unArchiveSelectedDevis}
                        disabled={selectedDevisIds.size === 0 || loadingAction}
                        className="bg-gray-400 hover:bg-gray-500 text-xs"
                      >
                        <ArchiveRestore className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setConfirmDeleteMultiple(true)}
                        disabled={selectedDevisIds.size === 0 || loadingAction}
                        className="bg-red-400 hover:bg-red-600 text-xs"
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="border">{tableHeads[activeColumn]}</TableHead>
                      <TableHead className="border">
                        <div className="flex flex-col items-center gap-2">
                          <label className="text-xs my-2">
                            <input
                              type="checkbox"
                              checked={allSelected}
                              onChange={(e) => handleSelectAll(e.target.checked)}
                              disabled={devisArchives.length === 0}
                            />
                          </label>
                        </div>
                      </TableHead>
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
                      paginatedArchives.map((row) => (
                        <TableRow key={row._id}>
                          <TableCell>
                            <Link to={`/estimateDetails/${row._id}`} className="flex">
                              {switchAttribut(row) || "-"}
                            </Link>
                          </TableCell>
                          <TableCell className="text-center">
                            <input
                              type="checkbox"
                              checked={selectedDevisIds.has(row._id)}
                              onChange={() => toggleSelect(row._id)}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={confirmOpen || confirmDeleteMultiple}
        title={"Supprimer ce (s) devis ?"}
        description={
          confirmDeleteMultiple
            ? `Voulez-vous vraiment supprimer ${selectedDevisIds.size} devis sélectionnés ? Cette action est irréversible.`
            : "Voulez-vous vraiment supprimer ce devis ?"
        }
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={() => {
          if (confirmDeleteMultiple) {
            deleteSelectedDevis();
          } else if (selectedDevisId) {
            deleteDevis(selectedDevisId).catch(console.error);
          }
          // Réinitialiser tous les états de dialogue
          setConfirmOpen(false);
          setConfirmDeleteMultiple(false);
          setSelectedDevisId(null);
        }}
        onCancel={() => {
          setConfirmOpen(false);
          setConfirmDeleteMultiple(false);
          setSelectedDevisId(null);
        }}
      />

    </div>
  );
};

export default EstimatePage;