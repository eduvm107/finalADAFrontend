import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const center: LatLngExpression = [-12.0464, -77.0428]; // Lima, Perú

// Componente para el mapa de incidentes
const IncidentMap = ({ incidents }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 fade-in">
      <h2 className="text-xl font-semibold mb-4">Mapa de Incidentes Reportados</h2>
      <div style={{ width: '100%', maxWidth: 1100, height: 600, borderRadius: 18, overflow: 'hidden', margin: '0 auto' }}>
        <MapContainer center={center} zoom={13} style={{ width: '100%', height: 600, borderRadius: 18 }} scrollWheelZoom={true}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {incidents.map((incident, idx) => (
            <Marker
              key={incident.id || idx}
              position={[incident.location.lat, incident.location.lng] as LatLngExpression}
            >
              <Popup>
                <b>Incidente #{idx + 1}</b><br />
                Tipo: {incident.type}<br />
                {incident.description && <span>Descripción: {incident.description}<br /></span>}
                Coordenadas: {incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}
              </Popup>
            </Marker>
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
            <div>Policía Nacional: <span style={{ color: '#1976d2', fontWeight: 700 }}>105</span></div>
            <div>Bomberos: <span style={{ color: '#d90429', fontWeight: 700 }}>116</span></div>
            <div>SAMU (Emergencias Médicas): <span style={{ color: '#1db954', fontWeight: 700 }}>106</span></div>
            <div>Serenazgo: <span style={{ color: '#7c3aed', fontWeight: 700 }}>107</span></div>
          </div>
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Estadísticas del Sistema</h3>
            <div>Total de reportes: <b>{incidents.length}</b></div>
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
