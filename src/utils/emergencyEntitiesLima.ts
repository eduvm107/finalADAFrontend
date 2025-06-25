// Base de datos completa de entidades de emergencia de Lima con coordenadas reales

export interface EmergencyEntity {
  id: number;
  name: string;
  type: 'policia' | 'hospital' | 'bomberos' | 'serenazgo' | 'defensa_civil';
  category: string;
  address: string;
  district: string;
  phone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  services: string[];
  available24h: boolean;
  emergencyLevel: 'basico' | 'intermedio' | 'especializado';
}

// Comisarías de Lima
export const policeStations: EmergencyEntity[] = [
  // Lima Centro
  {
    id: 1,
    name: "Comisaría Central de Lima",
    type: "policia",
    category: "Comisaría PNP",
    address: "Jr. Camaná 431, Cercado de Lima",
    district: "Lima",
    phone: "01-4281930",
    coordinates: { lat: -12.0464, lng: -77.0428 },
    services: ["Denuncias", "Emergencias", "Investigación Criminal", "Orden Público"],
    available24h: true,
    emergencyLevel: "especializado"
  },
  {
    id: 2,
    name: "Comisaría de San Isidro",
    type: "policia",
    category: "Comisaría PNP",
    address: "Av. Prescott 156, San Isidro",
    district: "San Isidro",
    phone: "01-4408270",
    coordinates: { lat: -12.0976, lng: -77.0365 },
    services: ["Denuncias", "Emergencias", "Seguridad Ciudadana"],
    available24h: true,
    emergencyLevel: "especializado"
  },
  {
    id: 3,
    name: "Comisaría de Miraflores",
    type: "policia",
    category: "Comisaría PNP",
    address: "Av. Grau 1156, Miraflores",
    district: "Miraflores",
    phone: "01-4457561",
    coordinates: { lat: -12.1211, lng: -77.0317 },
    services: ["Denuncias", "Emergencias", "Turismo", "Seguridad"],
    available24h: true,
    emergencyLevel: "especializado"
  },
  {
    id: 4,
    name: "Comisaría de La Victoria",
    type: "policia",
    category: "Comisaría PNP",
    address: "Av. México 1632, La Victoria",
    district: "La Victoria",
    phone: "01-4242830",
    coordinates: { lat: -12.0683, lng: -77.0326 },
    services: ["Denuncias", "Emergencias", "Orden Público"],
    available24h: true,
    emergencyLevel: "intermedio"
  },
  {
    id: 5,
    name: "Comisaría de San Borja",
    type: "policia",
    category: "Comisaría PNP",
    address: "Av. San Borja Norte 1040, San Borja",
    district: "San Borja",
    phone: "01-4758940",
    coordinates: { lat: -12.1089, lng: -77.0069 },
    services: ["Denuncias", "Emergencias", "Seguridad Ciudadana"],
    available24h: true,
    emergencyLevel: "especializado"
  },
  {
    id: 6,
    name: "Comisaría de Surquillo",
    type: "policia",
    category: "Comisaría PNP",
    address: "Av. Tomás Marsano 2632, Surquillo",
    district: "Surquillo",
    phone: "01-4481142",
    coordinates: { lat: -12.1093, lng: -77.0175 },
    services: ["Denuncias", "Emergencias", "Investigación"],
    available24h: true,
    emergencyLevel: "intermedio"
  },
  {
    id: 7,
    name: "Comisaría de Pueblo Libre",
    type: "policia",
    category: "Comisaría PNP",
    address: "Av. Bolivar 1440, Pueblo Libre",
    district: "Pueblo Libre",
    phone: "01-4613020",
    coordinates: { lat: -12.0742, lng: -77.0622 },
    services: ["Denuncias", "Emergencias", "Orden Público"],
    available24h: true,
    emergencyLevel: "intermedio"
  },
  {
    id: 8,
    name: "Comisaría de Jesús María",
    type: "policia",
    category: "Comisaría PNP",
    address: "Av. Brasil 2849, Jesús María",
    district: "Jesús María",
    phone: "01-4331070",
    coordinates: { lat: -12.0742, lng: -77.0486 },
    services: ["Denuncias", "Emergencias", "Seguridad"],
    available24h: true,
    emergencyLevel: "especializado"
  }
];

