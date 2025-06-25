import React, { useState, useEffect } from 'react';
import { 
  Shield, Flame, Heart, Phone, Navigation, MapPin, Clock, 
  Star, Filter, RefreshCw, ExternalLink, AlertTriangle
} from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useEmergencyEntities } from '../hooks/useEmergencyEntities';
import { 
  findNearestEmergencyEntities, 
  findEntitiesByType, 
  getEmergencyCoverage, 
  NearestEntityResult 
} from '../utils/emergencyEntityFinder';

const getEntityIcon = (type: string) => {
  const icons = {
    'policia': <Shield className="w-5 h-5" />,
    'hospital': <Heart className="w-5 h-5" />,
    'bomberos': <Flame className="w-5 h-5" />,
    'serenazgo': <Shield className="w-4 h-4" />,
    'defensa_civil': <AlertTriangle className="w-5 h-5" />
  };
  return icons[type] || <Navigation className="w-5 h-5" />;
};

const getEntityColor = (type: string) => {
  const colors = {
    'policia': 'bg-blue-100 text-blue-600 border-blue-200',
    'hospital': 'bg-red-100 text-red-600 border-red-200',
    'bomberos': 'bg-orange-100 text-orange-600 border-orange-200',
    'serenazgo': 'bg-purple-100 text-purple-600 border-purple-200',
    'defensa_civil': 'bg-yellow-100 text-yellow-600 border-yellow-200'
  };
  return colors[type] || 'bg-gray-100 text-gray-600 border-gray-200';
};

const getTypeDisplayName = (type: string) => {
  const names = {
    'policia': 'Policía Nacional',
    'hospital': 'Hospital/Clínica',
    'bomberos': 'Cuerpo de Bomberos',
    'serenazgo': 'Serenazgo Municipal',
    'defensa_civil': 'Defensa Civil'
  };
  return names[type] || type;
};

interface NearestEntitiesProps {
  lastIncidentType?: string;
  lastIncidentLocation?: { lat: number; lng: number };
}

