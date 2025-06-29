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
    <div className="min-h-screen" style={{ 
      backgroundColor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Contenedor con ancho máximo para laptop centrado */}
      <div className="laptop-container" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
        {/* Contenedor principal con dos filas */}
        <div className="shadow-lg rounded-lg mx-4 mt-4 overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
        {/* Primera fila: Título - FONDO ROJO */}
        <header className="py-8 header-rojo" style={{ 
          backgroundColor: '#dc2626 !important', 
          background: 'linear-gradient(135deg, #ef4444, #dc2626) !important',
          color: '#ffffff !important'
        }}>
          <div className="px-4">
            <h1 className="text-4xl font-bold text-center sistema-titulo" style={{ 
              color: '#ffffff !important',
              fontWeight: '900',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              textAlign: 'center',
              width: '100%',
              margin: '0',
              padding: '0'
            }}>
              Sistema de Reporte de Incidentes
            </h1>
          </div>
        </header>
        
        {/* Segunda fila: Navegación - FONDO NEGRO */}
        <nav className="py-6 px-4" style={{ 
          backgroundColor: '#000000',
          borderTop: '1px solid #333333'
        }}>
          <div className="flex gap-3 justify-center flex-wrap"
>
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
                className="flex items-center space-x-2 px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300"
                style={{
                  backgroundColor: activeTab === id ? '#ffffff' : 'transparent',
                  color: activeTab === id ? '#000000' : '#ffffff',
                  border: activeTab === id ? '2px solid #ffffff' : '2px solid #666666',
                  boxShadow: activeTab === id ? '0 4px 12px rgba(255,255,255,0.3)' : '0 2px 8px rgba(0,0,0,0.2)',
                  fontWeight: '700'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== id) {
                    e.currentTarget.style.backgroundColor = '#333333';
                    e.currentTarget.style.borderColor = '#888888';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#666666';
                  }
                }}
              >
                <Icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{label}</span>
              </button>
            ))}
            {/* Botón temporal para pruebas GPS */}
            <button
              onClick={() => setActiveTab('geolocation-test')}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300"
              style={{
                backgroundColor: activeTab === 'geolocation-test' ? '#ffffff' : 'transparent',
                color: activeTab === 'geolocation-test' ? '#000000' : '#ffffff',
                border: activeTab === 'geolocation-test' ? '2px solid #ffffff' : '2px solid #666666',
                boxShadow: activeTab === 'geolocation-test' ? '0 4px 12px rgba(255,255,255,0.3)' : '0 2px 8px rgba(0,0,0,0.2)',
                fontWeight: '700'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'geolocation-test') {
                  e.currentTarget.style.backgroundColor = '#333333';
                  e.currentTarget.style.borderColor = '#888888';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'geolocation-test') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#666666';
                }
              }}
            >
              <MapPin className="w-4 h-4" />
              <span className="whitespace-nowrap">Prueba GPS</span>
            </button>
          </div>
        </nav>
      </div>
      
      <main className="py-8 px-4" style={{ 
        backgroundImage: 'none', 
        background: 'transparent',
        flex: '1'
      }}>
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

      {/* Footer */}
      <footer style={{
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        padding: '3rem 0 1rem 0',
        marginTop: 'auto',
        width: '100%'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {/* Servicios */}
            <div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#ff6b35'
              }}>
                Nuestros Servicios
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#cccccc', fontSize: '0.9rem' }}>🚨 Reportes de Emergencia</span>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#cccccc', fontSize: '0.9rem' }}>📍 Localización de Incidentes</span>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#cccccc', fontSize: '0.9rem' }}>🗺️ Mapas Interactivos</span>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#cccccc', fontSize: '0.9rem' }}>📞 Contactos de Emergencia</span>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#cccccc', fontSize: '0.9rem' }}>💬 Foro Comunitario</span>
                </li>
              </ul>
            </div>

            {/* Información */}
            <div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#ff6b35'
              }}>
                Información
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#cccccc', fontSize: '0.9rem' }}>📋 Cómo Reportar</span>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#cccccc', fontSize: '0.9rem' }}>❓ Preguntas Frecuentes</span>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#cccccc', fontSize: '0.9rem' }}>🛡️ Seguridad y Privacidad</span>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#cccccc', fontSize: '0.9rem' }}>📊 Estadísticas</span>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#cccccc', fontSize: '0.9rem' }}>🎯 Nuestra Misión</span>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#ff6b35'
              }}>
                Legal
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#cccccc', fontSize: '0.9rem' }}>📄 Términos de Uso</span>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#cccccc', fontSize: '0.9rem' }}>🔐 Política de Privacidad</span>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#cccccc', fontSize: '0.9rem' }}>🍪 Política de Cookies</span>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#cccccc', fontSize: '0.9rem' }}>⚖️ Aviso Legal</span>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#cccccc', fontSize: '0.9rem' }}>📝 Disclaimers</span>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#ff6b35'
              }}>
                Contáctanos
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#cccccc', fontSize: '0.9rem' }}>📧 info@reporta-ya.pe</span>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#cccccc', fontSize: '0.9rem' }}>📱 +51 999 888 777</span>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#cccccc', fontSize: '0.9rem' }}>🏢 Lima, Perú</span>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#cccccc', fontSize: '0.9rem' }}>🕐 24/7 Disponible</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Redes Sociales y Emergencia */}
          <div style={{
            borderTop: '1px solid #333333',
            paddingTop: '2rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
              }}>
                <span style={{ color: '#cccccc', fontSize: '0.9rem' }}>Síguenos:</span>
                <div style={{
                  display: 'flex',
                  gap: '0.8rem'
                }}>
                  <span style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '0.5rem 0.8rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    📘 Facebook
                  </span>
                  <span style={{
                    backgroundColor: '#1da1f2',
                    color: 'white',
                    padding: '0.5rem 0.8rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    🐦 Twitter
                  </span>
                  <span style={{
                    backgroundColor: '#e1306c',
                    color: 'white',
                    padding: '0.5rem 0.8rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    📷 Instagram
                  </span>
                  <span style={{
                    backgroundColor: '#0077b5',
                    color: 'white',
                    padding: '0.5rem 0.8rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    💼 LinkedIn
                  </span>
                </div>
              </div>

              <div style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🚨 EMERGENCIA 911
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div style={{
            borderTop: '1px solid #333333',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ff6b35' }}>
                REPORTA-YA
              </span>
              <span style={{ color: '#cccccc', fontSize: '0.9rem' }}>Lima, Perú</span>
            </div>
            <div style={{ color: '#cccccc', fontSize: '0.9rem' }}>
              © 2025 REPORTA-YA. Todos los derechos reservados. | Hecho con ❤️ para Lima
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default IncidentReportingSystem;
