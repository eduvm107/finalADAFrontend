import { EmergencyEntity, incidentTypeMapping } from './emergencyEntitiesLima';

export interface NearestEntityResult {
  entity: EmergencyEntity;
  distance: number;
  relevanceScore: number;
  estimatedTime: string;
}

/**
 * Calcula la distancia entre dos puntos usando la fórmula de Haversine
 * @param lat1 Latitud del punto 1
 * @param lng1 Longitud del punto 1
 * @param lat2 Latitud del punto 2
 * @param lng2 Longitud del punto 2
 * @returns Distancia en kilómetros
 */
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Calcula el tiempo estimado de llegada basado en la distancia
 * @param distance Distancia en kilómetros
 * @param entityType Tipo de entidad para determinar velocidad promedio
 * @returns Tiempo estimado en minutos
 */
export const calculateEstimatedTime = (distance: number, entityType: string): string => {
  // Velocidades promedio en km/h según tipo de entidad
  const averageSpeeds = {
    'policia': 40, // Patrullero en Lima
    'hospital': 50, // Ambulancia
    'bomberos': 45, // Carro de bomberos
    'serenazgo': 35, // Patrullero municipal
    'defensa_civil': 40 // Vehículo de emergencia
  };
  
  const speed = averageSpeeds[entityType] || 35;
  const timeInHours = distance / speed;
  const timeInMinutes = Math.round(timeInHours * 60);
  
  if (timeInMinutes < 1) return "< 1 min";
  if (timeInMinutes < 60) return `${timeInMinutes} min`;
  
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
};

/**
 * Calcula un score de relevancia basado en el tipo de incidente y la entidad
 * @param incidentType Tipo de incidente
 * @param entityType Tipo de entidad
 * @param emergencyLevel Nivel de emergencia de la entidad
 * @returns Score de relevancia (0-100)
 */
export const calculateRelevanceScore = (
  incidentType: string, 
  entityType: string, 
  emergencyLevel: string
): number => {
  const relevantTypes = incidentTypeMapping[incidentType] || [];
  
  // Score base por relevancia del tipo
  let baseScore = 0;
  if (relevantTypes.includes(entityType)) {
    const index = relevantTypes.indexOf(entityType);
    baseScore = 100 - (index * 20); // Primera opción: 100, segunda: 80, etc.
  } else {
    baseScore = 30; // Score bajo para tipos no directamente relevantes
  }
  
  // Bonus por nivel de emergencia
  const emergencyBonus = {
    'especializado': 20,
    'intermedio': 10,
    'basico': 0
  };
  
  return Math.min(100, baseScore + (emergencyBonus[emergencyLevel] || 0));
};

/**
 * Encuentra las entidades de emergencia más cercanas y relevantes
 * @param userLat Latitud del usuario
 * @param userLng Longitud del usuario
 * @param incidentType Tipo de incidente
 * @param maxResults Número máximo de resultados (default: 5)
 * @param maxDistance Distancia máxima en km (default: 15)
 * @param entities Array de entidades disponibles
 * @returns Array de entidades ordenadas por relevancia y distancia
 */
