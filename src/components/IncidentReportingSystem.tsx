// Importaciones necesarias para el componente
import React, { useState } from 'react';
import { AlertTriangle, MapPin, Plus, Navigation, MessageCircle, Phone, Users } from 'lucide-react';
import IncidentForm from './IncidentForm';
import IncidentMap from './IncidentMap';
import NearestEntities from './NearestEntities';
import IncidentForum from './IncidentForum';
import EmergencyContacts from './EmergencyContacts';
import AnalyticsPanel from './AnalyticsPanel';
import { emergencyEntities } from '../utils/data';
import { findNearestEntities, getHotZones, getFilteredIncidents } from '../utils/algorithms';
import { createIncident, getIncidents } from '../api/endpoints';

// Definición del tipo de datos para un incidente
type Incident = {
  id: number;
  type: string;
  description: string;
  location: { lat: number; lng: number };
  anonymous: boolean;
  timestamp: Date;
  userId?: number;
  userName?: string;
};

// Componente principal del sistema de reporte de incidentes
const IncidentReportingSystem = () => {
  // Estados del componente
  const [activeTab, setActiveTab] = useState('map'); // Pestaña activa
  const [incidents, setIncidents] = useState<Incident[]>([]); // Lista de incidentes
  const [newIncident, setNewIncident] = useState<Omit<Incident, 'id'>>({
    type: '',
    description: '',
    location: { lat: -12.0464, lng: -77.0428 },
    anonymous: false,
    timestamp: new Date(),
    userId: 1, // Por defecto usuario 1, puedes cambiarlo por un sistema de autenticación
    userName: '' // Campo opcional para el nombre del usuario
  });
  const [nearestEntitiesState, setNearestEntities] = useState<any[]>([]); // Entidades cercanas
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
  const [filterType, setFilterType] = useState('all'); // Filtro de tipo de incidente

  // Función para manejar el envío de un nuevo incidente
  const handleSubmitIncident = async () => {
    if (!newIncident.type) return;
    
    try {
      // Preparar los datos para el backend según el formato esperado
      const incidentData = {
        type: newIncident.type,
        description: newIncident.description || '',
        lat: newIncident.location.lat,
        lng: newIncident.location.lng,
        anonymous: newIncident.anonymous,
        timestamp: new Date().toISOString(),
        userId: newIncident.anonymous ? null : (newIncident.userId || 1)
      };

      // Enviar al backend
      await createIncident(incidentData);
      
      // Actualizar la lista local de incidentes
      const updatedIncidents = await getIncidents();
      setIncidents(updatedIncidents);
      
      // Encontrar entidades cercanas
      const nearest = findNearestEntities(
        newIncident.location.lat,
        newIncident.location.lng,
        3
      );
      setNearestEntities(nearest);
      
      // Resetear el formulario
      setNewIncident({
        type: '',
        description: '',
        location: { lat: -12.0464, lng: -77.0428 },
        anonymous: false,
        timestamp: new Date(),
        userId: 1,
        userName: ''
      });
      
      // Cambiar a la pestaña de entidades cercanas
      setActiveTab('entities');
      
      alert('Incidente reportado exitosamente');
    } catch (error) {
      console.error('Error al reportar el incidente:', error);
      alert('Hubo un problema al reportar el incidente. Por favor, inténtalo de nuevo.');
    }
  };

  // Variables derivadas
  const hotZones = getHotZones(incidents); // Zonas calientes
  const filteredIncidents = () => getFilteredIncidents(incidents, filterType, searchTerm); // Incidentes filtrados

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Encabezado del sistema */}
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

      {/* Navegación entre pestañas */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {/* Definición de las pestañas y su renderizado dinámico */}
            {[
              {
                id: 'map',
                label: 'Mapa de Incidentes',
                icon: MapPin
              },
              {
                id: 'report',
                label: 'Reportar Incidente',
                icon: Plus
              },
              {
                id: 'entities',
                label: 'Entidades Cercanas',
                icon: Navigation
              },
              {
                id: 'forum',
                label: 'Foro de Reportes',
                icon: MessageCircle
              },
              {
                id: 'contacts',
                label: 'Contactos de Emergencia',
                icon: Phone
              },
              {
                id: 'analytics',
                label: 'Análisis de Zonas',
                icon: Users
              }
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

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Renderizar el contenido según la pestaña activa */}
        {activeTab === 'map' && <IncidentMap incidents={incidents} />}
        {activeTab === 'report' && (
          <IncidentForm
            newIncident={newIncident}
            setNewIncident={setNewIncident}
            handleSubmitIncident={handleSubmitIncident}
          />
        )}
        {activeTab === 'entities' && (
          <NearestEntities nearestEntities={nearestEntitiesState} />
        )}
        {activeTab === 'forum' && (
          <IncidentForum
            incidents={incidents}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            getFilteredIncidents={filteredIncidents}
          />
        )}
        {activeTab === 'contacts' && (
          <EmergencyContacts emergencyEntities={emergencyEntities} />
        )}
        {activeTab === 'analytics' && (
          <AnalyticsPanel
            incidents={incidents}
            nearestEntities={nearestEntitiesState}
            hotZones={hotZones}
          />
        )}
      </main>
    </div>
  );
};

export default IncidentReportingSystem;
