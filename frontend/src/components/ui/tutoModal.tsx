import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './button';

const TutorialModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 
                       bg-white rounded-lg p-6 min-w-[300px] max-w-md border border-gray-200 shadow-lg"
          >
            <div className="flex flex-col gap-4">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-black">Bem-vindo ao Travel Map!</h3>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Content */}
              <div className="text-black text-sm">
                <p className="mb-2">
                  Aqui você pode planejar suas aventuras pelo mundo! Veja como usar o site:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Lista de interesses</strong>: No menu lateral à esquerda, veja os países que você marcou como visitados ou que deseja visitar.
                  </li>
                  <li>
                    <strong>Adicionar países</strong>: Clique em um país no mapa e selecione "Adicionar à Lista" para incluir na sua lista de desejos.
                  </li>
                  <li>
                    <strong>Visualizar imagens</strong>: Clique no botão correspondente em um país para ver fotos no Google Maps.
                  </li>
                  <li>
                    <strong>Outras ações</strong>: Use o botão "Atualizar" pra recarregar os dados ou "Sair" pra deslogar.
                  </li>
                </ul>
              </div>
              
              {/* Button */}
              <Button
                onClick={onClose}
                className="bg-primary hover:bg-primary/90 text-white mt-4"
              >
                Entendi
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TutorialModal;