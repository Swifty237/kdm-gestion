import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, useParams } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Devis {
    _id: string;
    name: string;
    email: string;
    entreprise?: string;
    telephone?: string;
    service: string;
    offer: string;
    billingAddress: string;
    devisNumber: string;
    message: string;
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

const EstimateDetailsPage = () => {

    const { id } = useParams();
    const [devis, setDevis] = useState<Devis | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchDevis = async () => {
            try {
                const API_URL = import.meta.env.VITE_KDM_SERVER_URI;
                const res = await fetch(`${API_URL}/api/devis/${id}`);
                const data = await res.json();

                if (res.ok) setDevis(data);
                else console.error("Erreur :", data);
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
                        <CardHeader>
                            <CardTitle className="text-xl lg:text-2xl text-[#001964]">Demande de devis</CardTitle>
                            <CardDescription className="text-lg italic">
                                --
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 lg:space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                    <div className="flex items-center h-12">
                                        <p className="text-lg font-bold me-8">Nom complet :</p>
                                        <span>{devis.name}</span>
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

                                <div className="grid grid-cols-1 gap-3 lg:gap-4 border-b-2 ">
                                    <h4 className="text-xl font-bold">Informations au départ</h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                    <div className="flex items-center h-12">
                                        <p className="text-lg font-bold me-8">Surface : </p>
                                        <span>{devis.departure.surface}</span>
                                    </div>

                                    <div className="flex items-center h-12">
                                        <p className="text-lg font-bold me-8">Volume : </p>
                                        <span>{devis.departure.volume || "-"}</span>
                                    </div>
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
                                        <span>{devis.departure.elevatorSize || "-"}</span>
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

                                <div className="grid grid-cols-1 gap-3 lg:gap-4 border-b-2">
                                    <h4 className="text-xl font-bold">Informations à l'arrivée</h4>
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
                                        <span>{devis.arrival.elevatorSize || "-"}</span>
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

                                    <div className="flex items-center h-12">
                                        <p className="text-lg font-bold me-8">Nom du contact à l'arrivée :</p>
                                        <span>{devis.arrival.contactName || "-"}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                    <div className="flex items-center h-12">
                                        <p className="text-lg font-bold me-8">Entreprise : </p>
                                        <span>{devis.arrival.entreprise || "-"}</span>
                                    </div>

                                    <div className="flex items-center h-12">
                                        <p className="text-lg font-bold me-8">Date :</p>
                                        <span>{devis.arrival.date || "-"}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 h-2"></div>

                                <div className="grid grid-cols-1 gap-3 lg:gap-4 border-b-2">
                                    <h4 className="text-xl font-bold">Informations supplémentaires</h4>
                                </div>

                                <div className="grid grid-cols-1 gap-3 lg:gap-4">
                                    <div className="flex items-center h-12">
                                        <span>{devis.message || "-"}</span>
                                    </div>


                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
};

export default EstimateDetailsPage;
