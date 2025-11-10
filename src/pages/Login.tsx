import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

// import { useToast } from '@/hooks/use-toast';

const Accueil = () => {
  // const { toast } = useToast();

  return (
    <div className="flex flex-col justify-center items-center h-[100vh]">

      <div className="text-center mb-12 lg:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-[#001964] mb-4 lg:mb-6">
          Interface de gestion
        </h2>
      </div>

      {/* Command Process Section */}
      <section className="py-8 lg:py-16 px-4 sm:px-8 lg:px-16 mb-8 lg:mb-16 w-full">
        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Side - Content */}
            <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
              <div className="grid grid-cols-1 gap-3 lg:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="identifiant" className="text-xl font-bold">Identifiant </Label>
                  <Input
                    id="identifiant"
                    name="identifiant"
                    type="text"
                    // value={devisData.entreprise}
                    // onChange={handleInputChange}
                    placeholder="Entrez votre identifiant"
                    className="text-xl lg:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xl font-bold">Mot de passe</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    // value={devisData.telephone}
                    // onChange={handleInputChange}
                    placeholder="Entrez votre mot de passe"
                    className="text-xl lg:text-base"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#001964] hover:bg-[#001964]/90 text-xl" size="lg">
                <Send className="mr-2 h-4 w-4" />
                Connexion
              </Button>
            </div>

            {/* Right Side - Large Text */}
            <div className="order-1 lg:order-2 flex justify-center">

              {/* Logo */}
              <Link to="/" className="flex items-center">
                <img
                  src="/img/Logo.png"
                  alt="KDM Logo"
                  className=""
                />
              </Link>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Accueil;
