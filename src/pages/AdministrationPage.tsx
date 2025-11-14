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
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);


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
        <div className="flex flex-col items-center min-h-screen pt-16">
            <h2 className="text-4xl font-bold text-[#001964] underline text-center mb-8">
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
        </div>
    );
};

export default AdministrationPage;
