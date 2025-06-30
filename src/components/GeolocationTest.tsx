import React from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { MapPin, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

// Componente temporal para probar la geolocalización
const GeolocationTest = () => {
  const { latitude, longitude, loading, error, refreshLocation } = useGeolocation();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="bg-cyan-300 text-black p-8 rounded-2xl mb-8 shadow-2xl border-4 border-cyan-200" style={{backgroundColor: '#67e8f9', boxShadow: '0 25px 50px -12px rgba(103, 232, 249, 0.5)'}}>
        <h2 className="text-4xl font-black flex items-center justify-center gap-4 text-center">
          <MapPin className="w-10 h-10 text-black animate-pulse" />
          PRUEBA DE GEOLOCALIZACIÓN
          <MapPin className="w-10 h-10 text-black animate-pulse" />
        </h2>
      </div>
      
      <div className="space-y-4">
        {/* Estado actual */}
        <div className="p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">Estado Actual:</h3>
          
          {loading && (
            <div className="flex items-center space-x-3 text-blue-600">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Obteniendo ubicación...</span>
            </div>
          )}
          
          {error && (
            <div className="flex items-center space-x-3 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
          
          {!loading && !error && latitude && longitude && (
            <div className="flex items-center space-x-3 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span>Ubicación obtenida exitosamente</span>
            </div>
          )}
        </div>
        
        {/* Coordenadas */}
        {latitude && longitude && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-2 text-green-800">Coordenadas Detectadas:</h3>
            <div className="space-y-1 text-green-700">
              <div><strong>Latitud:</strong> {latitude.toFixed(6)}</div>
              <div><strong>Longitud:</strong> {longitude.toFixed(6)}</div>
              <div className="text-sm text-green-600 mt-2">
                <a 
                  href={`https://www.google.com/maps/@${latitude},${longitude},15z`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-green-800"
                >
                  Ver en Google Maps
                </a>
              </div>
            </div>
          </div>
        )}
        
        {/* Información adicional */}
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h3 className="font-semibold mb-2 text-gray-800">Información del Navegador:</h3>
          <div className="space-y-1 text-gray-600 text-sm">
            <div><strong>Geolocalización soportada:</strong> {navigator.geolocation ? 'Sí' : 'No'}</div>
            <div><strong>Protocolo:</strong> {window.location.protocol}</div>
            <div><strong>User Agent:</strong> {navigator.userAgent.substring(0, 80)}...</div>
          </div>
        </div>
        
        {/* Botón de actualizar */}
        <button
          onClick={refreshLocation}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Obteniendo ubicación...' : 'Actualizar Ubicación'}</span>
        </button>
        
        {/* Instrucciones */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold mb-2 text-blue-800">Instrucciones:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>Si es la primera vez, el navegador pedirá permiso para acceder a la ubicación</li>
            <li>Asegúrate de hacer clic en "Permitir" cuando aparezca el popup</li>
            <li>Si ya denegaste el permiso, ve a la configuración del sitio para habilitarlo</li>
            <li>La precisión puede variar según tu dispositivo y conexión</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GeolocationTest;
