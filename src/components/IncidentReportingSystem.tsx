import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Plus, Navigation, MessageCircle, Phone, Users, Settings } from 'lucide-react';
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
      
      {/* Barra de navegación moderna estilo píldora */}
      <nav className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { id: 'map', label: 'Mapa de Incidentes', icon: MapPin },
              { id: 'report', label: 'Reportar Incidente', icon: Plus },
              { id: 'entities', label: 'Entidades Cercanas', icon: Navigation },
              { id: 'forum', label: 'Foro de Reportes', icon: MessageCircle },
              { id: 'contacts', label: 'Contactos de Emergencia', icon: Phone },
              { id: 'analytics', label: 'Análisis de Zonas', icon: Users },
              { id: 'admin', label: 'Administrar Entidades', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30'
                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800 shadow-md hover:shadow-lg border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{label}</span>
              </button>
            ))}
            {/* Botón temporal para pruebas GPS */}
            <button
              onClick={() => setActiveTab('geolocation-test')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'geolocation-test'
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg shadow-green-500/30'
                  : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800 shadow-md hover:shadow-lg border border-gray-200'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="whitespace-nowrap">Prueba GPS</span>
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sección del Mapa de Incidentes con imagen de encabezado */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            {/* Imagen de encabezado para el mapa de incidentes */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src="https://picsum.photos/800/400?random=1" 
                alt="Servicios de Emergencia" 
                className="w-full h-64 md:h-80 object-cover"
                onLoad={(e) => {
                  console.log('✅ Imagen cargada correctamente');
                }}
                onError={(e) => {
                  console.log('❌ Error al cargar imagen');
                  // Intentar con otra imagen
                  e.currentTarget.src = "https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Servicios+de+Emergencia";
                }}
              />
            </div>
            
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
        {/* Sección de Entidades Cercanas con imagen de encabezado */}
        {activeTab === 'entities' && (
          <div className="space-y-6">
            {/* Imagen de encabezado para entidades de emergencia */}
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64 md:h-80">
                <img 
                  src="https://picsum.photos/800/400?random=2" 
                  alt="Entidades de Emergencia" 
                  className="w-full h-full object-cover"
                  onLoad={(e) => {
                    console.log('✅ Imagen de entidades cargada correctamente');
                  }}
                  onError={(e) => {
                    console.log('❌ Error al cargar imagen de entidades');
                    // Intentar con otra imagen
                    e.currentTarget.src = "https://via.placeholder.com/800x400/DC2626/FFFFFF?text=Entidades+de+Emergencia";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-blue-600/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    🚑 Entidades de Emergencia Cercanas
                  </h2>
                  <p className="text-white/90 text-lg">
                    Algoritmo K-Nearest Neighbors para encontrar ayuda rápida
                  </p>
                  <div className="flex items-center mt-3 space-x-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                      <span className="text-white font-medium">
                        🚑 Servicios de Emergencia
                      </span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                      <span className="text-white font-medium">
                        📍 Búsqueda Inteligente
                      </span>
                    </div>
                  </div>
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
