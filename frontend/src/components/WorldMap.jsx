import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configurar ícones customizados
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background-color: ${color};
        border: 2px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        animation: pulse 2s infinite;
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
  });
};

const visitedIcon = createCustomIcon('#00ff88');
const notVisitedIcon = createCustomIcon('#a12727ff');
const unknownIcon = createCustomIcon('#ffaa00');

const WorldMap = ({ countries, userCountries, onCountryClick, isCountryVisited }) => {
  const mapRef = useRef();

  useEffect(() => {
    // Adicionar estilos CSS para a animação do marcador
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const getMarkerIcon = (countryName) => {
    const visitStatus = isCountryVisited(countryName);

    if (visitStatus === true) return visitedIcon;
    if (visitStatus === false) return notVisitedIcon;
    return unknownIcon; // País não está na lista do usuário
  };

  const formatPopulation = (population) => {
    if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)}M`;
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(1)}K`;
    }
    return population?.toLocaleString() || 'N/A';
  };

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border border-border relative z-10">
      <MapContainer
        ref={mapRef}
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        className="leaflet-container"
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
        />

        {countries.map((country, index) => {
          if (!country.capitalInfo || country.capitalInfo.length < 2) {
            return null;
          }

          const [lat, lng] = country.capitalInfo;

          return (
            <Marker
              key={`${country.nome_comum}-${index}`}
              position={[lat, lng]}
              icon={getMarkerIcon(country.nome_comum)}
              eventHandlers={{
                click: () => onCountryClick(country)
              }}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-lg mb-2 text-white">
                    {country.nome_comum}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p><strong>Nome Oficial:</strong> {country.nome_oficial}</p>
                    <p><strong>Capital:</strong> {country.capital}</p>
                    <p><strong>Região:</strong> {country.regiao}</p>
                    <p><strong>Sub-região:</strong> {country.sub_regiao}</p>
                    <p><strong>População:</strong> {formatPopulation(country.populacao)}</p>
                    <p><strong>Moeda:</strong> {country.moeda} ({country.simbolo_moeda})</p>
                    <p><strong>Idioma:</strong> {country.idioma}</p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {country.mapas?.googleMaps && (
                      <a
                        href={country.mapas.googleMaps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded hover:bg-primary/80 transition-colors"
                      >
                        Google Maps
                      </a>
                    )}
                    {country.mapas?.openStreetMaps && (
                      <a
                        href={country.mapas.openStreetMaps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded hover:bg-secondary/80 transition-colors"
                      >
                        OpenStreetMap
                      </a>
                    )}
                    {!isCountryVisited(country.nome_comum) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.openAddCountryModal) {
                            window.openAddCountryModal(country);
                          }
                        }}
                        className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors"
                      >
                        + Adicionar à Lista
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default WorldMap;

