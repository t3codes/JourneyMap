import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Plus, Loader2 } from 'lucide-react';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Textarea } from './ui/textarea.jsx';
import { Label } from './ui/label.jsx';

const AddCountryModal = ({ isOpen, onClose, country, onAddCountry, loading }) => {
  const [observations, setObservations] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (country && observations.trim()) {
      await onAddCountry(country.nome_comum, observations);
      setObservations('');
      onClose();
    }
  };

  const formatPopulation = (population) => {
    if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)}M`;
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(1)}K`;
    }
    return population?.toLocaleString() || 'N/A';
  };

  if (!country) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md mx-4 bg-card border border-border rounded-lg shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Adicionar à Lista
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Adicione este país à sua lista de viagens
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Country Info */}
            <div className="p-6 border-b border-border">
              <div className="flex items-start gap-4">
                {country.bandeiras?.png && (
                  <img 
                    src={country.bandeiras.png} 
                    alt={`Bandeira de ${country.nome_comum}`}
                    className="w-16 h-12 object-cover rounded border border-border/50"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground mb-1">
                    {country.nome_comum}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {country.nome_oficial}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium">Capital:</span> {country.capital}
                    </div>
                    <div>
                      <span className="font-medium">Região:</span> {country.regiao}
                    </div>
                    <div>
                      <span className="font-medium">População:</span> {formatPopulation(country.populacao)}
                    </div>
                    <div>
                      <span className="font-medium">Moeda:</span> {country.moeda}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="observations" className="text-sm font-medium text-foreground">
                    Observações
                  </Label>
                  <Textarea
                    id="observations"
                    placeholder="Ex: Planejo visitar em 2026 para o carnaval"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    className="mt-1 min-h-[80px] resize-none"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Adicione uma nota sobre seus planos para este país
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading || !observations.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adicionando...
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4 mr-2" />
                      Adicionar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddCountryModal;

