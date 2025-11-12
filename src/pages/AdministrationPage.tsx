import { Button } from '@/components/ui/button';
import { LogOut, UserRoundPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';


const AdministrationPage = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Supprime le token
        localStorage.removeItem('userLogin'); // Supprime le login
        navigate('/'); // Retour à la page de login
    };

    return (
        <div className="flex flex-col justify-center items-center h-[100vh]">
            <div className="w-[55%] flex">
                <Button type="button" onClick={handleLogout} className="bg-[#001964] hover:bg-[#001964]/90 text-sm lg:text-base m-8" size="lg">
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                </Button>
            </div>

            <h2 className="text-4xl font-bold text-[#001964] underline text-center">
                Interface d'administration
            </h2>

            <div className="mt-8">
                <Link to="/register" className="text-[#001964] font-semibold text-2xl flex items-center">
                    <UserRoundPlus className="mr-4 h-6 w-6" />
                    Ajouter un gestionnaire
                </Link>
            </div>
        </div>
    )
}

export default AdministrationPage