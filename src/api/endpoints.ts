import axios from 'axios';

// Configuración de la URL base del backend
const BASE_URL = 'http://localhost:5262/api';

// Configuración del token JWT
let jwtToken = '';
export const setJwtToken = (token: string) => {
  jwtToken = token;
};

// Interceptor para agregar el token JWT a las solicitudes
axios.interceptors.request.use((config) => {
  if (jwtToken) {
    config.headers.Authorization = `Bearer ${jwtToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Función para obtener todos los contactos de emergencia
export const getEmergencyContacts = async () => {
  const response = await axios.get(`${BASE_URL}/EmergencyContacts`);
  return response.data;
};

// Función para obtener un contacto de emergencia por ID
export const getEmergencyContactById = async (id: number) => {
  const response = await axios.get(`${BASE_URL}/EmergencyContacts/${id}`);
  return response.data;
};

// Función para crear un contacto de emergencia
export const createEmergencyContact = async (contact: any) => {
  const response = await axios.post(`${BASE_URL}/EmergencyContacts`, contact);
  return response.data;
};

// Función para actualizar un contacto de emergencia
export const updateEmergencyContact = async (contact: any) => {
  const response = await axios.put(`${BASE_URL}/EmergencyContacts`, contact);
  return response.data;
};

// Función para eliminar un contacto de emergencia
export const deleteEmergencyContact = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/EmergencyContacts/${id}`);
  return response.data;
};

// ===== ENDPOINTS PARA ENTIDADES DE EMERGENCIA =====

// Función para obtener todas las entidades de emergencia
export const getEmergencyEntities = async () => {
  try {
    console.log('🔗 Obteniendo entidades de emergencia desde:', `${BASE_URL}/EmergencyEntities`);
    const response = await axios.get(`${BASE_URL}/EmergencyEntities`);
    console.log('✅ Entidades de emergencia obtenidas:', response.data);
    
    // Transformar los datos del backend al formato esperado por el frontend
    const transformedEntities = response.data.map((entity: any) => ({
      id: entity.entityId || entity.id,
      name: entity.name,
      type: entity.type,
      category: entity.category || entity.type,
      address: entity.address,
      district: entity.district || 'Lima',
      phone: entity.phone,
      coordinates: {
        lat: entity.lat,
        lng: entity.lng
      },
      services: entity.services ? entity.services.split(',') : [],
      available24h: entity.available24h || false,
      emergencyLevel: entity.emergencyLevel || 'basico'
    }));
    
    console.log('🔄 Entidades transformadas:', transformedEntities);
    return transformedEntities;
  } catch (error) {
    console.error('❌ Error al obtener entidades de emergencia:', error);
    console.error('🔍 Error response:', error.response?.data);
    console.error('📊 Error status:', error.response?.status);
    
    // En caso de error, devolver las entidades estáticas como fallback
    console.log('🔄 Usando datos estáticos como fallback');
    const { allEmergencyEntities } = await import('../utils/emergencyEntitiesLima');
    return allEmergencyEntities;
  }
};

// Función para obtener una entidad de emergencia por ID
export const getEmergencyEntityById = async (id: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/EmergencyEntities/${id}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener entidad por ID:', error);
    throw error;
  }
};

// Función para crear una entidad de emergencia
export const createEmergencyEntity = async (entity: any) => {
  try {
    console.log('📝 Creando entidad de emergencia:', entity);
    const response = await axios.post(`${BASE_URL}/EmergencyEntities`, entity);
    console.log('✅ Entidad creada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear entidad:', error);
    throw error;
  }
};

// Función para actualizar una entidad de emergencia
export const updateEmergencyEntity = async (entity: any) => {
  try {
    console.log('📝 Actualizando entidad de emergencia:', entity);
    const response = await axios.put(`${BASE_URL}/EmergencyEntities`, entity);
    console.log('✅ Entidad actualizada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al actualizar entidad:', error);
    throw error;
  }
};

// Función para eliminar una entidad de emergencia
export const deleteEmergencyEntity = async (id: number) => {
  try {
    const response = await axios.delete(`${BASE_URL}/EmergencyEntities/${id}`);
    console.log('✅ Entidad eliminada exitosamente');
    return response.data;
  } catch (error) {
    console.error('❌ Error al eliminar entidad:', error);
    throw error;
  }
};

// Función para obtener todos los incidentes
export const getIncidents = async () => {
  try {
    console.log('🔗 Intentando obtener incidentes desde:', `${BASE_URL}/Incidents`);
    const response = await axios.get(`${BASE_URL}/Incidents`);
    console.log('✅ Respuesta completa del backend:', response);
    console.log('📊 Datos de incidentes:', response.data);
    console.log('🔢 Cantidad de incidentes:', response.data?.length || 0);
    
    // Transformar los datos del backend al formato esperado por el frontend
    const transformedIncidents = response.data.map((incident: any) => ({
      id: incident.incidentId || incident.id,
      type: incident.type,
      description: incident.description,
      // El backend usa lat/lng directamente, no location.lat/lng
      lat: incident.lat,
      lng: incident.lng,
      anonymous: incident.anonymous,
      timestamp: incident.timestamp,
      userId: incident.userId
    }));
    
    console.log('🔄 Incidentes transformados:', transformedIncidents);
    return transformedIncidents;
  } catch (error) {
    console.error('❌ Error detallado al obtener los incidentes:', error);
    console.error('🔍 Error response:', error.response?.data);
    console.error('📊 Error status:', error.response?.status);
    console.error('📝 Error message:', error.message);
    throw error;
  }
};

// Función para crear un nuevo incidente
export const createIncident = async (incident: any) => {
  const response = await axios.post(`${BASE_URL}/Incidents`, incident);
  return response.data;
};

// ===== ENDPOINTS PARA COMENTARIOS =====

// Función para obtener comentarios de un incidente
export const getIncidentComments = async (incidentId: number) => {
  try {
    console.log('🔗 Obteniendo comentarios para incidente:', incidentId);
    const response = await axios.get(`${BASE_URL}/IncidentComments/incident/${incidentId}`);
    console.log('✅ Comentarios obtenidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener comentarios:', error);
    // Si no hay comentarios o el endpoint no existe, devolver array vacío
    return [];
  }
};

// Función para crear un nuevo comentario
export const createComment = async (comment: any) => {
  try {
    console.log('📝 Creando comentario:', comment);
    const response = await axios.post(`${BASE_URL}/IncidentComments`, comment);
    console.log('✅ Comentario creado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear comentario:', error);
    throw error;
  }
};

// Función para obtener todas las imágenes de un incidente
export const getIncidentImages = async (incidentId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/IncidentImages/incident/${incidentId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener imágenes:', error);
    return [];
  }
};

// Función para subir una imagen a un incidente
export const uploadIncidentImage = async (incidentId: number, imageData: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/IncidentImages`, {
      incidentId,
      ...imageData
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error al subir imagen:', error);
    throw error;
  }
};

// Puedes agregar más funciones para otros endpoints siguiendo el mismo patrón
