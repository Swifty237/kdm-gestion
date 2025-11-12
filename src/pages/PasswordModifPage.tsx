import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MoveLeft, Send } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const PasswordModifPage = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        login: '',
        password: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (credentials.newPassword !== credentials.confirmNewPassword) {
            alert("Les mots de passe ne correspondent pas !");
            return;
        }

        setLoading(true);
        const API_URL = import.meta.env.VITE_KDM_SERVER_URI;

        try {
            const response = await fetch(`${API_URL}/api/passwordModif`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    login: credentials.login,
                    password: credentials.password,
                    newPassword: credentials.newPassword
                }),
            });

            const result = await response.json();

            if (response.ok) {

                toast({
                    title: "Mot de passe modifié avec succès",
                    description: "Vous pouvez maintenant vous reconnecter avec votre nouveau mot de passe.",
                });

                // Réinitialise les champs
                setCredentials({ login: '', password: '', newPassword: '', confirmNewPassword: '' });

                // Redirige vers la page de login
                navigate('/estimate');
            } else {
                alert('Erreur : ' + (result.error || 'Impossible de modifier le mot de passe'));
            }
        } catch (err) {
            console.error(err);
            alert("Erreur réseau lors de la modification du mot de passe");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-[100vh]">

            <div className="w-[55%] flex">
                <Link to="/estimate" className="text-[#001964] underline font-semibold w-[3em]">
                    <MoveLeft className="mr-2 h-8 w-8" />
                </Link>
            </div>

            <h2 className="text-4xl font-bold text-[#001964] underline text-center">
                Interface de gestion
            </h2>

            <section className="py-8 lg:py-16 px-4 sm:px-8 lg:px-16 mb-8 lg:mb-16 w-full">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                        <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-3 lg:gap-4">

                                    <p className="text-2xl font-bold text-[#001964]">
                                        Création du nouveau mot de passe
                                    </p>

                                    <div className="space-y-2">
                                        <Label htmlFor="login" className="text-xl font-bold">Identifiant</Label>
                                        <Input
                                            id="login"
                                            name="login"
                                            type="text"
                                            value={credentials.login}
                                            onChange={handleInputChange}
                                            placeholder="Entrez votre identifiant"
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
                                            placeholder="Entrez votre mot de passe actuel"
                                            className="text-xl lg:text-base"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword" className="text-xl font-bold">Nouveau mot de passe</Label>
                                        <Input
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            value={credentials.newPassword}
                                            onChange={handleInputChange}
                                            placeholder="Entrez le nouveau mot de passe"
                                            className="text-xl lg:text-base"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmNewPassword" className="text-xl font-bold">Confirmez le nouveau mot de passe</Label>
                                        <Input
                                            id="confirmNewPassword"
                                            name="confirmNewPassword"
                                            type="password"
                                            value={credentials.confirmNewPassword}
                                            onChange={handleInputChange}
                                            placeholder="Confirmez le nouveau mot de passe"
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

export default PasswordModifPage;
