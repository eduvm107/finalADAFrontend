import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Navigation, MessageCircle, Phone, Users, Settings } from 'lucide-react';
import IncidentForm from './IncidentForm';
import IncidentMap from './IncidentMap';
import NearestEntities from './NearestEntities';
import IncidentForum from './IncidentForum';
import EmergencyContacts from './EmergencyContacts';
import AnalyticsPanel from './AnalyticsPanel';
import GeolocationTest from './GeolocationTest';
import EmergencyEntitiesAdmin from './EmergencyEntitiesAdmin';
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
  
  // Estado para el último incidente reportado (para sugerir entidades)
  const [lastIncidentType, setLastIncidentType] = useState<string>('');
  const [lastIncidentLocation, setLastIncidentLocation] = useState<{ lat: number; lng: number } | null>(null);

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

      console.log('📤 Enviando incidente al backend:', incidentData);

      // Enviar al backend
      await createIncident(incidentData);
      
      // Guardar información del incidente para sugerir entidades
      setLastIncidentType(newIncident.type);
      setLastIncidentLocation({
        lat: newIncident.location.lat,
        lng: newIncident.location.lng
      });
      
      // Actualizar la lista local de incidentes
      const updatedIncidents = await getIncidents();
      setIncidents(updatedIncidents);
      
      console.log('🎯 Buscando entidades de emergencia cercanas...');
      console.log(`📍 Ubicación: ${newIncident.location.lat}, ${newIncident.location.lng}`);
      console.log(`🚨 Tipo de incidente: ${newIncident.type}`);
      
      // Resetear el formulario pero mantener la ubicación actual
      const currentLocation = { lat: newIncident.location.lat, lng: newIncident.location.lng };
      setNewIncident({
        type: '',
        description: '',
        location: currentLocation, // Mantener la ubicación actual
        anonymous: false,
        timestamp: new Date(),
        userId: 1,
        userName: ''
      });
      
      // Cambiar a la pestaña de entidades cercanas para mostrar las sugerencias
      setActiveTab('entities');
      
      alert('✅ Incidente reportado exitosamente.\n🎯 Se han encontrado entidades de emergencia cercanas.');
    } catch (error) {
      console.error('❌ Error al reportar el incidente:', error);
      alert('Hubo un problema al reportar el incidente. Por favor, inténtalo de nuevo.');
    }
  };

  const hotZones = getHotZones(incidents);
  const filteredIncidents = () => getFilteredIncidents(incidents, filterType, searchTerm);

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundImage: 'none', background: '#f8fafc' }}>
      <header className="shadow-sm border-b" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', backgroundImage: 'none' }}>
        <div className="px-0 main-padding">
          <div className="flex justify-center items-center py-6">
            <h1 className="text-2xl font-bold text-white text-center" style={{ backgroundImage: 'none', background: 'transparent' }}>Sistema de Reporte de Incidentes</h1>
          </div>
        </div>
      </header>
      
      {/* Barra de navegación moderna estilo píldora */}
      <nav className="bg-black border-b border-gray-700 py-4" style={{ backgroundImage: 'none' }}>
        <div className="px-0 main-padding">
          <div className="flex gap-2 justify-center overflow-x-auto scrollbar-hide nav-single-line" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', backgroundImage: 'none' }}>
            {[
              { id: 'map', label: 'Inicio', icon: MapPin },
              { id: 'report', label: 'Incidentes', icon: Plus },
              { id: 'entities', label: 'Entidades Cercanas', icon: Navigation },
              { id: 'forum', label: 'Foro de Reportes', icon: MessageCircle },
              { id: 'contacts', label: 'Contactos de Emergencia', icon: Phone },
              { id: 'analytics', label: 'Análisis de Zonas', icon: Users },
              { id: 'admin', label: 'Administrar Entidades', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105 nav-button ${
                  activeTab === id
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                    : 'bg-transparent text-white hover:bg-orange-500 hover:text-white shadow-md hover:shadow-lg border border-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{label}</span>
              </button>
            ))}
            {/* Botón temporal para pruebas GPS */}
            <button
              onClick={() => setActiveTab('geolocation-test')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105 nav-button ${
                activeTab === 'geolocation-test'
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                  : 'bg-transparent text-white hover:bg-orange-500 hover:text-white shadow-md hover:shadow-lg border border-gray-600'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="whitespace-nowrap">Prueba GPS</span>
            </button>
          </div>
        </div>
      </nav>
      <main className="py-8 px-0 main-padding" style={{ backgroundImage: 'none', background: 'transparent' }}>
        {/* Sección del Mapa de Incidentes con imagen de encabezado */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            {/* Componente del mapa */}
            <IncidentMap incidents={incidents} />
          </div>
        )}        {activeTab === 'report' && (
          <IncidentForm
            newIncident={newIncident}
            setNewIncident={setNewIncident}
            handleSubmitIncident={handleSubmitIncident}
            locationLoading={locationLoading}
            locationError={locationError}
            refreshLocation={refreshLocation}
          />
        )}
        {/* Sección de Entidades Cercanas */}
        {activeTab === 'entities' && (
          <div className="space-y-6">
            {/* Título de la sección */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 image-section-title">
                🚑 Entidades de Emergencia Cercanas
              </h2>
              <p className="text-gray-700 text-lg mb-6">
                Algoritmo K-Nearest Neighbors para encontrar ayuda rápida
              </p>
              <div className="flex items-center flex-wrap gap-4">
                <div className="bg-blue-100 rounded-full px-6 py-3">
                  <span className="text-blue-800 font-medium">
                    🚑 Servicios de Emergencia
                  </span>
                </div>
                <div className="bg-green-100 rounded-full px-6 py-3">
                  <span className="text-green-800 font-medium">
                    📍 Búsqueda Inteligente
                  </span>
                </div>
              </div>
            </div>
            
            {/* Componente de entidades cercanas */}
            <NearestEntities 
              lastIncidentType={lastIncidentType}
              lastIncidentLocation={lastIncidentLocation}
            />
          </div>
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
        {activeTab === 'admin' && <EmergencyEntitiesAdmin />}
        {activeTab === 'geolocation-test' && <GeolocationTest />}
      </main>
    </div>
  );
};

export default IncidentReportingSystem;