// Hospitales de Lima
export const hospitals: EmergencyEntity[] = [
  {
    id: 101,
    name: "Hospital Nacional Dos de Mayo",
    type: "hospital",
    category: "Hospital Nacional",
    address: "Av. Grau cuadra 13, Cercado de Lima",
    district: "Lima",
    phone: "01-3281818",
    coordinates: { lat: -12.0569, lng: -77.0440 },
    services: ["Emergencias", "Cirugía", "UCI", "Trauma", "Cardiología"],
    available24h: true,
    emergencyLevel: "especializado"
  },
  {
    id: 102,
    name: "Hospital Nacional Guillermo Almenara Irigoyen",
    type: "hospital",
    category: "Hospital EsSalud",
    address: "Av. Grau 800, La Victoria",
    district: "La Victoria",
    phone: "01-3242983",
    coordinates: { lat: -12.0689, lng: -77.0372 },
    services: ["Emergencias", "Especialidades", "UCI", "Cardiología", "Neurología"],
    available24h: true,
    emergencyLevel: "especializado"
  },
  {
    id: 103,
    name: "Hospital Rebagliati",
    type: "hospital",
    category: "Hospital EsSalud",
    address: "Av. Rebagliati 490, Jesús María",
    district: "Jesús María",
    phone: "01-2658484",
    coordinates: { lat: -12.0817, lng: -77.0531 },
    services: ["Emergencias", "Especialidades", "Transplantes", "UCI", "Oncología"],
    available24h: true,
    emergencyLevel: "especializado"
  },
  {
    id: 104,
    name: "Clínica Anglo Americana",
    type: "hospital",
    category: "Clínica Privada",
    address: "Av. Alfredo Salazar 314, San Isidro",
    district: "San Isidro",
    phone: "01-6166000",
    coordinates: { lat: -12.0889, lng: -77.0364 },
    services: ["Emergencias", "Cirugía", "UCI", "Especialidades"],
    available24h: true,
    emergencyLevel: "especializado"
  },
  {
    id: 105,
    name: "Hospital Nacional Arzobispo Loayza",
    type: "hospital",
    category: "Hospital Nacional",
    address: "Av. Alfonso Ugarte 848, Cercado de Lima",
    district: "Lima",
    phone: "01-6142500",
    coordinates: { lat: -12.0556, lng: -77.0497 },
    services: ["Emergencias", "Cirugía", "UCI", "Pediatría"],
    available24h: true,
    emergencyLevel: "especializado"
  },
  {
    id: 106,
    name: "Clínica Ricardo Palma",
    type: "hospital",
    category: "Clínica Privada",
    address: "Av. Javier Prado Este 1066, San Isidro",
    district: "San Isidro",
    phone: "01-2244040",
    coordinates: { lat: -12.0936, lng: -77.0281 },
    services: ["Emergencias", "Cirugía", "UCI", "Especialidades"],
    available24h: true,
    emergencyLevel: "especializado"
  }
];

// Estaciones de Bomberos de Lima
export const fireStations: EmergencyEntity[] = [
  {
    id: 201,
    name: "Compañía de Bomberos N° 1 Roma",
    type: "bomberos",
    category: "Estación de Bomberos",
    address: "Jr. Huancavelica 281, Cercado de Lima",
    district: "Lima",
    phone: "01-4277978",
    coordinates: { lat: -12.0464, lng: -77.0397 },
    services: ["Incendios", "Rescate", "Emergencias", "Materiales Peligrosos"],
    available24h: true,
    emergencyLevel: "especializado"
  },
  {
    id: 202,
    name: "Compañía de Bomberos N° 10 Miraflores",
    type: "bomberos",
    category: "Estación de Bomberos",
    address: "Av. Benavides 515, Miraflores",
    district: "Miraflores",
    phone: "01-4450202",
    coordinates: { lat: -12.1197, lng: -77.0358 },
    services: ["Incendios", "Rescate", "Emergencias Médicas", "Accidentes"],
    available24h: true,
    emergencyLevel: "especializado"
  },
  {
    id: 203,
    name: "Compañía de Bomberos N° 26 San Isidro",
    type: "bomberos",
    category: "Estación de Bomberos",
    address: "Av. Aramburú 166, San Isidro",
    district: "San Isidro",
    phone: "01-4220202",
    coordinates: { lat: -12.0969, lng: -77.0450 },
    services: ["Incendios", "Rescate", "Emergencias", "Materiales Peligrosos"],
    available24h: true,
    emergencyLevel: "especializado"
  },
  {
    id: 204,
    name: "Compañía de Bomberos N° 15 La Victoria",
    type: "bomberos",
    category: "Estación de Bomberos",
    address: "Av. México 1845, La Victoria",
    district: "La Victoria",
    phone: "01-4241515",
    coordinates: { lat: -12.0708, lng: -77.0347 },
    services: ["Incendios", "Rescate", "Emergencias", "Accidentes"],
    available24h: true,
    emergencyLevel: "especializado"
  },
  {
    id: 205,
    name: "Compañía de Bomberos N° 35 Surco",
    type: "bomberos",
    category: "Estación de Bomberos",
    address: "Av. Primavera 1400, Surco",
    district: "Santiago de Surco",
    phone: "01-4483535",
    coordinates: { lat: -12.1350, lng: -77.0175 },
    services: ["Incendios", "Rescate", "Emergencias", "Accidentes"],
    available24h: true,
    emergencyLevel: "especializado"
  }
];

