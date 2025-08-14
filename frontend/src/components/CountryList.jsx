import React from 'react';
import { Button } from './ui/button.jsx';
import { Trash2, CheckCircle, Clock } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

const CountryList = ({ countries, onCountryClick, onRemoveCountry, onMarkVisited, loading }) => {
  const formatPopulation = (population) => {
    if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)}M`;
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(1)}K`;
    }
    return population?.toLocaleString() || 'N/A';
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando lista...</p>
      </div>
    );
  }

  if (!countries || countries.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        <p>Nenhum país adicionado à sua lista.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold text-foreground mb-4">Meus Países</h3>
      <ul className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
        {countries.map((country) => (
          <Tooltip.Provider key={country.id || country.nome_comum}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <li
                  className="flex items-center justify-between p-2 bg-card rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => onCountryClick(country.nome_comum)}
                  >
                    <img
                      src={country.link_png}
                      alt={`Bandeira de ${country.nome_comum}`}
                      className="w-6 h-4 object-cover rounded-sm"
                    />
                    <span className="text-sm text-foreground">{country.nome_comum}</span>
                    {country.visited ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!country.visited && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onMarkVisited(country)}
                        className="text-xs"
                      >
                        Editar
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onRemoveCountry(country)}
                      className="text-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </li>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-card p-4 rounded-lg border border-border shadow-lg max-w-xs text-sm text-foreground z-50"
                  side="right"
                  sideOffset={5}
                >
                  <h4 className="font-semibold mb-2">{country.nome_comum}</h4>
                  <p><strong>Nome Oficial:</strong> {country.nome_oficial}</p>
                  <p><strong>Capital:</strong> {country.capital}</p>
                  <p><strong>Região:</strong> {country.regiao}</p>
                  <p><strong>Continente:</strong> {country.continente}</p>
                  <p><strong>População:</strong> {formatPopulation(country.populacao)}</p>
                  <p><strong>Moeda:</strong> {country.moeda}</p>
                  <p><strong>Observações:</strong> {country.observacoes || 'Nenhuma'}</p>
                  <Tooltip.Arrow className="fill-border" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        ))}
      </ul>
    </div>
  );
};

export default CountryList;