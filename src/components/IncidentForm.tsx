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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-2 md:px-4">
      <form className="w-full bg-white rounded-2xl shadow-xl border-2 border-black p-6 md:p-16 space-y-8" style={{ maxWidth: '100vw', width: '950px', boxShadow: '0 0 0 2px #000, 0 4px 24px 0 rgba(0,0,0,0.08)' }}>
        {/* Header */}
        <div className="text-center flex flex-col items-center w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4 shadow-md">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-red-600 mb-6" style={{textAlign: 'center', width: '100%'}}>Reportar Incidente</h1>
        </div>

        {/* Main Form */}
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border-4 border-black mx-auto mt-8" style={{ width: '100%', minWidth: '100%', maxWidth: '100%', minHeight: '400px', position: 'relative' }}>
              <div className="mt-6 ml-12" style={{ marginLeft: '48px', marginTop: '40px' }}>
                <div className="flex items-center mb-4">
                  <FileText className="w-7 h-7 mr-2 text-red-600" />
                  <span className="text-2xl font-bold text-red-600">Detalles del Incidente</span>
                </div>
                <div className="flex flex-col w-full">
                  {/* Combo box de tipo de incidente */}
                  <div className="w-full flex flex-col items-center mb-4">
                    <select
                      value={newIncident.type}
                      onChange={(e) => setNewIncident(prev => ({ ...prev, type: e.target.value }))}
                      className="w-[440px] h-16 px-6 py-3 text-lg border-2 border-black rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">🔍 Seleccionar tipo de incidente</option>
                      <option value="robo">🏃‍♂️ Robo</option>
                      <option value="emergencia-medica">🚑 Emergencia Médica</option>
                      <option value="violencia-familiar">👥 Violencia Familiar</option>
                      <option value="incendio">🔥 Incendio</option>
                      <option value="otro">❓ Otro</option>
                    </select>
                  </div>
                  {/* Espaciador visual grande entre select y textarea */}
                  <div style={{ height: '56px' }} />
                  {/* Campo de descripción */}
                  <div className="block w-full">
                    <textarea
                      value={newIncident.description}
                      onChange={(e) => setNewIncident(prev => ({ ...prev, description: e.target.value }))}
                      rows={8}
                      className="w-full h-52 px-7 py-6 text-base border-2 border-black rounded-[3rem] shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                      style={{ resize: 'none', width: '100%', maxWidth: '800px' }}
                      placeholder="Describe brevemente lo ocurrido, ubicación específica, personas involucradas, etc..."
                    />
                  </div>
                </div>
                {/* Ubicación GPS */}
                <div className="mt-10">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-red-500" />
                    Ubicación GPS
                  </h3>
                  {locationLoading ? (
                    <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border-2 border-black">
                      <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                      <div>
                        <p className="text-base text-blue-800 font-medium">Obteniendo ubicación...</p>
                        <p className="text-sm text-blue-600">Por favor, permite el acceso a tu ubicación</p>
                      </div>
                    </div>
                  ) : locationError ? (
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border-2 border-black">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-base text-red-800 font-medium">Error de ubicación</p>
                          <p className="text-sm text-red-600 mt-1">{locationError}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border-2 border-black">
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
                          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-black text-white border-2 border-black rounded-xl shadow-md hover:bg-gray-900 transition-all duration-200 font-semibold mt-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Reintentar obtener ubicación</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 bg-white rounded-xl border-2 border-black shadow-sm">
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
                            className="flex items-center space-x-2 px-4 py-3 bg-black text-white border-2 border-black rounded-xl shadow-md hover:bg-gray-900 transition-all duration-200 font-semibold"
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
                <div className="mt-10">
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
                        className="h-5 w-5 text-red-600 focus:ring-red-500 border-2 border-black rounded"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tu nombre <span className="text-gray-400 text-sm">(Opcional)</span>
                      </label>
                      <input
                        type="text"
                        value={newIncident.userName || ''}
                        onChange={(e) => setNewIncident(prev => ({ ...prev, userName: e.target.value }))}
                        className="w-[520px] border-2 border-black border-dotted rounded-none px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-white text-gray-700 text-base transition-all duration-200 hover:border-gray-700"
                        placeholder="Ingresa tu nombre (opcional)"
                        style={{ borderRadius: 0 }}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        💡 Proporcionar tu nombre puede ayudar en el seguimiento del caso
                      </p>
                    </div>
                  )}
                </div>

                {/* Botón de Envío y mensajes adicionales dentro del bloque principal */}
                <div className="pt-6 border-t-2 border-black flex flex-col items-center justify-center mt-10" style={{ maxWidth: '700px' }}>
                  <button
                    type="button"
                    onClick={handleSubmitIncident}
                    disabled={!newIncident.type}
                    className="bg-white text-black font-bold rounded-full px-8 py-4 text-base shadow-lg flex items-center justify-center gap-2 transition-all duration-300 border-2 border-black hover:bg-gray-100 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-black disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                    style={{ minWidth: '220px', letterSpacing: '0.04em' }}
                  >
                    {newIncident.type ? (
                      <>
                        <span className="mr-2">🚀</span>
                        ENVIAR REPORTE
                      </>
                    ) : (
                      <span>⚠️ Selecciona un tipo de incidente para continuar</span>
                    )}
                  </button>
                  {/* Información adicional */}
                  <div className="mt-4 text-center w-full">
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
          </div>
        </div>
      </form>
    </div>
  );
};

export default IncidentForm;