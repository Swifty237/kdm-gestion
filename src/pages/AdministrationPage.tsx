import { Button } from '@/components/ui/button';
import { LogOut, UserRoundPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


interface User {
    _id: string;
    userName: string;
    userFirstname: string;
    email: string;
    login: string;
    createdAt: string;
}

const AdministrationPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userLogin');
        navigate('/');
    };

    useEffect(() => {
        const fetchUsers = async () => {
            const API_URL = import.meta.env.VITE_KDM_SERVER_URI;
            try {
                const res = await fetch(`${API_URL}/api/users`);
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error("Erreur lors de la récupération des utilisateurs :", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

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

            <div className="mt-8 w-[80%] shadow-lg">
                {loading ? (
                    <p>Chargement des gestionnaires...</p>
                ) : users.length === 0 ? (
                    <p>Aucun gestionnaire trouvé.</p>
                ) : (
                    <Table className="w-full border-collapse border border-gray-300">
                        <TableHeader>
                            <TableRow className="bg-gray-100">
                                <TableHead className="border border-gray-300 p-2">Nom</TableHead>
                                <TableHead className="border border-gray-300 p-2">Prénom</TableHead>
                                <TableHead className="border border-gray-300 p-2">Email</TableHead>
                                <TableHead className="border border-gray-300 p-2">Login</TableHead>
                                <TableHead className="border border-gray-300 p-2">Créé le</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user._id}>
                                    <TableCell className="border border-gray-300 p-2">{user.userName}</TableCell>
                                    <TableCell className="border border-gray-300 p-2">{user.userFirstname}</TableCell>
                                    <TableCell className="border border-gray-300 p-2">{user.email}</TableCell>
                                    <TableCell className="border border-gray-300 p-2">{user.login}</TableCell>
                                    <TableCell className="border border-gray-300 p-2">{new Date(user.createdAt).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <div className="mt-8">
                <Link to="/register" className="text-[#001964] font-semibold text-2xl flex items-center">
                    <UserRoundPlus className="mr-4 h-6 w-6" />
                    Ajouter un gestionnaire
                </Link>
            </div>
        </div>
    );
};

export default AdministrationPage;
