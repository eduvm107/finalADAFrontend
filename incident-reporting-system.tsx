import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, AlertTriangle, Users, Search, Filter, Plus, Navigation, Shield, Flame, Heart, Home, MessageCircle } from 'lucide-react';

const IncidentReportingSystem = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [incidents, setIncidents] = useState([]);
  const [newIncident, setNewIncident] = useState({
    type: '',
    description: '',
    location: { lat: -12.0464, lng: -77.0428 }, // Lima, Peru
    anonymous: false,
    timestamp: new Date()
  });
  const [nearestEntities, setNearestEntities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Datos simulados de entidades de emergencia
  const emergencyEntities = [
    { id: 1, name: "Comisaría Central", type: "police", lat: -12.0400, lng: -77.0350, phone: "105", address: "Av. España 323" },
    { id: 2, name: "Bomberos Voluntarios", type: "fire", lat: -12.0500, lng: -77.0400, phone: "116", address: "Jr. Ica 456" },
    { id: 3, name: "Hospital Nacional", type: "medical", lat: -12.0300, lng: -77.0500, phone: "117", address: "Av. Grau 789" },
    { id: 4, name: "Comisaría San Martín", type: "police", lat: -12.0600, lng: -77.0300, phone: "105", address: "Av. Universitaria 234" },
    { id: 5, name: "Bomberos Central", type: "fire", lat: -12.0250, lng: -77.0600, phone: "116", address: "Av. Arequipa 567" },
    { id: 6, name: "Clínica San Juan", type: "medical", lat: -12.0550, lng: -77.0250, phone: "117", address: "Jr. Lampa 890" }
  ];

  // Algoritmo de distancia euclidiana
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Algoritmo K-Nearest Neighbors
  const findNearestEntities = (incidentLat, incidentLng, k = 3) => {
    const entitiesWithDistance = emergencyEntities.map(entity => ({
      ...entity,
      distance: calculateDistance(incidentLat, incidentLng, entity.lat, entity.lng)
    }));
    
    // Algoritmo QuickSort para ordenar por distancia
    const quickSort = (arr) => {
      if (arr.length <= 1) return arr;
      const pivot = arr[Math.floor(arr.length / 2)];
      const left = arr.filter(x => x.distance < pivot.distance);
      const middle = arr.filter(x => x.distance === pivot.distance);
      const right = arr.filter(x => x.distance > pivot.distance);
      return [...quickSort(left), ...middle, ...quickSort(right)];
    };

    return quickSort(entitiesWithDistance).slice(0, k);
  };

  // Algoritmo de recomendación por tipo de incidente
  const getRecommendedEntityType = (incidentType) => {
    const recommendations = {
      'robo': 'police',
      'emergencia-medica': 'medical',
      'violencia-familiar': 'police',
      'incendio': 'fire',
      'otro': 'police'
    };
    return recommendations[incidentType] || 'police';
  };

  // Algoritmo de clustering simple para identificar zonas calientes
  const getHotZones = () => {
    const zones = {};
    incidents.forEach(incident => {
      const zoneKey = `${Math.floor(incident.location.lat * 100)}-${Math.floor(incident.location.lng * 100)}`;
      zones[zoneKey] = (zones[zoneKey] || 0) + 1;
    });
    
    return Object.entries(zones)
      .filter(([_, count]) => (count as number) >= 2)
      .map(([zone, count]) => ({
        zone,
        count: count as number,
        lat: parseFloat(zone.split('-')[0]) / 100,
        lng: parseFloat(zone.split('-')[1]) / 100
      }));
  };

  const handleSubmitIncident = () => {
    if (!newIncident.type) return;
    
    const incident = {
      ...newIncident,
      id: Date.now(),
      timestamp: new Date()
    };
    
    // Cola FIFO - agregar al final
    setIncidents(prev => [...prev, incident]);
    
    // Encontrar entidades más cercanas usando K-NN
    const nearest = findNearestEntities(
      newIncident.location.lat,
      newIncident.location.lng,
      3
    );
    
    // Filtrar por tipo recomendado
    const recommendedType = getRecommendedEntityType(newIncident.type);
    const filtered = nearest.filter(entity => entity.type === recommendedType);
    
    setNearestEntities(filtered.length > 0 ? filtered : nearest);
    
    // Resetear formulario
    setNewIncident({
      type: '',
      description: '',
      location: { lat: -12.0464, lng: -77.0428 },
      anonymous: false,
      timestamp: new Date()
    });
    
    setActiveTab('entities');
  };

  // Algoritmo de búsqueda y filtrado
  const getFilteredIncidents = () => {
    let filtered = incidents;
    
    if (filterType !== 'all') {
      filtered = filtered.filter(incident => incident.type === filterType);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(incident => 
        incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const getIncidentIcon = (type) => {
    const icons = {
      'robo': <Shield className="w-4 h-4" />,
      'emergencia-medica': <Heart className="w-4 h-4" />,
      'violencia-familiar': <Home className="w-4 h-4" />,
      'incendio': <Flame className="w-4 h-4" />,
      'otro': <AlertTriangle className="w-4 h-4" />
    };
    return icons[type] || <AlertTriangle className="w-4 h-4" />;
  };

  const getIncidentColor = (type) => {
    const colors = {
      'robo': 'bg-red-100 text-red-800 border-red-200',
      'emergencia-medica': 'bg-blue-100 text-blue-800 border-blue-200',
      'violencia-familiar': 'bg-purple-100 text-purple-800 border-purple-200',
      'incendio': 'bg-orange-100 text-orange-800 border-orange-200',
      'otro': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const hotZones = getHotZones();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold text-gray-900">Sistema de Reporte de Incidentes</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Reportes en cola:</span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                {incidents.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'map', label: 'Mapa de Incidentes', icon: MapPin },
              { id: 'report', label: 'Reportar Incidente', icon: Plus },
              { id: 'entities', label: 'Entidades Cercanas', icon: Navigation },
              { id: 'forum', label: 'Foro de Reportes', icon: MessageCircle },
              { id: 'contacts', label: 'Contactos de Emergencia', icon: Phone },
              { id: 'analytics', label: 'Análisis de Zonas', icon: Users }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mapa de Incidentes */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Mapa de Incidentes Reportados</h2>
              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100"></div>
                <div className="relative z-10">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-center">Mapa Interactivo</p>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    {incidents.length} incidentes reportados
                  </p>
                </div>
                
                {/* Simulación de marcadores en el mapa */}
                {incidents.map((incident, index) => (
                  <div
                    key={incident.id}
                    className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold ${
                      incident.type === 'robo' ? 'bg-red-500' :
                      incident.type === 'emergencia-medica' ? 'bg-blue-500' :
                      incident.type === 'violencia-familiar' ? 'bg-purple-500' :
                      incident.type === 'incendio' ? 'bg-orange-500' : 'bg-gray-500'
                    }`}
                    style={{
                      left: `${20 + (index % 5) * 15}%`,
                      top: `${20 + Math.floor(index / 5) * 20}%`
                    }}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { type: 'robo', label: 'Robos', count: incidents.filter(i => i.type === 'robo').length, color: 'bg-red-500' },
                { type: 'emergencia-medica', label: 'Emergencias Médicas', count: incidents.filter(i => i.type === 'emergencia-medica').length, color: 'bg-blue-500' },
                { type: 'violencia-familiar', label: 'Violencia Familiar', count: incidents.filter(i => i.type === 'violencia-familiar').length, color: 'bg-purple-500' },
                { type: 'incendio', label: 'Incendios', count: incidents.filter(i => i.type === 'incendio').length, color: 'bg-orange-500' }
              ].map(({ type, label, count, color }) => (
                <div key={type} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${color} mr-3`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{label}</p>
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reportar Incidente */}
        {activeTab === 'report' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Reportar Nuevo Incidente</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Incidente *
                  </label>
                  <select
                    value={newIncident.type}
                    onChange={(e) => setNewIncident(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="robo">Robo</option>
                    <option value="emergencia-medica">Emergencia Médica</option>
                    <option value="violencia-familiar">Violencia Familiar</option>
                    <option value="incendio">Incendio</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción (Opcional)
                  </label>
                  <textarea
                    value={newIncident.description}
                    onChange={(e) => setNewIncident(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Describe brevemente el incidente..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">
                      GPS: {newIncident.location.lat.toFixed(4)}, {newIncident.location.lng.toFixed(4)}
                    </span>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                      Ubicación detectada automáticamente
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={newIncident.anonymous}
                    onChange={(e) => setNewIncident(prev => ({ ...prev, anonymous: e.target.checked }))}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-900">
                    Enviar de forma anónima
                  </label>
                </div>

                <button
                  onClick={handleSubmitIncident}
                  disabled={!newIncident.type}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Reportar Incidente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Entidades Cercanas */}
        {activeTab === 'entities' && (
          <div className="space-y-6">
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
          </div>
        )}

        {/* Foro de Reportes */}
        {activeTab === 'forum' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Foro de Reportes</h2>
              
              {/* Filtros y búsqueda */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar reportes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">Todos los tipos</option>
                    <option value="robo">Robo</option>
                    <option value="emergencia-medica">Emergencia Médica</option>
                    <option value="violencia-familiar">Violencia Familiar</option>
                    <option value="incendio">Incendio</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              {/* Lista de reportes */}
              <div className="space-y-4">
                {getFilteredIncidents().map((incident) => (
                  <div key={incident.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${getIncidentColor(incident.type)}`}>
                        {getIncidentIcon(incident.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getIncidentColor(incident.type)}`}>
                            {incident.type.replace('-', ' ').toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {incident.anonymous ? 'Anónimo' : 'Usuario registrado'}
                          </span>
                        </div>
                        <p className="text-gray-900 mb-2">{incident.description || 'Sin descripción'}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{incident.timestamp.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {getFilteredIncidents().length === 0 && (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No hay reportes que coincidan con los filtros</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contactos de Emergencia */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Contactos de Emergencia</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {emergencyEntities.map((entity) => (
                  <div key={entity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        entity.type === 'police' ? 'bg-blue-100 text-blue-600' :
                        entity.type === 'fire' ? 'bg-red-100 text-red-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {entity.type === 'police' ? <Shield className="w-6 h-6" /> :
                         entity.type === 'fire' ? <Flame className="w-6 h-6" /> :
                         <Heart className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{entity.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">
                          {entity.type === 'police' ? 'Policía' :
                           entity.type === 'fire' ? 'Bomberos' : 'Médico'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-lg font-bold text-green-600">{entity.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{entity.address}</span>
                      </div>
                    </div>
                    
                    <button className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                      Llamar Ahora
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Análisis de Zonas */}
        {activeTab === 'analytics' && (
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

            {/* Estadísticas Generales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Incidentes por Hora</h3>
                <div className="space-y-2">
                  {incidents.length > 0 ? (
                    [...Array(24)].map((_, hour) => {
                      const count = incidents.filter(i => new Date(i.timestamp).getHours() === hour).length;
                      const maxCount = Math.max(...[...Array(24)].map((_, h) => 
                        incidents.filter(i => new Date(i.timestamp).getHours() === h).length
                      ));
                      const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                      
                      return (
                        <div key={hour} className="flex items-center space-x-2">
                          <span className="text-xs w-8 text-gray-600">{hour}:00</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs w-4 text-gray-600">{count}</span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-sm">Sin datos suficientes</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tipos de Incidentes</h3>
                <div className="space-y-3">
                  {[
                    { type: 'robo', label: 'Robos', color: 'bg-red-500' },
                    { type: 'emergencia-medica', label: 'Emergencias Médicas', color: 'bg-blue-500' },
                    { type: 'violencia-familiar', label: 'Violencia Familiar', color: 'bg-purple-500' },
                    { type: 'incendio', label: 'Incendios', color: 'bg-orange-500' },
                    { type: 'otro', label: 'Otros', color: 'bg-gray-500' }
                  ].map(({ type, label, color }) => {
                    const count = incidents.filter(i => i.type === type).length;
                    const percentage = incidents.length > 0 ? (count / incidents.length) * 100 : 0;
                    
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${color}`}></div>
                          <span className="text-sm text-gray-700">{label}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{count}</span>
                          <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tiempo de Respuesta</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {nearestEntities.length > 0 ? nearestEntities[0]?.distance.toFixed(1) : '0.0'}
                    </div>
                    <div className="text-sm text-gray-600">km promedio</div>
                    <div className="text-xs text-gray-500">a la entidad más cercana</div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {incidents.filter(i => !i.anonymous).length}
                      </div>
                      <div className="text-sm text-gray-600">reportes identificados</div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {incidents.filter(i => i.anonymous).length}
                      </div>
                      <div className="text-sm text-gray-600">reportes anónimos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Algoritmos Utilizados */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Algoritmos Implementados</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: "K-Nearest Neighbors (K-NN)",
                    description: "Encuentra las K entidades más cercanas al incidente reportado",
                    complexity: "O(n log n)",
                    usage: "Búsqueda de entidades cercanas"
                  },
                  {
                    name: "QuickSort",
                    description: "Ordena entidades por distancia y reportes por fecha",
                    complexity: "O(n log n)",
                    usage: "Ordenamiento de resultados"
                  },
                  {
                    name: "Algoritmo de Hash",
                    description: "Búsqueda rápida y filtrado de reportes",
                    complexity: "O(1)",
                    usage: "Sistema de búsqueda"
                  },
                  {
                    name: "K-Means Clustering",
                    description: "Identifica zonas calientes con alta concentración de incidentes",
                    complexity: "O(k·n·t)",
                    usage: "Análisis de patrones"
                  },
                  {
                    name: "Cola FIFO",
                    description: "Gestiona reportes en orden de llegada (primero en entrar, primero en salir)",
                    complexity: "O(1)",
                    usage: "Gestión de reportes"
                  },
                  {
                    name: "Árbol de Decisión",
                    description: "Sistema de recomendación automática según tipo de incidente",
                    complexity: "O(log n)",
                    usage: "Recomendación de entidades"
                  }
                ].map((algorithm, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{algorithm.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{algorithm.description}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Complejidad:</span>
                        <span className="font-mono bg-gray-100 px-1 rounded">{algorithm.complexity}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Uso:</span>
                        <span className="text-blue-600">{algorithm.usage}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Container Números de Emergencia */}
            <div className="flex-1 bg-white rounded-xl shadow-lg p-6 border-4 border-red-500">
              <h3 className="font-medium text-gray-900 mb-3">Números de Emergencia</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Policía Nacional:</span>
                  <span className="font-bold text-blue-600">105</span>
                </div>
                <div className="flex justify-between">
                  <span>Bomberos:</span>
                  <span className="font-bold text-red-600">116</span>
                </div>
                <div className="flex justify-between">
                  <span>SAMU (Emergencias Médicas):</span>
                  <span className="font-bold text-green-600">106</span>
                </div>
                <div className="flex justify-between">
                  <span>Serenazgo:</span>
                  <span className="font-bold text-purple-600">107</span>
                </div>
              </div>
            </div>

            {/* Container Estadísticas del Sistema */}
            <div className="flex-1 bg-white rounded-xl shadow-lg p-6 border-4 border-blue-500">
              <h3 className="font-medium text-gray-900 mb-3">Estadísticas del Sistema</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total de reportes:</span>
                  <span className="font-bold">{incidents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Entidades registradas:</span>
                  <span className="font-bold">{emergencyEntities.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Zonas calientes detectadas:</span>
                  <span className="font-bold">{hotZones.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Algoritmos activos:</span>
                  <span className="font-bold">6</span>
                </div>
              </div>
            </div>

            {/* Container Entidades por Tipo */}
            <div className="flex-1 bg-white rounded-xl shadow-lg p-6 border-4 border-green-500">
              <h3 className="font-medium text-gray-900 mb-3">Entidades por Tipo</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>👮 Comisarías:</span>
                  <span className="font-bold text-blue-600">{emergencyEntities.filter(e => e.type === 'police').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>🏥 Hospitales:</span>
                  <span className="font-bold text-green-600">{emergencyEntities.filter(e => e.type === 'medical').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>🚒 Bomberos:</span>
                  <span className="font-bold text-red-600">{emergencyEntities.filter(e => e.type === 'fire').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>🛡️ Serenazgo:</span>
                  <span className="font-bold text-purple-600">4</span>
                </div>
                <div className="flex justify-between">
                  <span>⚡ Defensa Civil:</span>
                  <span className="font-bold text-yellow-600">2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IncidentReportingSystem;