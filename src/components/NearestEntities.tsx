import React from 'react';
import { Shield, Flame, Heart, Phone, Navigation } from 'lucide-react';

// Componente para mostrar entidades cercanas
const NearestEntities = ({ nearestEntities }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Entidades de Emergencia Más Cercanas</h2>
      <p className="text-gray-600 mb-6">
        Algoritmo K-Nearest Neighbors aplicado para encontrar las 3 entidades más cercanas
      </p>
      {nearestEntities.length > 0 ? (
        <div className="space-y-4">
          {nearestEntities.map((entity, index) => (
            <div key={entity.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    entity.type === 'police' ? 'bg-blue-100 text-blue-600' :
                    entity.type === 'fire' ? 'bg-red-100 text-red-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {entity.type === 'police' ? <Shield className="w-5 h-5" /> :
                     entity.type === 'fire' ? <Flame className="w-5 h-5" /> :
                     <Heart className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{entity.name}</h3>
                    <p className="text-sm text-gray-600">{entity.address}</p>
                    <p className="text-xs text-gray-500">Distancia: {entity.distance.toFixed(2)} km</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-green-600">{entity.phone}</span>
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Reporta un incidente para ver las entidades más cercanas</p>
        </div>
      )}
    </div>
  );
};

export default NearestEntities;
