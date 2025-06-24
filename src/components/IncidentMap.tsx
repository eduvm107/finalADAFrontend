import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression, Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
  
  console.log('🗺️ IncidentMap recibió incidentes:', incidents);
  console.log('📊 Cantidad de incidentes a mostrar:', incidents?.length || 0);
  
  // Validar que incidents sea un array
  const validIncidents = Array.isArray(incidents) ? incidents : [];
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
    <div className="bg-white rounded-lg shadow p-6 fade-in">
      <h2 className="text-xl font-semibold mb-4">
        Mapa de Incidentes Reportados ({validIncidents.length} incidentes)
      </h2>
      <div style={{ width: '100%', maxWidth: 1100, height: 600, borderRadius: 18, overflow: 'hidden', margin: '0 auto' }}>
        <MapContainer 
          center={center} 
          zoom={13} 
          style={{ width: '100%', height: 600, borderRadius: 18 }} 
          scrollWheelZoom={true}
          key={`map-${markers.length}`} // Forzar re-render cuando cambien los marcadores
        >          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Renderizar marcadores directamente sin el state intermedio */}
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
            <div>Policía Nacional: <span style={{ color: '#1976d2', fontWeight: 700 }}>105</span></div>
            <div>Bomberos: <span style={{ color: '#d90429', fontWeight: 700 }}>116</span></div>
            <div>SAMU (Emergencias Médicas): <span style={{ color: '#1db954', fontWeight: 700 }}>106</span></div>
            <div>Serenazgo: <span style={{ color: '#7c3aed', fontWeight: 700 }}>107</span></div>
          </div>
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Estadísticas del Sistema</h3>
            <div>Total de reportes: <b>{validIncidents.length}</b></div>
            <div>Entidades registradas: <b>6</b></div>
            <div>Zonas calientes detectadas: <b>0</b></div>
            <div>Algoritmos activos: <b>6</b></div>
          </div>
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Información del Proyecto</h3>
            <div>Curso: Análisis y Diseño de Algoritmos</div>
            <div>Sistema de Reporte de Incidentes</div>
            <div>Implementación de algoritmos de búsqueda, ordenamiento y clustering</div>
            <div style={{ fontSize: 14, color: '#888', marginTop: 8 }}>© 2025 - Proyecto Académico</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IncidentMap;
