import React, { useEffect, useState } from 'react';
import { Search, Filter, MessageCircle, Clock, MapPin, AlertTriangle, Shield, Heart, Home, Flame } from 'lucide-react';
import { getIncidents, createIncident } from '../api/endpoints';

const getIncidentIcon = (type) => {
  const icons = {
    'robo': <Shield className="w-4 h-4" />, 'emergencia-medica': <Heart className="w-4 h-4" />, 'violencia-familiar': <Home className="w-4 h-4" />, 'incendio': <Flame className="w-4 h-4" />, 'otro': <AlertTriangle className="w-4 h-4" />
  };
  return icons[type] || <AlertTriangle className="w-4 h-4" />;
};
const getIncidentColor = (type) => {
  const colors = {
    'robo': 'bg-red-100 text-red-800 border-red-200', 'emergencia-medica': 'bg-blue-100 text-blue-800 border-blue-200', 'violencia-familiar': 'bg-purple-100 text-purple-800 border-purple-200', 'incendio': 'bg-orange-100 text-orange-800 border-orange-200', 'otro': 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
};

// Componente para el foro de reportes
const IncidentForum = ({ incidents, searchTerm, setSearchTerm, filterType, setFilterType, getFilteredIncidents }) => {
  const [incidentList, setIncidentList] = useState(incidents);
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        console.log('Iniciando carga de incidentes...');
        const incidents = await getIncidents();
        console.log('Incidentes cargados exitosamente:', incidents);
        setIncidentList(incidents);
      } catch (error) {
        console.error('Error al cargar los incidentes:', error);
        alert('Hubo un problema al cargar los incidentes. Revisa la consola para más detalles.');
      }
    };
    fetchIncidents();
  }, []);

  useEffect(() => {
    setIncidentList(incidents);
  }, [incidents]);
  // Usar el estado local incidentList en lugar de getFilteredIncidents
  const filteredIncidents = incidentList.filter(incident => {
    const matchesSearch = incident.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         incident.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || incident.type === filterType;
    return matchesSearch && matchesFilter;
  });
  
  const handleRegisterIncident = async () => {
    const newIncident = {
      type: 'Incendio',
      description: 'Incendio en edificio',
      lat: 19.4326,
      lng: -99.1332,
      anonymous: true,
      timestamp: new Date().toISOString(),
      userId: 1
    };
    try {
      await createIncident(newIncident);
      const updatedIncidents = await getIncidents();
      setIncidentList(updatedIncidents);
    } catch (error) {
      console.error('Error al registrar el incidente:', error);
      alert('Hubo un problema al registrar el incidente. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Foro de Reportes</h2>
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
      <div className="space-y-4">        {filteredIncidents.map((incident) => (
          <div key={incident.incidentId || incident.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${getIncidentColor(incident.type)}`}>{getIncidentIcon(incident.type)}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getIncidentColor(incident.type)}`}>
                    {incident.type?.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {incident.anonymous ? 'Anónimo' : 'Usuario registrado'}
                  </span>
                </div>
                <p className="text-gray-900 mb-2">{incident.description || 'Sin descripción'}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(incident.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{incident.lat?.toFixed(4)}, {incident.lng?.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredIncidents.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay reportes que coincidan con los filtros</p>
          </div>
        )}
      </div>
      <button
        onClick={handleRegisterIncident}
        className="mt-4 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Registrar Nuevo Incidente
      </button>
    </div>
  );
};

export default IncidentForum;
