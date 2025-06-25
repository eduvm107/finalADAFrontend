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
    <div className="incident-form-container min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto incident-form-animate">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full mb-4 incident-form-hover-effect shadow-lg">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Reportar Incidente
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Tu reporte ayuda a mantener segura a la comunidad. Completa la información necesaria para generar una alerta efectiva.
          </p>
        </div>

        {/* Main Form */}
        <div className="incident-form-card bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 w-full mx-auto">
          <div className="incident-form-gradient-header bg-gradient-to-r from-red-500 to-red-600 p-6">
            <div className="flex items-center justify-center">
              <Shield className="w-6 h-6 mr-3 text-white" />
              <h2 className="text-2xl font-bold text-white text-center">Información del Incidente</h2>
            </div>
          </div>

          <div className="p-6 md:p-8 lg:p-10">
            {/* Sección de Detalles del Incidente - Ancho completo */}
            <div className="mb-8">
              <div className="incident-form-section bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 lg:p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-center">
                  <FileText className="w-6 h-6 mr-3 text-red-500" />
                  Detalles del Incidente
                </h3>
                
                {/* Tipo de Incidente - Centrado */}
                <div className="mb-8 max-w-2xl mx-auto">
                  <label className="block text-lg font-semibold text-gray-700 mb-4 text-center">
                    Tipo de Incidente <span className="text-red-500 text-lg">*</span>
                  </label>
                  <select
                    value={newIncident.type}
                    onChange={(e) => setNewIncident(prev => ({ ...prev, type: e.target.value }))}
                    className="incident-form-input w-full border-2 border-gray-300 rounded-xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white text-gray-700 text-lg transition-all duration-200 hover:border-gray-400 shadow-sm text-center"
                  >
                    <option value="">🔍 Seleccionar tipo de incidente</option>
                    <option value="robo">🏃‍♂️ Robo</option>
                    <option value="emergencia-medica">🚑 Emergencia Médica</option>
                    <option value="violencia-familiar">👥 Violencia Familiar</option>
                    <option value="incendio">🔥 Incendio</option>
                    <option value="otro">❓ Otro</option>
                  </select>
                </div>

                {/* Descripción - Ancho completo pero contenido */}
                <div className="description-container w-full max-w-none">
                  <label className="block text-lg font-semibold text-gray-700 mb-4 text-center">
                    Descripción del Incidente <span className="text-gray-400 text-base font-normal">(Opcional)</span>
                  </label>
                  <textarea
                    value={newIncident.description}
                    onChange={(e) => setNewIncident(prev => ({ ...prev, description: e.target.value }))}
                    rows={5}
                    className="incident-form-input description-textarea w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white text-gray-700 text-base resize-y transition-all duration-200 hover:border-gray-400 shadow-sm min-h-[120px] max-w-full"
                    placeholder="Describe brevemente lo ocurrido, ubicación específica, personas involucradas, etc...&#10;&#10;Ejemplos:&#10;• ¿Qué pasó exactamente?&#10;• ¿Cuándo ocurrió?&#10;• ¿Hay personas heridas?&#10;• ¿Hay sospechosos o vehículos involucrados?&#10;• Cualquier detalle adicional importante..."
                  />
                  <p className="text-sm text-gray-500 mt-3 italic text-center">
                    💡 Incluye todos los detalles relevantes que puedan ayudar a las autoridades
                  </p>
                </div>
              </div>
            </div>

            {/* Grid para Ubicación y Datos Personales - Responsivo */}
            <div className="incident-form-grid grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full">
              
              {/* Ubicación GPS */}
              <div className="space-y-4 w-full">
                <div className="incident-form-section bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 lg:p-6 border border-gray-200 w-full">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-center">
                    <MapPin className="w-5 h-5 mr-2 text-red-500" />
                    Ubicación GPS
                  </h3>
                  
                  {locationLoading ? (
                    <div className="flex items-center space-x-4 p-6 bg-blue-50 rounded-xl border-2 border-blue-200 shadow-sm">
                      <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
                      <div>
                        <p className="text-lg text-blue-800 font-semibold">Obteniendo ubicación...</p>
                        <p className="text-base text-blue-600">Por favor, permite el acceso a tu ubicación</p>
                      </div>
                    </div>
                  ) : locationError ? (
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4 p-6 bg-red-50 rounded-xl border-2 border-red-200 shadow-sm">
                        <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
                        <div className="flex-1">
                          <p className="text-lg text-red-800 font-semibold">Error de ubicación</p>
                          <p className="text-base text-red-600 mt-2">{locationError}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-6 bg-yellow-50 rounded-xl border-2 border-yellow-200 shadow-sm">
                        <MapPin className="w-6 h-6 text-yellow-600" />
                        <div className="flex-1">
                          <p className="text-lg text-yellow-800 font-semibold">📍 Ubicación por defecto</p>
                          <p className="text-base text-yellow-700 font-mono">
                            Lima, Perú ({newIncident.location.lat.toFixed(4)}, {newIncident.location.lng.toFixed(4)})
                          </p>
                        </div>
                      </div>
                      {refreshLocation && (
                        <button
                          type="button"
                          onClick={refreshLocation}
                          className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 font-semibold text-lg shadow-lg"
                        >
                          <RefreshCw className="w-5 h-5" />
                          <span>Reintentar obtener ubicación</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-6 bg-green-50 rounded-xl border-2 border-green-200 shadow-sm">
                        <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="flex-1">
                          <p className="text-lg text-green-800 font-semibold">📍 Ubicación detectada</p>
                          <p className="text-base text-green-700 font-mono">
                            {newIncident.location.lat.toFixed(6)}, {newIncident.location.lng.toFixed(6)}
                          </p>
                        </div>
                        {refreshLocation && (
                          <button
                            type="button"
                            onClick={refreshLocation}
                            className="flex items-center space-x-2 px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-semibold"
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span>Actualizar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

              {/* Información Personal */}
              <div className="space-y-4 w-full">
                <div className="incident-form-section bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 lg:p-6 border border-gray-200 w-full">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-center">
                    <User className="w-5 h-5 mr-2 text-red-500" />
                    Información Personal
                  </h3>
                  
                  {/* Checkbox Anónimo */}
                  <div className="mb-6">
                    <label className="flex items-center space-x-4 cursor-pointer p-4 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
                      <input
                        type="checkbox"
                        id="anonymous"
                        checked={newIncident.anonymous}
                        onChange={(e) => setNewIncident(prev => ({ ...prev, anonymous: e.target.checked }))}
                        className="h-6 w-6 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <div>
                        <span className="text-lg text-gray-900 font-semibold">🔒 Enviar de forma anónima</span>
                        <p className="text-base text-gray-600">Tu identidad será protegida</p>
                      </div>
                    </label>
                  </div>

                  {/* Campo de nombre cuando no es anónimo */}
                  {!newIncident.anonymous && (
                    <div className="mt-6">
                      <label className="block text-base font-semibold text-gray-700 mb-4">
                        Tu nombre <span className="text-gray-400 text-sm font-normal">(Opcional)</span>
                      </label>
                      <input
                        type="text"
                        value={newIncident.userName || ''}
                        onChange={(e) => setNewIncident(prev => ({ ...prev, userName: e.target.value }))}
                        className="incident-form-input w-full border-2 border-gray-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white text-gray-700 text-lg transition-all duration-200 hover:border-gray-400 shadow-sm"
                        placeholder="Ingresa tu nombre (opcional)"
                      />
                      <p className="text-sm text-gray-500 mt-3 italic">
                        💡 Proporcionar tu nombre puede ayudar en el seguimiento del caso
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            </div>

            {/* Botón de Envío */}
            <div className="mt-8 pt-6 border-t-2 border-gray-200">
              <div className="flex flex-col items-center justify-center space-y-4 w-full">
                <div className="text-center max-w-lg">
                  <p className="text-base text-gray-600 font-medium mb-2">
                    🚨 Tu reporte será procesado inmediatamente
                  </p>
                  <p className="text-sm text-gray-500">
                    Las autoridades competentes serán notificadas automáticamente
                  </p>
                </div>
                
                <button
                  onClick={handleSubmitIncident}
                  disabled={!newIncident.type}
                  className="incident-form-button-enhanced relative group w-full max-w-lg mx-auto bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white py-4 px-8 rounded-xl text-lg font-bold hover:from-red-600 hover:via-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden border-2 border-red-300"
                >
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  
                  {newIncident.type ? (
                    <span className="relative flex items-center justify-center space-x-3">
                      <AlertTriangle className="w-6 h-6 animate-pulse" />
                      <span className="incident-button-text text-lg font-extrabold tracking-wide">🚨 ENVIAR REPORTE DE EMERGENCIA</span>
                      <AlertTriangle className="w-6 h-6 animate-pulse" />
                    </span>
                  ) : (
                    <span className="relative text-base font-semibold">⚠️ Selecciona un tipo de incidente para continuar</span>
                  )}
                </button>
                
                {/* Información adicional */}
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600 font-medium">
                    🔒 Tu reporte será procesado de forma segura y confidencial
                  </p>
                  <p className="text-xs text-gray-500">
                    Las autoridades correspondientes serán notificadas automáticamente
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con información adicional */}
        <div className="mt-8 text-center">
          <div className="incident-form-emergency-card bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border-2 border-blue-200 shadow-lg">
            <h4 className="text-xl font-bold text-blue-900 mb-4">📞 ¿Emergencia inmediata?</h4>
            <p className="text-sm text-blue-700 mb-4">Para situaciones que requieren atención inmediata, llama directamente:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="incident-form-emergency-item bg-white rounded-lg p-4 border-2 border-blue-200 shadow-md">
                <div className="font-bold text-blue-800 text-base mb-1">🚔 Policía</div>
                <div className="text-blue-600 font-mono text-xl font-bold">105</div>
              </div>
              <div className="incident-form-emergency-item bg-white rounded-lg p-4 border-2 border-blue-200 shadow-md">
                <div className="font-bold text-red-800 text-base mb-1">🚒 Bomberos</div>
                <div className="text-red-600 font-mono text-xl font-bold">116</div>
              </div>
              <div className="incident-form-emergency-item bg-white rounded-lg p-4 border-2 border-blue-200 shadow-md">
                <div className="font-bold text-green-800 text-base mb-1">🚑 SAMU</div>
                <div className="text-green-600 font-mono text-xl font-bold">106</div>
              </div>
              <div className="incident-form-emergency-item bg-white rounded-lg p-4 border-2 border-blue-200 shadow-md">
                <div className="font-bold text-purple-800 text-base mb-1">🏛️ Serenazgo</div>
                <div className="text-purple-600 font-mono text-xl font-bold">107</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentForm;