export const findNearestEmergencyEntities = (
  userLat: number,
  userLng: number,
  incidentType: string,
  maxResults: number = 5,
  maxDistance: number = 15,
  entities: EmergencyEntity[] = []
): NearestEntityResult[] => {
  console.log(`🔍 Buscando entidades cercanas para incidente tipo: ${incidentType}`);
  console.log(`📍 Ubicación del usuario: ${userLat}, ${userLng}`);
  console.log(`🏥 Entidades disponibles: ${entities.length}`);
  
  const results: NearestEntityResult[] = [];
  
  // Calcular distancia y relevancia para cada entidad
  entities.forEach(entity => {
    const distance = calculateDistance(
      userLat, 
      userLng, 
      entity.coordinates.lat, 
      entity.coordinates.lng
    );
    
    // Filtrar por distancia máxima
    if (distance <= maxDistance) {
      const relevanceScore = calculateRelevanceScore(
        incidentType, 
        entity.type, 
        entity.emergencyLevel
      );
      
      const estimatedTime = calculateEstimatedTime(distance, entity.type);
      
      results.push({
        entity,
        distance,
        relevanceScore,
        estimatedTime
      });
    }
  });
  
  // Ordenar por score combinado (relevancia * 0.7 + proximidad * 0.3)
  results.sort((a, b) => {
    const scoreA = a.relevanceScore * 0.7 + (15 - a.distance) * 6.67 * 0.3; // Normalizar distancia a 0-100
    const scoreB = b.relevanceScore * 0.7 + (15 - b.distance) * 6.67 * 0.3;
    return scoreB - scoreA;
  });
  
  const finalResults = results.slice(0, maxResults);
  
  console.log(`✅ Encontradas ${finalResults.length} entidades relevantes:`);
  finalResults.forEach((result, index) => {
    console.log(`${index + 1}. ${result.entity.name} - ${result.distance.toFixed(2)}km - Relevancia: ${result.relevanceScore}% - ETA: ${result.estimatedTime}`);
  });
  
  return finalResults;
};

/**
 * Encuentra entidades por tipo específico
 * @param userLat Latitud del usuario
 * @param userLng Longitud del usuario
 * @param entityType Tipo de entidad específica
 * @param maxResults Número máximo de resultados
 * @param entities Array de entidades disponibles
 * @returns Array de entidades del tipo especificado
 */
export const findEntitiesByType = (
  userLat: number,
  userLng: number,
  entityType: string,
  maxResults: number = 3,
  entities: EmergencyEntity[] = []
): NearestEntityResult[] => {
  const entitiesOfType = entities.filter(entity => entity.type === entityType);
  
  const results: NearestEntityResult[] = entitiesOfType.map(entity => {
    const distance = calculateDistance(
      userLat,
      userLng,
      entity.coordinates.lat,
      entity.coordinates.lng
    );
    
    return {
      entity,
      distance,
      relevanceScore: 100, // Máxima relevancia para búsqueda específica
      estimatedTime: calculateEstimatedTime(distance, entity.type)
    };
  });
  
  // Ordenar por distancia
  results.sort((a, b) => a.distance - b.distance);
  
  return results.slice(0, maxResults);
};

/**
 * Obtiene estadísticas de cobertura de emergencias en un área
 * @param centerLat Latitud del centro
 * @param centerLng Longitud del centro
 * @param radius Radio en km
 * @param entities Array de entidades disponibles
 * @returns Estadísticas de cobertura
 */
export const getEmergencyCoverage = (
  centerLat: number,
  centerLng: number,
  radius: number = 5,
  entities: EmergencyEntity[] = []
) => {
  const entitiesInArea = entities.filter(entity => {
    const distance = calculateDistance(
      centerLat,
      centerLng,
      entity.coordinates.lat,
      entity.coordinates.lng
    );
    return distance <= radius;
  });
  
  const coverage = {
    total: entitiesInArea.length,
    byType: {
      policia: entitiesInArea.filter(e => e.type === 'policia').length,
      hospital: entitiesInArea.filter(e => e.type === 'hospital').length,
      bomberos: entitiesInArea.filter(e => e.type === 'bomberos').length,
      serenazgo: entitiesInArea.filter(e => e.type === 'serenazgo').length,
      defensa_civil: entitiesInArea.filter(e => e.type === 'defensa_civil').length,
    },
    averageDistance: entitiesInArea.length > 0 
      ? entitiesInArea.reduce((sum, entity) => {
          return sum + calculateDistance(centerLat, centerLng, entity.coordinates.lat, entity.coordinates.lng);
        }, 0) / entitiesInArea.length
      : 0
  };
  
  return coverage;
};
