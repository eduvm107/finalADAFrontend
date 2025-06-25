import { useState, useEffect } from 'react';
import { getEmergencyEntities } from '../api/endpoints';
import { EmergencyEntity } from '../utils/emergencyEntitiesLima';

interface UseEmergencyEntitiesReturn {
  entities: EmergencyEntity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getEntitiesByType: (type: string) => EmergencyEntity[];
  getNearestEntities: (lat: number, lng: number, maxDistance?: number) => EmergencyEntity[];
}

export const useEmergencyEntities = (): UseEmergencyEntitiesReturn => {
  const [entities, setEntities] = useState<EmergencyEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntities = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Cargando entidades de emergencia...');
      
      const data = await getEmergencyEntities();
      setEntities(data);
      console.log('✅ Entidades cargadas:', data.length);
    } catch (err) {
      console.error('❌ Error al cargar entidades:', err);
      setError('Error al cargar las entidades de emergencia');
      
      // Como fallback, usar datos estáticos
      try {
        const { allEmergencyEntities } = await import('../utils/emergencyEntitiesLima');
        setEntities(allEmergencyEntities);
        console.log('🔄 Usando datos estáticos como fallback');
      } catch (fallbackErr) {
        console.error('❌ Error incluso con datos estáticos:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, []);

  const getEntitiesByType = (type: string): EmergencyEntity[] => {
    return entities.filter(entity => entity.type === type);
  };

  // Función para calcular distancia entre dos puntos (Haversine formula)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getNearestEntities = (lat: number, lng: number, maxDistance: number = 5): EmergencyEntity[] => {
    return entities
      .map(entity => ({
        ...entity,
        distance: calculateDistance(lat, lng, entity.coordinates.lat, entity.coordinates.lng)
      }))
      .filter(entity => entity.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);
  };

  return {
    entities,
    loading,
    error,
    refetch: fetchEntities,
    getEntitiesByType,
    getNearestEntities
  };
};