// Centrales de Serenazgo
export const serenazgoStations: EmergencyEntity[] = [
  {
    id: 301,
    name: "Central de Serenazgo de Lima",
    type: "serenazgo",
    category: "Serenazgo Municipal",
    address: "Av. Abancay 267, Cercado de Lima",
    district: "Lima",
    phone: "01-3154040",
    coordinates: { lat: -12.0489, lng: -77.0386 },
    services: ["Seguridad Ciudadana", "Patrullaje", "Apoyo Policial", "Emergencias"],
    available24h: true,
    emergencyLevel: "basico"
  },
  {
    id: 302,
    name: "Serenazgo de Miraflores",
    type: "serenazgo",
    category: "Serenazgo Municipal",
    address: "Av. Larco 400, Miraflores",
    district: "Miraflores",
    phone: "01-6177777",
    coordinates: { lat: -12.1206, lng: -77.0317 },
    services: ["Seguridad Ciudadana", "Patrullaje", "Turismo", "Emergencias"],
    available24h: true,
    emergencyLevel: "intermedio"
  },
  {
    id: 303,
    name: "Serenazgo de San Isidro",
    type: "serenazgo",
    category: "Serenazgo Municipal",
    address: "Av. del Ejército 496, San Isidro",
    district: "San Isidro",
    phone: "01-5137777",
    coordinates: { lat: -12.0958, lng: -77.0394 },
    services: ["Seguridad Ciudadana", "Patrullaje", "Apoyo Empresarial", "Emergencias"],
    available24h: true,
    emergencyLevel: "intermedio"
  },
  {
    id: 304,
    name: "Serenazgo de La Victoria",
    type: "serenazgo",
    category: "Serenazgo Municipal",
    address: "Av. México 1681, La Victoria",
    district: "La Victoria",
    phone: "01-6377777",
    coordinates: { lat: -12.0689, lng: -77.0331 },
    services: ["Seguridad Ciudadana", "Patrullaje", "Orden Público", "Emergencias"],
    available24h: true,
    emergencyLevel: "basico"
  }
];

// Defensa Civil
export const defensaCivilStations: EmergencyEntity[] = [
  {
    id: 401,
    name: "INDECI - Instituto Nacional de Defensa Civil",
    type: "defensa_civil",
    category: "Defensa Civil Nacional",
    address: "Calle Ricardo Angulo 694, San Isidro",
    district: "San Isidro",
    phone: "01-2257777",
    coordinates: { lat: -12.0997, lng: -77.0364 },
    services: ["Desastres Naturales", "Emergencias", "Evacuación", "Prevención"],
    available24h: true,
    emergencyLevel: "especializado"
  },
  {
    id: 402,
    name: "Defensa Civil Lima Metropolitana",
    type: "defensa_civil",
    category: "Defensa Civil Regional",
    address: "Jr. de la Unión 300, Cercado de Lima",
    district: "Lima",
    phone: "01-6337777",
    coordinates: { lat: -12.0464, lng: -77.0369 },
    services: ["Emergencias", "Coordinación", "Evacuación", "Apoyo Logístico"],
    available24h: true,
    emergencyLevel: "especializado"
  }
];

// Consolidar todas las entidades
export const allEmergencyEntities: EmergencyEntity[] = [
  ...policeStations,
  ...hospitals,
  ...fireStations,
  ...serenazgoStations,
  ...defensaCivilStations
];

// Mapeo de tipos de incidentes a entidades recomendadas
export const incidentTypeMapping = {
  'robo': ['policia', 'serenazgo'],
  'emergencia-medica': ['hospital', 'bomberos'],
  'violencia-familiar': ['policia', 'hospital'],
  'incendio': ['bomberos', 'policia', 'defensa_civil'],
  'otro': ['policia', 'serenazgo', 'defensa_civil']
};

export default allEmergencyEntities;
