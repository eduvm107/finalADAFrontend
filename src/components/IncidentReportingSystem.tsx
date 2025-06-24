import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Plus, Navigation, MessageCircle, Phone, Users } from 'lucide-react';
import IncidentForm from './IncidentForm';
import IncidentMap from './IncidentMap';
import NearestEntities from './NearestEntities';
import IncidentForum from './IncidentForum';
import EmergencyContacts from './EmergencyContacts';
import AnalyticsPanel from './AnalyticsPanel';
import GeolocationTest from './GeolocationTest';
import { emergencyEntities } from '../utils/data';
import { findNearestEntities, getHotZones, getFilteredIncidents } from '../utils/algorithms';
import { createIncident, getIncidents } from '../api/endpoints';
import { useGeolocation } from '../hooks/useGeolocation';

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

const IncidentReportingSystem = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  
  // Hook para obtener la ubicación del usuario
  const { latitude, longitude, loading: locationLoading, error: locationError, refreshLocation } = useGeolocation();
  
  const [newIncident, setNewIncident] = useState<Omit<Incident, 'id'>>({
    type: '',
    description: '',
    location: { lat: -12.0464, lng: -77.0428 }, // Coordenadas por defecto (Lima, Perú)
    anonymous: false,
    timestamp: new Date(),
    userId: 1, // Por defecto usuario 1, puedes cambiarlo por un sistema de autenticación
    userName: '' // Campo opcional para el nombre del usuario
  });
  const [nearestEntitiesState, setNearestEntities] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Actualizar la ubicación del nuevo incidente cuando se obtenga la geolocalización
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      console.log('📍 Ubicación del usuario obtenida:', { lat: latitude, lng: longitude });
      setNewIncident(prev => ({
        ...prev,
        location: { lat: latitude, lng: longitude }
      }));
    }
  }, [latitude, longitude]);
  // Cargar incidentes al iniciar la aplicación
  useEffect(() => {
    const loadIncidents = async () => {
      try {
        console.log('🔄 Cargando incidentes desde el backend...');
        const incidentsData = await getIncidents();
        console.log('✅ Incidentes cargados desde backend:', incidentsData);
        console.log('📊 Cantidad de incidentes:', incidentsData.length);
        
        if (incidentsData && incidentsData.length > 0) {
          setIncidents(incidentsData);
        } else {
          console.log('⚠️ Backend respondió pero sin incidentes, cargando datos de ejemplo...');
          loadExampleIncidents();
        }
      } catch (error) {
        console.error('❌ Error al cargar los incidentes desde backend:', error);
        console.log('🔄 Cargando datos de ejemplo como respaldo...');
        loadExampleIncidents();
      }
    };

    const loadExampleIncidents = () => {
      const exampleIncidents = [
        {
          id: 1,
          type: 'robo',
          description: 'Robo de cartera en la calle Principal',
          location: { lat: -12.0464, lng: -77.0428 },
          anonymous: false,
          timestamp: new Date(),
          userId: 1
        },
        {
          id: 2,
          type: 'emergencia-medica',
          description: 'Accidente de tránsito en Av. Lima',
          location: { lat: -12.0500, lng: -77.0400 },
          anonymous: true,
          timestamp: new Date(),
          userId: null
        },
        {
          id: 3,
          type: 'incendio',
          description: 'Incendio en edificio residencial',
          location: { lat: -12.0400, lng: -77.0350 },
          anonymous: false,
          timestamp: new Date(),
          userId: 2
        },
        {
          id: 4,
          type: 'violencia-familiar',
          description: 'Incidente de violencia doméstica',
          location: { lat: -12.0600, lng: -77.0300 },
          anonymous: true,
          timestamp: new Date(),
          userId: null
        },
        {
          id: 5,
          type: 'robo',
          description: 'Asalto en estación de buses',
          location: { lat: -12.0550, lng: -77.0250 },
          anonymous: false,
          timestamp: new Date(),
          userId: 3
        },
        {
          id: 6,
          type: 'emergencia-medica',
          description: 'Emergencia médica en parque central',
          location: { lat: -12.0350, lng: -77.0450 },
          anonymous: false,
          timestamp: new Date(),
          userId: 4
        },
        {
          id: 7,
          type: 'otro',
          description: 'Vandalismo en propiedad pública',
          location: { lat: -12.0650, lng: -77.0200 },
          anonymous: true,
          timestamp: new Date(),
          userId: null
        }
      ];
      
      console.log('📝 Cargando', exampleIncidents.length, 'incidentes de ejemplo');
      setIncidents(exampleIncidents);
    };

    loadIncidents();
  }, []);

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

  const hotZones = getHotZones(incidents);
  const filteredIncidents = () => getFilteredIncidents(incidents, filterType, searchTerm);

  return (
    <div className="min-h-screen bg-gray-50">
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
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'map', label: 'Mapa de Incidentes', icon: MapPin },
              { id: 'report', label: 'Reportar Incidente', icon: Plus },
              { id: 'entities', label: 'Entidades Cercanas', icon: Navigation },
              { id: 'forum', label: 'Foro de Reportes', icon: MessageCircle },
              { id: 'contacts', label: 'Contactos de Emergencia', icon: Phone },
              { id: 'analytics', label: 'Análisis de Zonas', icon: Users }            ].map(({ id, label, icon: Icon }) => (
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
            {/* Botón temporal para pruebas */}
            <button
              onClick={() => setActiveTab('geolocation-test')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'geolocation-test'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Prueba GPS</span>
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'map' && <IncidentMap incidents={incidents} />}        {activeTab === 'report' && (
          <IncidentForm
            newIncident={newIncident}
            setNewIncident={setNewIncident}
            handleSubmitIncident={handleSubmitIncident}
            locationLoading={locationLoading}
            locationError={locationError}
            refreshLocation={refreshLocation}
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
        )}        {activeTab === 'analytics' && (
          <AnalyticsPanel
            incidents={incidents}
            nearestEntities={nearestEntitiesState}
            hotZones={hotZones}
          />
        )}
        {activeTab === 'geolocation-test' && <GeolocationTest />}
      </main>
    </div>
  );
};

export default IncidentReportingSystem;
