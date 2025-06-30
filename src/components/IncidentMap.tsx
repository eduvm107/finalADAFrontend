import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression, Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EmergencyEntity } from '../utils/emergencyEntitiesLima';
import { useEmergencyEntities } from '../hooks/useEmergencyEntities';

const center: LatLngExpression = [-12.0464, -77.0428]; // Lima, Perú

// Configurar iconos personalizados para diferentes tipos de incidentes
const createIncidentIcon = (type: string) => {
  const colors = {
    'robo': '#dc2626',
    'emergencia-medica': '#2563eb', 
    'violencia-familiar': '#7c3aed',
    'incendio': '#ea580c',
    'otro': '#6b7280'
  };
  
  const color = colors[type] || colors['otro'];
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="24" height="24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `)}`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

// Configurar iconos personalizados para entidades de emergencia
const createEmergencyEntityIcon = (type: string) => {
  const configs = {
    'policia': {
      color: '#1565c0',
      symbol: '👮',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1565c0" width="28" height="28">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
        <path d="M12 7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="white"/>
        <path d="M12 13c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" fill="white"/>
      </svg>`
    },
    'hospital': {
      color: '#d32f2f',
      symbol: '🏥',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#d32f2f" width="28" height="28">
        <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/>
        <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        <rect x="11" y="7" width="2" height="8" fill="white"/>
        <rect x="7" y="11" width="10" height="2" fill="white"/>
      </svg>`
    },
    'bomberos': {
      color: '#f57c00',
      symbol: '🚒',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f57c00" width="28" height="28">
        <path d="M4 18l2-6h3l2 6M2 9l2-6h3l2 6m7-6v12l4-4V9"/>
        <path d="M18.5 3.5c3 0 3 4.5 0 4.5s-3-4.5 0-4.5z" fill="#ff5722"/>
        <circle cx="7" cy="20" r="2" fill="#424242"/>
        <circle cx="17" cy="20" r="2" fill="#424242"/>
      </svg>`
    },
    'serenazgo': {
      color: '#388e3c',
      symbol: '🛡️',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#388e3c" width="28" height="28">
        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.9 16,12.4 16,13V16C16,17 15,18 14,18H10C9,18 8,17 8,16V13C8,12.4 8.6,11.9 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V11.5H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z"/>
      </svg>`
    },
    'defensa_civil': {
      color: '#7b1fa2',
      symbol: '⚡',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#7b1fa2" width="28" height="28">
        <path d="M12 2L13.09 8.26L22 9L14 12L15.09 18.26L12 16L8.91 18.26L10 12L2 9L10.91 8.26L12 2Z"/>
        <path d="M7 14l5-5 5 5-5 5z" fill="white" opacity="0.7"/>
      </svg>`
    }
  };
  
  const config = configs[type] || configs['policia'];
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(config.svg)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// Componente individual para cada marcador de entidad de emergencia
const EmergencyEntityMarker = ({ entity }: { entity: EmergencyEntity }) => {
  const position: LatLngExpression = [entity.coordinates.lat, entity.coordinates.lng];
  const icon = useMemo(() => createEmergencyEntityIcon(entity.type), [entity.type]);
  
  const getTypeLabel = (type: string) => {
    const labels = {
      'policia': 'Comisaría',
      'hospital': 'Hospital',
      'bomberos': 'Bomberos',
      'serenazgo': 'Serenazgo',
      'defensa_civil': 'Defensa Civil'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'policia': '#1565c0',
      'hospital': '#d32f2f',
      'bomberos': '#f57c00',
      'serenazgo': '#388e3c',
      'defensa_civil': '#7b1fa2'
    };
    return colors[type] || '#666';
  };

  const handleCall = () => {
    window.open(`tel:${entity.phone}`, '_self');
  };

  const handleOpenInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${entity.coordinates.lat},${entity.coordinates.lng}`;
    window.open(url, '_blank');
  };
  
  return (
    <Marker position={position} icon={icon}>
      <Popup>
        <div style={{ minWidth: '250px', maxWidth: '300px' }}>
          <h4 style={{ 
            margin: '0 0 8px 0', 
            color: getTypeColor(entity.type),
            borderBottom: `2px solid ${getTypeColor(entity.type)}`,
            paddingBottom: '4px'
          }}>
            {entity.name}
          </h4>
          
          <div style={{ 
            background: getTypeColor(entity.type), 
            color: 'white', 
            padding: '4px 8px', 
            borderRadius: '4px', 
            fontSize: '12px', 
            fontWeight: 600,
            marginBottom: '8px',
            display: 'inline-block'
          }}>
            {getTypeLabel(entity.type)} {entity.available24h && '• 24h'}
          </div>
          
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>📍 Dirección:</strong><br />
            {entity.address}
          </p>
          
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>📞 Teléfono:</strong> 
            <span style={{ color: getTypeColor(entity.type), fontWeight: '600' }}> {entity.phone}</span>
          </p>
          
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>🏘️ Distrito:</strong> {entity.district}
          </p>
          
          {entity.services && entity.services.length > 0 && (
            <div style={{ margin: '8px 0 4px 0' }}>
              <strong style={{ fontSize: '14px' }}>🚨 Servicios:</strong>
              <div style={{ marginTop: '4px' }}>
                {entity.services.map((service, idx) => (
                  <span 
                    key={idx}
                    style={{ 
                      background: '#f0f0f0', 
                      padding: '2px 6px', 
                      borderRadius: '3px', 
                      fontSize: '12px',
                      marginRight: '4px',
                      marginBottom: '2px',
                      display: 'inline-block'
                    }}
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div style={{ 
            marginTop: '12px', 
            display: 'flex', 
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handleCall}
              style={{
                background: '#4caf50',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              📞 Llamar
            </button>
            <button
              onClick={handleOpenInMaps}
              style={{
                background: '#2196f3',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              🗺️ Ver en Maps
            </button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

// Componente individual para cada marcador
const IncidentMarker = ({ incident, idx }) => {
  const lat = incident.lat || incident.location?.lat;
  const lng = incident.lng || incident.location?.lng;
  
  if (!lat || !lng || isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
    console.warn(`⚠️ Marcador ${idx + 1} no tiene coordenadas válidas:`, { lat, lng });
    return null;
  }
  
  // Agregar un pequeño offset aleatorio para evitar superposición de marcadores
  // Si todos los incidentes tienen las mismas coordenadas
  const baseLatNum = parseFloat(lat);
  const baseLngNum = parseFloat(lng);
  
  // Generar offset pequeño pero consistente basado en el ID para evitar superposición
  const seed = incident.id || idx;
  const offsetRange = 0.002; // Aproximadamente 200 metros
  const latOffset = ((seed * 97) % 100 - 50) / 50 * offsetRange; // -offsetRange a +offsetRange
  const lngOffset = ((seed * 101) % 100 - 50) / 50 * offsetRange; // -offsetRange a +offsetRange
  
  const adjustedLat = baseLatNum + latOffset;
  const adjustedLng = baseLngNum + lngOffset;
  
  const position: LatLngExpression = [adjustedLat, adjustedLng];
  const icon = useMemo(() => createIncidentIcon(incident.type), [incident.type]);
  
  console.log(`🎯 Renderizando marcador ${incident.id || idx + 1}: lat=${baseLatNum} (ajustado: ${adjustedLat.toFixed(6)}), lng=${baseLngNum} (ajustado: ${adjustedLng.toFixed(6)})`);
  
  return (
    <Marker
      position={position}
      icon={icon}
    >
      <Popup>
        <div style={{ minWidth: '200px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#d90429' }}>
            Incidente #{incident.id || idx + 1}
          </h4>
          <p style={{ margin: '4px 0', fontWeight: 600 }}>
            Tipo: <span style={{ color: '#2563eb' }}>{incident.type}</span>
          </p>
          {incident.description && (
            <p style={{ margin: '4px 0' }}>
              <strong>Descripción:</strong> {incident.description}
            </p>
          )}
          <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>
            Coordenadas originales: {baseLatNum.toFixed(6)}, {baseLngNum.toFixed(6)}
          </p>
          <p style={{ margin: '4px 0', fontSize: '12px', color: '#999' }}>
            Coordenadas ajustadas: {adjustedLat.toFixed(6)}, {adjustedLng.toFixed(6)}
          </p>
          {incident.timestamp && (
            <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>
              Fecha: {new Date(incident.timestamp).toLocaleString()}
            </p>
          )}
          <p style={{ margin: '4px 0', fontSize: '12px' }}>
            Reporte: {incident.anonymous ? 'Anónimo' : 'Identificado'}
          </p>
        </div>
      </Popup>
    </Marker>
  );
};

// Componente para el mapa de incidentes
const IncidentMap = ({ incidents }) => {
  const [markers, setMarkers] = useState([]);
  const [showEmergencyEntities, setShowEmergencyEntities] = useState(true);
  const [visibleEntityTypes, setVisibleEntityTypes] = useState({
    policia: true,
    hospital: true,
    bomberos: true,
    serenazgo: true,
    defensa_civil: true
  });
  
  // Hook para obtener entidades de emergencia desde la base de datos
  const { entities: emergencyEntities, loading: entitiesLoading, error: entitiesError } = useEmergencyEntities();
  
  console.log('🗺️ IncidentMap recibió incidentes:', incidents);
  console.log('📊 Cantidad de incidentes a mostrar:', incidents?.length || 0);
  console.log('🏥 Entidades de emergencia cargadas:', emergencyEntities?.length || 0);
  
  // Validar que incidents sea un array
  const validIncidents = Array.isArray(incidents) ? incidents : [];

  // Filtrar entidades según los tipos visibles
  const visibleEntities = emergencyEntities.filter(entity => 
    showEmergencyEntities && visibleEntityTypes[entity.type]
  );
    // Procesar los incidentes para crear marcadores
  useEffect(() => {
    console.log('🔄 Procesando incidentes para marcadores...');
    
    // Diagnosticar coordenadas para ver si hay duplicados
    const coordinates = validIncidents.map((incident, idx) => {
      const lat = incident.lat || incident.location?.lat;
      const lng = incident.lng || incident.location?.lng;
      return { id: incident.id || idx, lat: parseFloat(lat), lng: parseFloat(lng) };
    }).filter(coord => !isNaN(coord.lat) && !isNaN(coord.lng));
    
    console.log('📍 Todas las coordenadas de incidentes:', coordinates);
    
    // Agrupar por coordenadas para detectar duplicados
    const coordinateGroups: { [key: string]: number[] } = coordinates.reduce((groups, coord) => {
      const key = `${coord.lat.toFixed(6)},${coord.lng.toFixed(6)}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(coord.id);
      return groups;
    }, {} as { [key: string]: number[] });
    
    console.log('🗂️ Incidentes agrupados por coordenadas:', coordinateGroups);
    
    const duplicateCoordinates = Object.entries(coordinateGroups).filter(([key, ids]) => ids.length > 1);
    if (duplicateCoordinates.length > 0) {
      console.warn('⚠️ ENCONTRADAS COORDENADAS DUPLICADAS:');
      duplicateCoordinates.forEach(([coords, ids]) => {
        console.warn(`   📍 ${coords}: incidentes ${ids.join(', ')}`);
      });
    } else {
      console.log('✅ No se encontraron coordenadas duplicadas');
    }
    
    const processedMarkers = validIncidents
      .map((incident, idx) => {
        console.log(`🔍 Procesando incidente ${idx + 1}:`, incident);
        
        // Manejar tanto el formato del backend (lat, lng) como el formato local (location.lat, location.lng)
        const lat = incident.lat || incident.location?.lat;
        const lng = incident.lng || incident.location?.lng;
        
        console.log(`📍 Coordenadas para incidente ${idx + 1}: lat=${lat}, lng=${lng}`);
        
        if (!lat || !lng || isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
          console.warn(`⚠️ Incidente ${idx + 1} no tiene coordenadas válidas:`, { lat, lng });
          return null;
        }
        
        return {
          id: incident.id || `incident-${idx}`,
          position: [parseFloat(lat), parseFloat(lng)] as LatLngExpression,
          incident: incident,
          idx: idx
        };
      })
      .filter(marker => marker !== null);
    
    console.log('✅ Marcadores procesados:', processedMarkers.length);
    setMarkers(processedMarkers);
  }, [validIncidents]);
  
  return (
    <div id="main-map" className="bg-white rounded-lg shadow p-6 fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 className="text-xl font-semibold image-section-title">
          Mapa de Incidentes y Entidades de Emergencia
        </h2>
        <div style={{ fontSize: '14px', color: '#666' }}>
          {validIncidents.length} incidentes • {visibleEntities.length} entidades
        </div>
      </div>

      {/* Controles de visibilidad */}
      <div style={{ 
        marginBottom: '16px', 
        padding: '12px', 
        background: '#f8f9fa', 
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showEmergencyEntities}
              onChange={(e) => setShowEmergencyEntities(e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            <span style={{ fontWeight: '600' }}>Mostrar Entidades de Emergencia</span>
          </label>
        </div>
        
        {showEmergencyEntities && (
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '12px', 
            marginTop: '8px',
            paddingTop: '8px',
            borderTop: '1px solid #dee2e6'
          }}>
            {Object.entries({
              policia: { label: '👮 Comisarías', color: '#1565c0' },
              hospital: { label: '🏥 Hospitales', color: '#d32f2f' },
              bomberos: { label: '🚒 Bomberos', color: '#f57c00' },
              serenazgo: { label: '🛡️ Serenazgo', color: '#388e3c' },
              defensa_civil: { label: '⚡ Defensa Civil', color: '#7b1fa2' }
            }).map(([type, config]) => (
              <label 
                key={type} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                <input
                  type="checkbox"
                  checked={visibleEntityTypes[type]}
                  onChange={(e) => setVisibleEntityTypes(prev => ({
                    ...prev,
                    [type]: e.target.checked
                  }))}
                />
                <span style={{ color: config.color, fontWeight: '600' }}>
                  {config.label}
                </span>
                <span style={{ 
                  background: config.color, 
                  color: 'white', 
                  padding: '2px 6px', 
                  borderRadius: '10px', 
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {emergencyEntities.filter(e => e.type === type).length}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div style={{ width: '100%', maxWidth: 1100, height: 600, borderRadius: 18, overflow: 'hidden', margin: '0 auto' }}>
        <MapContainer 
          center={center} 
          zoom={12} 
          style={{ width: '100%', height: 600, borderRadius: 18 }} 
          scrollWheelZoom={true}
          key={`map-${markers.length}-${visibleEntities.length}`}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Renderizar marcadores de incidentes */}
          {validIncidents.map((incident, idx) => {
            const lat = incident.lat || incident.location?.lat;
            const lng = incident.lng || incident.location?.lng;
            
            if (!lat || !lng || isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
              return null;
            }
            
            return (
              <IncidentMarker 
                key={`incident-marker-${incident.id || idx}`}
                incident={incident} 
                idx={idx} 
              />
            );
          })}

          {/* Renderizar marcadores de entidades de emergencia */}
          {visibleEntities.map((entity) => (
            <EmergencyEntityMarker
              key={`entity-${entity.id}`}
              entity={entity}
            />
          ))}
        </MapContainer>
      </div>
      <footer style={{
        width: '100%',
        maxWidth: 1100,
        margin: '0 auto',
        background: '#fff',
        borderRadius: '0 0 18px 18px',
        boxShadow: '0 -2px 12px 0 rgba(0,0,0,0.04)',
        padding: '2rem 2rem 1.5rem 2rem',
        marginTop: 24
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '2rem',
          maxWidth: 1100,
          margin: '0 auto',
          fontSize: 18
        }}>
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Números de Emergencia</h3>
            <div>Policía Nacional: <span style={{ color: '#1565c0', fontWeight: 700 }}>105</span></div>
            <div>Bomberos: <span style={{ color: '#f57c00', fontWeight: 700 }}>116</span></div>
            <div>SAMU (Emergencias Médicas): <span style={{ color: '#d32f2f', fontWeight: 700 }}>106</span></div>
            <div>Serenazgo: <span style={{ color: '#388e3c', fontWeight: 700 }}>107</span></div>
          </div>
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Estadísticas del Sistema</h3>
            <div>Total de reportes: <b>{validIncidents.length}</b></div>
            <div>Entidades registradas: <b>{emergencyEntities.length}</b></div>
            <div>Entidades visibles: <b>{visibleEntities.length}</b></div>
            <div>Cobertura Lima: <b>100%</b></div>
            {entitiesLoading && <div style={{ color: '#f57c00', fontSize: '14px' }}>🔄 Cargando entidades...</div>}
            {entitiesError && <div style={{ color: '#d32f2f', fontSize: '14px' }}>⚠️ Usando datos estáticos</div>}
          </div>
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Entidades por Tipo</h3>
            <div>👮 Comisarías: <b>{emergencyEntities.filter(e => e.type === 'policia').length}</b></div>
            <div>🏥 Hospitales: <b>{emergencyEntities.filter(e => e.type === 'hospital').length}</b></div>
            <div>🚒 Bomberos: <b>{emergencyEntities.filter(e => e.type === 'bomberos').length}</b></div>
            <div>🛡️ Serenazgo: <b>{emergencyEntities.filter(e => e.type === 'serenazgo').length}</b></div>
            <div>⚡ Defensa Civil: <b>{emergencyEntities.filter(e => e.type === 'defensa_civil').length}</b></div>
          </div>
          {/*
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Información del Proyecto</h3>
            <div>Curso: Análisis y Diseño de Algoritmos</div>
            <div>Sistema de Reporte de Incidentes</div>
            <div>Algoritmos: Búsqueda, Ordenamiento, Clustering</div>
            <div style={{ fontSize: 14, color: '#888', marginTop: 8 }}>© 2025 - Proyecto Académico</div>
          </div>
          */}
        </div>
      </footer>
    </div>
  );
};

export default IncidentMap;
