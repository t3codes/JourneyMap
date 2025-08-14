import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const CustomAlert = ({ 
  isOpen, 
  onClose, 
  type = 'success', 
  title, 
  message, 
  autoClose = true, 
  duration = 2000 
}) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-primary" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-destructive" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      default:
        return <CheckCircle className="w-6 h-6 text-primary" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-primary/50';
      case 'error':
        return 'border-destructive/50';
      case 'warning':
        return 'border-yellow-500/50';
      default:
        return 'border-primary/50';
    }
  };

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
          
          {/* Alert */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 
                       glass rounded-lg p-6 min-w-[300px] max-w-md border ${getBorderColor()}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {getIcon()}
              </div>
              
              <div className="flex-1">
                {title && (
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {title}
                  </h3>
                )}
                {message && (
                  <p className="text-muted-foreground">
                    {message}
                  </p>
                )}
              </div>
              
              {!autoClose && (
                <button
                  onClick={onClose}
                  className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {autoClose && (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-1 bg-primary rounded-b-lg`}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomAlert;

