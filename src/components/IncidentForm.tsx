import React from 'react';
import { MapPin, RefreshCw, AlertCircle } from 'lucide-react';

// Componente para el formulario de reporte de incidentes
const IncidentForm = ({ 
  newIncident, 
  setNewIncident, 
  handleSubmitIncident, 
  locationLoading = false, 
  locationError = null, 
  refreshLocation 
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold mb-8 text-red-700 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-red-500" /> Reportar Nuevo Incidente
        </h2>
        <div className="space-y-8">
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-2">
              Tipo de Incidente <span className="text-red-500">*</span>
            </label>
            <select
              value={newIncident.type}
              onChange={(e) => setNewIncident(prev => ({ ...prev, type: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50 text-gray-700 text-base"
            >
              <option value="">Seleccionar tipo</option>
              <option value="robo">Robo</option>
              <option value="emergencia-medica">Emergencia Médica</option>
              <option value="violencia-familiar">Violencia Familiar</option>
              <option value="incendio">Incendio</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-2">
              Descripción <span className="text-gray-400 text-sm">(Opcional)</span>
            </label>
            <textarea
              value={newIncident.description}
              onChange={(e) => setNewIncident(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50 text-gray-700 text-base resize-none"
              placeholder="Describe brevemente el incidente..."
            />
          </div>          <div>
            <label className="block text-base font-semibold text-gray-700 mb-2">
              Ubicación
            </label>
            <div className="space-y-3">
              {/* Mostrar estado de la geolocalización */}
              {locationLoading ? (
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="text-base text-gray-700 font-medium">
                    Obteniendo ubicación...
                  </span>
                </div>
              ) : locationError ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-base text-red-700 font-medium">
                      {locationError}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <MapPin className="w-5 h-5 text-yellow-600" />
                    <span className="text-base text-gray-700 font-medium">
                      Usando ubicación por defecto: {newIncident.location.lat.toFixed(4)}, {newIncident.location.lng.toFixed(4)}
                    </span>
                    <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full font-semibold">
                      Lima, Perú
                    </span>
                  </div>
                  {refreshLocation && (
                    <button
                      type="button"
                      onClick={refreshLocation}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Intentar obtener ubicación nuevamente</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span className="text-base text-gray-700 font-medium">
                    GPS: {newIncident.location.lat.toFixed(4)}, {newIncident.location.lng.toFixed(4)}
                  </span>
                  <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full font-semibold">
                    Ubicación actual detectada
                  </span>
                  {refreshLocation && (
                    <button
                      type="button"
                      onClick={refreshLocation}
                      className="ml-auto flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Actualizar</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div><div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={newIncident.anonymous}
              onChange={(e) => setNewIncident(prev => ({ ...prev, anonymous: e.target.checked }))}
              className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="anonymous" className="block text-base text-gray-900 font-medium">
              Enviar de forma anónima
            </label>
          </div>
          {!newIncident.anonymous && (
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Tu nombre <span className="text-gray-400 text-sm">(Opcional)</span>
              </label>
              <input
                type="text"
                value={newIncident.userName || ''}
                onChange={(e) => setNewIncident(prev => ({ ...prev, userName: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50 text-gray-700 text-base"
                placeholder="Ingresa tu nombre (opcional)"
              />
            </div>
          )}
          <button
            onClick={handleSubmitIncident}
            disabled={!newIncident.type}
            className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white py-3 px-6 rounded-lg text-lg font-bold shadow-md hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
          >
            Reportar Incidente
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncidentForm;
