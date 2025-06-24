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

// Función para obtener todos los incidentes
export const getIncidents = async () => {
  try {
    console.log('Intentando obtener incidentes desde:', `${BASE_URL}/Incidents`);
    const response = await axios.get(`${BASE_URL}/Incidents`);
    console.log('Respuesta exitosa:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error detallado al obtener los incidentes:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error message:', error.message);
    throw error;
  }
};

// Función para crear un nuevo incidente
export const createIncident = async (incident: any) => {
  const response = await axios.post(`${BASE_URL}/Incidents`, incident);
  return response.data;
};

// Puedes agregar más funciones para otros endpoints siguiendo el mismo patrón