const NearestEntities: React.FC<NearestEntitiesProps> = ({ 
  lastIncidentType, 
  lastIncidentLocation 
}) => {
  const { latitude, longitude, loading: locationLoading, error: locationError } = useGeolocation();
  const { entities, loading: entitiesLoading, error: entitiesError } = useEmergencyEntities();
  const [nearestEntities, setNearestEntities] = useState<NearestEntityResult[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [coverage, setCoverage] = useState(null);

  // Usar ubicación del último incidente o ubicación actual
  const searchLat = lastIncidentLocation?.lat || latitude;
  const searchLng = lastIncidentLocation?.lng || longitude;
  const searchIncidentType = lastIncidentType || 'otro';

  useEffect(() => {
    if (searchLat && searchLng && entities.length > 0) {
      searchNearestEntities();
      calculateCoverage();
    }
  }, [searchLat, searchLng, filterType, searchIncidentType, entities]);

  const searchNearestEntities = () => {
    if (!searchLat || !searchLng || entities.length === 0) return;
    
    setLoading(true);
    try {
      let results: NearestEntityResult[];
      
      if (filterType === 'all') {
        // Buscar basado en el tipo de incidente
        results = findNearestEmergencyEntities(
          searchLat, 
          searchLng, 
          searchIncidentType,
          8, // Mostrar más resultados
          15, // Distancia máxima
          entities // Pasar las entidades dinámicas
        );
      } else {
        // Buscar por tipo específico
        results = findEntitiesByType(
          searchLat,
          searchLng,
          filterType,
          5,
          entities // Pasar las entidades dinámicas
        );
      }
      
      setNearestEntities(results);
    } catch (error) {
      console.error('Error al buscar entidades:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCoverage = () => {
    if (!searchLat || !searchLng || entities.length === 0) return;
    
    const coverageData = getEmergencyCoverage(
      searchLat, 
      searchLng, 
      5,
      entities // Pasar las entidades dinámicas
    );
    setCoverage(coverageData);
  };

  const openInMaps = (entity) => {
    const url = `https://www.google.com/maps/dir/${searchLat},${searchLng}/${entity.coordinates.lat},${entity.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const callEntity = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
            <Navigation className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Entidades de Emergencia Cercanas</h1>
            <p className="text-gray-600">
              {lastIncidentType 
                ? `Recomendaciones para incidente tipo: ${lastIncidentType.replace('-', ' ')}`
                : 'Algoritmo inteligente para encontrar la ayuda más cercana'
              }
            </p>
          </div>
        </div>

        {/* Controles */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            >
              <option value="all">🎯 Recomendaciones Inteligentes</option>
              <option value="policia">🔵 Solo Policía</option>
              <option value="hospital">❤️ Solo Hospitales</option>
              <option value="bomberos">🔥 Solo Bomberos</option>
              <option value="serenazgo">🟣 Solo Serenazgo</option>
              <option value="defensa_civil">🟡 Solo Defensa Civil</option>
            </select>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {searchLat && searchLng && (
              <>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{searchLat.toFixed(4)}, {searchLng.toFixed(4)}</span>
                </div>
                <button
                  onClick={searchNearestEntities}
                  disabled={loading}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Actualizar</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Estadísticas de cobertura */}
        {coverage && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-2">Cobertura en 5km a la redonda:</h3>
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{coverage.total}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{coverage.byType.policia}</div>
                <div className="text-xs text-gray-600">Policía</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">{coverage.byType.hospital}</div>
                <div className="text-xs text-gray-600">Hospitales</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{coverage.byType.bomberos}</div>
                <div className="text-xs text-gray-600">Bomberos</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{coverage.byType.serenazgo}</div>
                <div className="text-xs text-gray-600">Serenazgo</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-600">{coverage.byType.defensa_civil}</div>
                <div className="text-xs text-gray-600">Def. Civil</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Estado de carga o error */}
      {(locationLoading || entitiesLoading) && (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">
            {locationLoading && "Obteniendo tu ubicación..."}
            {entitiesLoading && "Cargando entidades de emergencia..."}
          </p>
        </div>
      )}

      {locationError && !searchLat && (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600">No se pudo obtener la ubicación. Usando coordenadas de Lima por defecto.</p>
        </div>
      )}

      {entitiesError && (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Error al cargar entidades desde la base de datos. Usando datos estáticos.</p>
        </div>
      )}

      {/* Lista de entidades */}
      {nearestEntities.length > 0 ? (
        <div className="grid gap-4">
          {nearestEntities.map((result, index) => (
            <div key={result.entity.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Ranking */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-500' : 'bg-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      {index < 3 && (
                        <Star className={`w-4 h-4 mt-1 ${
                          index === 0 ? 'text-yellow-500' : 
                          index === 1 ? 'text-gray-400' : 'text-orange-500'
                        }`} />
                      )}
                    </div>

                    {/* Ícono de entidad */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${getEntityColor(result.entity.type)}`}>
                      {getEntityIcon(result.entity.type)}
                    </div>

                    {/* Información */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{result.entity.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEntityColor(result.entity.type)}`}>
                          {getTypeDisplayName(result.entity.type)}
                        </span>
                        {result.entity.available24h && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            24h
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{result.entity.address}, {result.entity.district}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Navigation className="w-4 h-4" />
                            <span className="font-medium">{result.distance.toFixed(2)} km</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{result.estimatedTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">{result.relevanceScore}% relevante</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Servicios: {result.entity.services.slice(0, 3).join(', ')}
                          {result.entity.services.length > 3 && '...'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => callEntity(result.entity.phone)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm font-medium">{result.entity.phone}</span>
                    </button>
                    <button
                      onClick={() => openInMaps(result.entity)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm font-medium">Ir en Maps</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !loading && searchLat && searchLng ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Navigation className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron entidades</h3>
          <p className="text-gray-600">
            No hay entidades de emergencia en un radio de 15km de tu ubicación.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ubicación requerida</h3>
          <p className="text-gray-600">
            Permite el acceso a la ubicación o reporta un incidente para ver las entidades más cercanas.
          </p>
        </div>
      )}
    </div>
  );
};

export default NearestEntities;
