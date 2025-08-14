import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button.jsx';
import { Textarea } from './ui/textarea.jsx';
import { Label } from './ui/label.jsx';

const VisitedModal = ({ isOpen, onClose, country, onMarkVisited, loading }) => {
  const [observations, setObservations] = useState(country?.observacoes || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (country && observations.trim()) {
      await onMarkVisited(country.id, observations);
      onClose();
    }
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
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Marcar como Visitado
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Atualize suas informações de viagem
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
                {country.link_png && (
                  <img 
                    src={country.link_png} 
                    alt={`Bandeira de ${country.nome_comum}`}
                    className="w-16 h-12 object-cover rounded border border-border/50"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground mb-1">
                    {country.nome_comum}
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    <p>{country.capital} • {country.regiao}</p>
                    {country.populacao && (
                      <p>{(country.populacao / 1000000).toFixed(1)}M habitantes</p>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      country.visited 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-secondary/20 text-secondary'
                    }`}>
                      {country.visited ? 'Visitado' : 'Desejado'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="observations" className="text-sm font-medium text-foreground">
                    Observações da Viagem
                  </Label>
                  <Textarea
                    id="observations"
                    placeholder="Ex: Visitei este país em setembro de 2025"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    className="mt-1 min-h-[80px] resize-none"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Conte-nos sobre sua experiência neste país
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
                      Atualizando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar como Visitado
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

export default VisitedModal;

