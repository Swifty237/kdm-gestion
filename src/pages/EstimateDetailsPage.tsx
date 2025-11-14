import { Button } from '@/components/ui/button';
import { LogOut, UserCog } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from "react-router-dom";

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

const EstimateDetailsPage = () => {
    const navigate = useNavigate();

    const { id } = useParams();
    const [devis, setDevis] = useState<Devis | null>(null);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
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

    if (loading) return <p>Chargement...</p>;
    if (!devis) return <p>Devis introuvable.</p>;

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

            <p className="text-xl font-bold">
                Détail de la demande de devis n° ----
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
                                        <p className="text-lg font-bold me-8">Nom complet : </p>
                                        <span>{devis.name}</span>
                                    </div>

                                    <div className="flex items-center h-12">
                                        <p className="text-lg font-bold me-8">Email</p>
                                        <span>{devis.email}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                    <div className="flex items-center h-12">
                                        <p className="text-lg font-bold me-8">Entreprise </p>
                                        <span>{devis.entreprise || "-"}</span>
                                    </div>
                                    <div className="flex items-center h-12">
                                        <p className="text-lg font-bold me-8">Téléphone</p>
                                        <span>{devis.telephone || "-"}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                    <div className="flex items-center h-12">
                                        <p className="text-lg font-bold me-8">Service : </p>
                                        <span>{devis.service}</span>
                                    </div>

                                    <div className="flex items-center h-12">
                                        <p className="text-lg font-bold me-8">Date</p>
                                        <span>{devis.date || "-"}</span>
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
                                        <p className="text-lg font-bold me-8">Numéro d'étage</p>
                                        <span>{formatFloor(devis.departure.floor)}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                    <div className="flex items-center h-12">
                                        <p className="text-lg font-bold me-8">Ascenceur : </p>
                                        <span>{devis.departure.elevator ? "Oui" : "Non"}</span>
                                    </div>

                                    <div className="flex items-center h-12">
                                        <p className="text-lg font-bold me-8">Taille de l'ascenceur</p>
                                        <span>{devis.departure.elevatorSize || "-"}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                    <div className="flex items-center h-12">
                                        <p className="text-lg font-bold me-8">Taille de l'escalier : </p>
                                        <span>{formatStairsSize(devis.departure.stairsSize)}</span>
                                    </div>

                                    <div className="flex items-center h-12">
                                        <p className="text-lg font-bold me-8">Adresse</p>
                                        <span>{devis.departure.address}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 h-2"></div>

                                <div className="grid grid-cols-1 gap-3 lg:gap-4 border-b-2">
                                    <h4 className="text-xl font-bold">Informations à l'arrivée</h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                    <div className="flex items-center h-12">
                                        <p className="text-lg font-bold me-8">Numéro d'étage</p>
                                        <span>{formatFloor(devis.arrival.floor)}</span>
                                    </div>

                                    <div className="flex items-center h-12">
                                        <p className="text-lg font-bold me-8">Ascenceur : </p>
                                        <span>{devis.arrival.elevator ? "Oui" : "Non"}</span>
                                    </div>

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                    <div className="flex items-center h-12">
                                        <p className="text-lg font-bold me-8">Taille de l'ascenceur</p>
                                        <span>{devis.arrival.elevatorSize || "-"}</span>
                                    </div>

                                    <div className="flex items-center h-12">
                                        <p className="text-lg font-bold me-8">Taille de l'escalier : </p>
                                        <span>{formatStairsSize(devis.arrival.stairsSize)}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                    <div className="flex items-center h-12">
                                        <p className="text-lg font-bold me-8">Adresse</p>
                                        <span>{devis.arrival.address}</span>
                                    </div>

                                    <div className="flex items-center h-12">
                                        <p className="text-lg font-bold me-8">Nom du contact à l'arrivée</p>
                                        <span>{devis.arrival.contactName || "-"}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                    <div className="flex items-center h-12">
                                        <p className="text-lg font-bold me-8">Entreprise : </p>
                                        <span>{devis.arrival.entreprise || "-"}</span>
                                    </div>

                                    <div className="flex items-center h-12">
                                        <p className="text-lg font-bold me-8">Date</p>
                                        <span>{devis.arrival.date || "-"}</span>
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
