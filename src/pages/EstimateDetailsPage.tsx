import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate, useParams } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { X, Trash2, PenLine, Send } from 'lucide-react';
import AdjustmentModal from '@/components/AdjustmentModal';

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

const EstimateDetailsPage = () => {

    const { id } = useParams();
    const [devis, setDevis] = useState<Devis | null>(null);
    const [loading, setLoading] = useState(true);
    const [isValidating, setIsValidating] = useState(false); // Nouvel état pour le chargement
    const navigate = useNavigate();

    // Nouveaux states pour la gestion de l'ajustement
    const [showAdjustment, setShowAdjustment] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [adjustmentReason, setAdjustmentReason] = useState('');
    const [adjustmentAmount, setAdjustmentAmount] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeletingAdjustment, setIsDeletingAdjustment] = useState(false); // Nouvel état pour la suppression

    // Nouvelle fonction pour supprimer l'ajustement
    const handleDeleteAdjustment = () => {
        setShowDeleteConfirm(true);
    };

    // Fonction pour confirmer la suppression
    // Fonction pour confirmer la suppression
    const confirmDelete = async () => {
        if (!devis) return;

        setIsDeletingAdjustment(true);

        try {
            const API_URL = import.meta.env.VITE_KDM_SERVER_URI;

            const response = await fetch(`${API_URL}/api/devis/${id}/adjustment`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

            const result = await response.json();

            if (response.ok) {
                // Option 1: Mettre à jour avec les données retournées par le serveur
                if (result.devis) {
                    setDevis(result.devis);
                } else {
                    // Option 2: Mettre à jour manuellement (fallback)
                    setDevis(prev => {
                        if (!prev) return null;
                        return {
                            ...prev,
                            finalAmount: '',
                            adjustmentReason: '',
                            adjustmentAmount: ''
                        };
                    });
                }

                // Réinitialiser les états locaux
                setShowAdjustment(false);
                setAdjustmentReason('');
                setAdjustmentAmount('');
                setShowDeleteConfirm(false);

                // Message de succès (optionnel)
                // toast.success("Ajustement supprimé avec succès");

            } else {
                console.error("Erreur lors de la suppression:", result.error);
                alert(result.error || "Une erreur est survenue lors de la suppression de l'ajustement.");
            }
        } catch (err) {
            console.error("Erreur réseau:", err);
            alert("Erreur de connexion au serveur.");
        } finally {
            setIsDeletingAdjustment(false);
        }
    };

    // Fonction utilitaire pour convertir stairsSize
    const formatStairsSize = (size: string) => {
        switch (size) {
            case "small":
                return "Petit";
            case "average":
                return "Moyen";
            case "wide":
                return "Large";
            default:
                return "-"; // si valeur inconnue
        }
    };

    // Fonction utilitaire pour convertir stairsSize
    const formatOffers = (offer: string) => {
        switch (offer) {
            case "economique":
                return "Économique";
            case "standard":
                return "Standard";
            case "premium":
                return "Premium";
            case "premium+":
                return "Premium +";
            default:
                return "-"; // si valeur inconnue
        }
    };

    const formatFloor = (floor: string | number | undefined) => {
        if (!floor || floor === "0" || floor === 0) return "Rez de chaussée";
        return floor;
    };

    // Fonction pour calculer le montant final
    const calculateFinalAmount = () => {
        if (devis?.finalAmount) return Number(devis.finalAmount);

        const estimated = Number(devis?.estimatedAmount) || 0;
        const adjustment = Number(adjustmentAmount) || 0;
        return estimated + adjustment;
    };

    // Fonction pour gérer la soumission du formulaire d'ajustement
    const handleAdjustmentSubmit = (reason: string, amount: string) => {
        setAdjustmentReason(reason);
        setAdjustmentAmount(amount);
        setShowAdjustment(true);
        setShowModal(false);
    };

    // Fonction pour annuler l'ajustement
    const handleAdjustmentCancel = () => {
        setShowModal(false);
    };

    // Nouvelle fonction pour valider le devis
    const handleValidate = async () => {
        if (!devis) return;

        setIsValidating(true);

        try {
            const finalAmount = calculateFinalAmount();
            const API_URL = import.meta.env.VITE_KDM_SERVER_URI;

            const response = await fetch(`${API_URL}/api/devis/${id}/adjustment`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    finalAmount: finalAmount.toFixed(2),
                    adjustmentReason: adjustmentReason,
                    adjustmentAmount: adjustmentAmount
                })
            });

            if (response.ok) {
                // Redirection vers la page précédente (liste des devis)
                navigate(-1);
                // Ou vers une page spécifique comme "/estimates"
                // navigate("/estimates");
            } else {
                const error = await response.json();
                console.error("Erreur lors de la validation:", error);
                alert("Une erreur est survenue lors de la validation du devis.");
            }
        } catch (err) {
            console.error("Erreur réseau:", err);
            alert("Erreur de connexion au serveur.");
        } finally {
            setIsValidating(false);
        }
    };

    useEffect(() => {
        const fetchDevis = async () => {
            try {
                const API_URL = import.meta.env.VITE_KDM_SERVER_URI;
                const res = await fetch(`${API_URL}/api/devis/${id}`);
                const data = await res.json();

                if (res.ok) {
                    setDevis(data);  // 1. On met d'abord à jour devis

                    // 2. On utilise DATA (pas devis) pour les valeurs
                    console.log(data.adjustmentReason);
                    if (data.adjustmentReason && data.adjustmentReason !== "") {
                        setAdjustmentReason(data.adjustmentReason);
                    }

                    console.log(data.adjustmentAmount);
                    if (data.adjustmentAmount && data.adjustmentAmount !== "") {
                        setAdjustmentAmount(data.adjustmentAmount);
                        setShowAdjustment(true);
                    }
                } else {
                    console.error("Erreur :", data);
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDevis();
    }, [id]);

    if (loading) return <p className="text-center w-full">Chargement...</p>;
    if (!devis) return <p>Devis introuvable.</p>;

    return (
        <div className="flex flex-col justify-center items-center min-h-screen p-4">

            <div className="flex justify-end w-[80%]">
                <Button onClick={() => navigate(-1)} className="bg-gray-400 hover:bg-gray-500">
                    <X className="h-6 w-6" />
                </Button>
            </div>

            <h2 className="text-3xl font-bold text-[#001964] pt-8">
                Détail de la demande de devis n° {devis.devisNumber}
            </h2>

            <p className="text-xl font-bold">

            </p>

            <div className="w-[80%] mx-auto">
                <section className="py-8 lg:py-16 px-4 sm:px-8 lg:px-16">
                    <Card className="shadow-lg">
                        {/* <CardHeader>
                            <CardTitle className="text-xl lg:text-2xl text-[#001964]">Demande de devis</CardTitle>
                            <CardDescription className="text-lg italic">
                                --
                            </CardDescription>
                        </CardHeader> */}
                        <CardContent>
                            <div className="space-y-4 lg:space-y-6">
                                <div className="px-8">
                                    <div className="grid grid-cols-1 gap-3 lg:gap-4 border-b-2 mt-4">
                                        <h4 className="text-xl font-bold text-[#001964]">Informations client</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                        <div className="flex items-center h-12">
                                            <p className="text-lg font-bold me-8">Civilité et nom :</p>
                                            <span>{devis.civility} {devis.name}</span>
                                        </div>

                                        <div className="flex items-center h-12">
                                            <p className="text-lg font-bold me-8">Email :</p>
                                            <span>{devis.email}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                        <div className="flex items-center h-12">
                                            <p className="text-lg font-bold me-8">Entreprise :</p>
                                            <span>{devis.entreprise || "-"}</span>
                                        </div>

                                        <div className="flex items-center h-12">
                                            <p className="text-lg font-bold me-8">Adresse de facturation :</p>
                                            <span>{devis.billingAddress}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                        <div className="flex items-center h-12">
                                            <p className="text-lg font-bold me-8">Téléphone :</p>
                                            <span>{devis.telephone || "-"}</span>
                                        </div>

                                        <div className="flex items-center h-12">
                                            <p className="text-lg font-bold me-8">Service : </p>
                                            <span>{devis.service}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                        <div className="flex items-center h-12">
                                            <p className="text-lg font-bold me-8">Date :</p>
                                            <span>{devis.date || "-"}</span>
                                        </div>

                                        <div className="flex items-center h-12">
                                            <p className="text-lg font-bold me-8">Formule :</p>
                                            <span>{formatOffers(devis.offer)}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 h-2"></div>

                                    <div className="grid grid-cols-1 gap-3 lg:gap-4 border-b-2 mt-4">
                                        <h4 className="text-xl font-bold text-[#001964]">Informations au départ</h4>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                        <div className="flex items-center h-12">
                                            <p className="text-lg font-bold me-8">Surface : </p>
                                            <span>{devis.departure.surface} m2</span>
                                        </div>

                                        {devis.service == "transport" && (
                                            <div className="flex items-center h-12">
                                                <p className="text-lg font-bold me-8">Volume : </p>
                                                <span>{devis.departure.volume || ""} m3</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                        <div className="flex items-center h-12">
                                            <p className="text-lg font-bold me-8">Nombre de pièces : </p>
                                            <span>{devis.departure.rooms}</span>
                                        </div>

                                        <div className="flex items-center h-12">
                                            <p className="text-lg font-bold me-8">Numéro d'étage :</p>
                                            <span>{formatFloor(devis.departure.floor)}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                        <div className="flex items-center h-12">
                                            <p className="text-lg font-bold me-8">Ascenceur : </p>
                                            <span>{devis.departure.elevator ? "Oui" : "Non"}</span>
                                        </div>

                                        <div className="flex items-center h-12">
                                            <p className="text-lg font-bold me-8">Taille de l'ascenceur :</p>
                                            <span>{devis.departure.elevatorSize || ""} personnes</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                        <div className="flex items-center h-12">
                                            <p className="text-lg font-bold me-8">Taille de l'escalier : </p>
                                            <span>{formatStairsSize(devis.departure.stairsSize)}</span>
                                        </div>

                                        <div className="flex items-center h-12">
                                            <p className="text-lg font-bold me-8">Adresse :</p>
                                            <span>{devis.departure.address}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 h-2"></div>

                                    <div className="grid grid-cols-1 gap-3 lg:gap-4 border-b-2 mt-4">
                                        <h4 className="text-xl font-bold text-[#001964]">Informations à l'arrivée</h4>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                        <div className="flex items-center h-12">
                                            <p className="text-lg font-bold me-8">Numéro d'étage :</p>
                                            <span>{formatFloor(devis.arrival.floor)}</span>
                                        </div>

                                        <div className="flex items-center h-12">
                                            <p className="text-lg font-bold me-8">Ascenceur : </p>
                                            <span>{devis.arrival.elevator ? "Oui" : "Non"}</span>
                                        </div>

                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                        <div className="flex items-center h-12">
                                            <p className="text-lg font-bold me-8">Taille de l'ascenceur :</p>
                                            <span>{devis.arrival.elevatorSize || ""} personnes</span>
                                        </div>

                                        <div className="flex items-center h-12">
                                            <p className="text-lg font-bold me-8">Taille de l'escalier : </p>
                                            <span>{formatStairsSize(devis.arrival.stairsSize)}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                        <div className="flex items-center h-12">
                                            <p className="text-lg font-bold me-8">Adresse :</p>
                                            <span>{devis.arrival.address}</span>
                                        </div>

                                        {devis.service == "transport" && (
                                            <div className="flex items-center h-12">
                                                <p className="text-lg font-bold me-8">Civilité et nom du contact :</p>
                                                <span>{devis.arrival.contactCivility} {devis.arrival.contactName || "-"}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                        <div className="flex items-center h-12">
                                            <p className="text-lg font-bold me-8">Entreprise : </p>
                                            <span>{devis.arrival.entreprise || "-"}</span>
                                        </div>
                                        {devis.service == "transport" && (
                                            <div className="flex items-center h-12">
                                                <p className="text-lg font-bold me-8">Date :</p>
                                                <span>{devis.arrival.date || "-"}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 h-2"></div>

                                    <div className="grid grid-cols-1 gap-3 lg:gap-4 border-b-2 mt-4">
                                        <h4 className="text-xl font-bold text-[#001964]">Informations supplémentaires</h4>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 lg:gap-4">
                                        <div className="flex items-center">
                                            <span>{devis.message || "-"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION AJUSTEMENT - Conditionnellement affichée */}
                                {(showAdjustment || devis.adjustmentAmount !== "") && (
                                    <>
                                        <div className="grid grid-cols-1 gap-3 lg:gap-4 border border-[#001964]">
                                            <h4 className="text-3xl font-bold text-[#001964] text-center">Ajustement du montant du devis</h4>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 h-12">
                                            <div className="flex items-center h-2">
                                                <p className="text-lg font-bold me-8 text-[#001964]">Motif : </p>
                                                <span className="text-[#001964]">{(devis.adjustmentReason && devis.adjustmentReason !== "") ? devis.adjustmentReason : adjustmentReason}</span>
                                            </div>

                                            <div className="flex items-center h-2">
                                                <p className="text-lg font-bold me-8 text-[#001964]">Montant du supplément :</p>
                                                <span className="text-[#001964]">{(devis.adjustmentAmount && devis.adjustmentAmount !== "") ? devis.adjustmentAmount : adjustmentAmount} €</span>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                    <div>
                                        <div>
                                            <div className="flex items-center text-lg">
                                                <p className="me-8">Distance estimée :</p>
                                                <span>{devis.distance || ""}</span>
                                            </div>
                                            <div className="flex items-center text-lg">
                                                <p className="me-8">Durée estimée :</p>
                                                <span>{devis.duration || ""}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center h-12 text-2xl font-bold text-[#001964]">
                                            <p className="me-8">Montant estimé du devis :</p>
                                            {devis.finalAmount !== "" ? (
                                                <span>{devis.finalAmount} €</span>
                                            ) : (
                                                <span>{(Number(devis.estimatedAmount) + Number(adjustmentAmount)).toFixed(2) || 0} €</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center h-12 justify-end">
                                        {(showAdjustment || devis.adjustmentAmount) ? (
                                            // Si un ajustement existe, afficher le bouton Supprimer
                                            <Button
                                                className="bg-red-500 hover:bg-red-600 text-white me-4"
                                                onClick={handleDeleteAdjustment}
                                                disabled={isDeletingAdjustment || devis.archived}
                                            >
                                                {isDeletingAdjustment ? (
                                                    "Suppression..."
                                                ) : (
                                                    <>
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Supprimer l'ajustement
                                                    </>
                                                )}
                                            </Button>
                                        ) : (
                                            // Sinon, afficher le bouton Modifier
                                            <Button
                                                className="me-4"
                                                variant="outline"
                                                onClick={() => setShowModal(true)}
                                                disabled={devis.archived}
                                            >
                                                <PenLine className="h-4 w-4 mr-1" />
                                                Modifier le devis
                                            </Button>
                                        )}
                                        <Button
                                            className="bg-[#16a085] hover:bg-[#1abc9c]"
                                            variant="destructive"
                                            onClick={handleValidate}
                                            disabled={isValidating || devis.archived}
                                        >
                                            {isValidating ? "Validation en cours..." : (
                                                <>
                                                    <Send className="h-4 w-4 mr-1" />
                                                    <span>Valider le devis</span>
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
            {/* Modal d'ajustement */}
            <AdjustmentModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleAdjustmentSubmit}
                onCancel={handleAdjustmentCancel}
            />

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md">
                        <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
                        <p className="mb-6">Êtes-vous sûr de vouloir supprimer cet ajustement ?</p>
                        <div className="flex justify-end space-x-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Annuler
                            </Button>
                            <Button
                                className="bg-red-500 hover:bg-red-600"
                                onClick={confirmDelete}
                            >
                                Supprimer
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EstimateDetailsPage;
