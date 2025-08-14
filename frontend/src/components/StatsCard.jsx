import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle, Heart, Globe } from 'lucide-react';

const StatsCard = ({ stats, loading }) => {
  const te = "ola mundo"; // Variável não usada, mantida para consistência
  const cards = [
    {
      title: 'Visitados',
      value: stats.visited,
      icon: CheckCircle,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Desejados',
      value: stats.desired,
      icon: Heart,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      title: 'Total',
      value: stats.total,
      icon: Globe,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-2 mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-muted/20 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2 mb-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50 hover:bg-card/80 transition-colors"
          >
            <div className={`${card.bgColor} p-2 rounded-md`}>
              <Icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className="flex-1 min-w-0 text-center">
              <p className="text-xs text-muted-foreground">{card.title}</p>
              <p className="text-lg font-semibold text-foreground">{card.value}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsCard;