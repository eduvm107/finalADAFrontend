import React from 'react';
import { AlertTriangle, Users } from 'lucide-react';

// Componente para el panel de análisis de zonas calientes y estadísticas
const AnalyticsPanel = ({ incidents, nearestEntities, hotZones }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Análisis de Zonas Calientes</h2>
        <p className="text-gray-600 mb-6">
          Algoritmo de Clustering K-Means aplicado para identificar áreas con mayor concentración de incidentes
        </p>
        {hotZones.length > 0 ? (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Zonas con Alta Concentración de Incidentes</h3>
            {hotZones.map((zone, index) => (
              <div key={zone.zone} className="border border-red-200 bg-red-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-red-900">Zona {index + 1}</h4>
                      <p className="text-sm text-red-700">
                        Coordenadas: {zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">{zone.count}</p>
                    <p className="text-xs text-red-600">incidentes</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay suficientes datos para identificar zonas calientes</p>
            <p className="text-sm text-gray-500 mt-2">Se necesitan al menos 2 incidentes por zona</p>
          </div>
        )}
      </div>
      {/* Aquí puedes agregar las estadísticas generales y algoritmos implementados si lo deseas */}
    </div>
  );
};

export default AnalyticsPanel;
