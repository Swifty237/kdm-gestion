import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AdjustmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string, amount: string) => void;
    onCancel: () => void;
}

const AdjustmentModal = ({ isOpen, onClose, onSubmit, onCancel }: AdjustmentModalProps) => {
    const [reason, setReason] = useState('');
    const [amount, setAmount] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(reason, amount);
        // Réinitialiser les champs
        setReason('');
        setAmount('');
    };

    const handleCancel = () => {
        onCancel();
        // Réinitialiser les champs
        setReason('');
        setAmount('');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                {/* Bouton de fermeture */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-2xl font-bold text-[#001964] mb-6">
                    Ajuster le montant du devis
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="reason"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Motif
                        </label>
                        <input
                            type="text"
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001964]"
                            placeholder="Ex: Frais de péage, supplément étage..."
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="amount"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Montant du supplément (€)
                        </label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001964]"
                            placeholder="Ex: 50"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#001964] hover:bg-[#002080] text-white"
                        >
                            Valider l'ajustement
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdjustmentModal;