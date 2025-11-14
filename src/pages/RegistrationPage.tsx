import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const RegistrationPage = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        userName: '',
        userFirstname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (credentials.password !== credentials.confirmPassword) {
            alert("Les mots de passe ne correspondent pas !");
            return;
        }

        setLoading(true);
        const API_URL = import.meta.env.VITE_KDM_SERVER_URI;

        try {
            const response = await fetch(`${API_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: credentials.userName,
                    userFirstname: credentials.userFirstname,
                    email: credentials.email,
                    password: credentials.password
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast({
                    title: "Utilisateur créé avec succès",
                    description: "Vous pouvez maintenant lui transmettre ses identifiants de connexion.",
                });

                // Réinitialise les champs
                setCredentials({ userName: '', userFirstname: '', email: '', password: '', confirmPassword: '' });

                // Redirige vers la page de login
                navigate('/administration');
            } else {
                alert('Erreur : ' + (result.error || 'Impossible de créer le compte'));
            }
        } catch (err) {
            console.error(err);
            alert("Erreur réseau lors de la création du compte.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-[100vh]">

            {/* <div className="w-[55%] flex">
                
            </div> */}

            <section className="py-8 lg:py-16 px-4 sm:px-8 lg:px-16 mb-8 lg:mb-16 w-full">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                        <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-3 lg:gap-4">

                                    <p className="text-3xl font-bold text-[#001964]">
                                        Création d'un nouveau gestionnaire
                                    </p>

                                    <span className="italic text-xl"> Remplissez le formulaire avec les informations du nouveau gestionnaire et valider</span>

                                    <div className="space-y-2">
                                        <Label htmlFor="userName" className="text-xl font-bold">Nom</Label>
                                        <Input
                                            id="userName"
                                            name="userName"
                                            type="text"
                                            value={credentials.userName}
                                            onChange={handleInputChange}
                                            placeholder="Entrez le nom"
                                            className="text-xl lg:text-base"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="userFirstname" className="text-xl font-bold">Prénom</Label>
                                        <Input
                                            id="userFirstname"
                                            name="userFirstname"
                                            type="text"
                                            value={credentials.userFirstname}
                                            onChange={handleInputChange}
                                            placeholder="Entrez le prénom"
                                            className="text-xl lg:text-base"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-xl font-bold">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={credentials.email}
                                            onChange={handleInputChange}
                                            placeholder="Entrez l'email"
                                            className="text-xl lg:text-base"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-xl font-bold">Mot de passe</Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={credentials.password}
                                            onChange={handleInputChange}
                                            placeholder="Entrez le mot de passe"
                                            className="text-xl lg:text-base"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-xl font-bold">Confirmez le mot de passe</Label>
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            value={credentials.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="Confirmez votre mot de passe"
                                            className="text-xl lg:text-base"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#001964] hover:bg-[#001964]/90 text-xl mt-8"
                                    size="lg"
                                >
                                    {loading ? 'Création...' : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Valider
                                        </>
                                    )}
                                </Button>

                                {/* <p className="mt-4 text-center">
                                    Déjà un compte ?{" "}
                                    <Link to="/" className="text-[#001964] underline font-semibold">
                                        Se connecter
                                    </Link>
                                </p> */}
                            </form>
                        </div>

                        <div className="order-1 lg:order-2 flex justify-center">
                            <div className="flex items-center">
                                <img src="/img/Logo.png" alt="KDM Logo" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RegistrationPage;
