import React from 'react';
import { MapPin, RefreshCw, AlertCircle, Shield, User, FileText, AlertTriangle } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Reportar Incidente</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tu reporte ayuda a mantener segura a la comunidad. Completa la información necesaria para generar una alerta efectiva.
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
            <div className="flex items-center justify-center text-white">
              <Shield className="w-6 h-6 mr-2" />
              <h2 className="text-xl font-semibold">Información del Incidente</h2>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Columna Izquierda - Información del Incidente */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-red-500" />
                    Detalles del Incidente
                  </h3>
                  
                  {/* Tipo de Incidente */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Tipo de Incidente <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newIncident.type}
                      onChange={(e) => setNewIncident(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white text-gray-700 text-base transition-all duration-200 hover:border-gray-300"
                    >
                      <option value="">🔍 Seleccionar tipo de incidente</option>
                      <option value="robo">🏃‍♂️ Robo</option>
                      <option value="emergencia-medica">🚑 Emergencia Médica</option>
                      <option value="violencia-familiar">👥 Violencia Familiar</option>
                      <option value="incendio">🔥 Incendio</option>
                      <option value="otro">❓ Otro</option>
                    </select>
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Descripción del Incidente <span className="text-gray-400 text-sm">(Opcional)</span>
                    </label>
                    <textarea
                      value={newIncident.description}
                      onChange={(e) => setNewIncident(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white text-gray-700 text-base resize-none transition-all duration-200 hover:border-gray-300"
                      placeholder="Describe brevemente lo ocurrido, ubicación específica, personas involucradas, etc..."
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      💡 Incluye todos los detalles relevantes que puedan ayudar a las autoridades
                    </p>
                  </div>
                </div>
              </div>

              {/* Columna Derecha - Ubicación y Datos Personales */}
              <div className="space-y-6">
                
                {/* Ubicación GPS */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-red-500" />
                    Ubicación GPS
                  </h3>
                  
                  {locationLoading ? (
                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                      <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                      <div>
                        <p className="text-base text-blue-800 font-medium">Obteniendo ubicación...</p>
                        <p className="text-sm text-blue-600">Por favor, permite el acceso a tu ubicación</p>
                      </div>
                    </div>
                  ) : locationError ? (
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-xl border-2 border-red-200">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-base text-red-800 font-medium">Error de ubicación</p>
                          <p className="text-sm text-red-600 mt-1">{locationError}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                        <MapPin className="w-5 h-5 text-yellow-600" />
                        <div className="flex-1">
                          <p className="text-base text-yellow-800 font-medium">Ubicación por defecto</p>
                          <p className="text-sm text-yellow-700">
                            Lima, Perú ({newIncident.location.lat.toFixed(4)}, {newIncident.location.lng.toFixed(4)})
                          </p>
                        </div>
                      </div>
                      {refreshLocation && (
                        <button
                          type="button"
                          onClick={refreshLocation}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 font-medium"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Reintentar obtener ubicación</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="flex-1">
                          <p className="text-base text-green-800 font-medium">📍 Ubicación detectada</p>
                          <p className="text-sm text-green-700 font-mono">
                            {newIncident.location.lat.toFixed(6)}, {newIncident.location.lng.toFixed(6)}
                          </p>
                        </div>
                        {refreshLocation && (
                          <button
                            type="button"
                            onClick={refreshLocation}
                            className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Actualizar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Información Personal */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-red-500" />
                    Información Personal
                  </h3>
                  
                  {/* Checkbox Anónimo */}
                  <div className="mb-4">
                    <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        id="anonymous"
                        checked={newIncident.anonymous}
                        onChange={(e) => setNewIncident(prev => ({ ...prev, anonymous: e.target.checked }))}
                        className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <div>
                        <span className="text-base text-gray-900 font-medium">🔒 Enviar de forma anónima</span>
                        <p className="text-sm text-gray-600">Tu identidad será protegida</p>
                      </div>
                    </label>
                  </div>

                  {/* Campo de nombre cuando no es anónimo */}
                  {!newIncident.anonymous && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Tu nombre <span className="text-gray-400 text-sm">(Opcional)</span>
                      </label>
                      <input
                        type="text"
                        value={newIncident.userName || ''}
                        onChange={(e) => setNewIncident(prev => ({ ...prev, userName: e.target.value }))}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white text-gray-700 text-base transition-all duration-200 hover:border-gray-300"
                        placeholder="Ingresa tu nombre (opcional)"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        💡 Proporcionar tu nombre puede ayudar en el seguimiento del caso
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Botón de Envío */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleSubmitIncident}
                disabled={!newIncident.type}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-8 rounded-2xl text-lg font-bold shadow-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100"
              >
                {newIncident.type ? (
                  <span className="flex items-center justify-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>🚨 Enviar Reporte de Emergencia</span>
                  </span>
                ) : (
                  <span>⚠️ Selecciona un tipo de incidente para continuar</span>
                )}
              </button>
              
              {/* Información adicional */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  🔒 Tu reporte será procesado de forma segura y confidencial
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Las autoridades correspondientes serán notificadas automáticamente
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con información adicional */}
        <div className="mt-8 text-center">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">📞 ¿Emergencia inmediata?</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="font-bold text-blue-800">🚔 Policía</div>
                <div className="text-blue-600 font-mono text-lg">105</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="font-bold text-red-800">🚒 Bomberos</div>
                <div className="text-red-600 font-mono text-lg">116</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="font-bold text-green-800">🚑 SAMU</div>
                <div className="text-green-600 font-mono text-lg">106</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="font-bold text-purple-800">🏛️ Serenazgo</div>
                <div className="text-purple-600 font-mono text-lg">107</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentForm;
