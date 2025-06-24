import { useState, useEffect } from 'react';

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    loading: true,
    error: null
  });
  useEffect(() => {
    console.log('🌍 useGeolocation: Iniciando hook de geolocalización...');
    
    if (!navigator.geolocation) {
      console.error('❌ useGeolocation: API no soportada');
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'La geolocalización no está soportada en este navegador'
      }));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutos
    };    const handleSuccess = (position: GeolocationPosition) => {
      console.log('✅ useGeolocation: Ubicación obtenida exitosamente');
      console.log(`📍 useGeolocation: Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`);
      console.log(`🎯 useGeolocation: Precisión: ${position.coords.accuracy} metros`);
      
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        loading: false,
        error: null
      });
    };    const handleError = (error: GeolocationPositionError) => {
      console.error('❌ useGeolocation: Error al obtener ubicación');
      console.error(`🔢 useGeolocation: Código de error: ${error.code}`);
      console.error(`📝 useGeolocation: Mensaje: ${error.message}`);
      
      let errorMessage = 'Error desconocido';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Acceso a la ubicación denegado por el usuario';
          console.log('🚫 useGeolocation: Usuario denegó el acceso');
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Información de ubicación no disponible';
          console.log('📡 useGeolocation: Ubicación no disponible');
          break;
        case error.TIMEOUT:
          errorMessage = 'Tiempo de espera agotado para obtener la ubicación';
          console.log('⏱️ useGeolocation: Timeout');
          break;
      }

      setLocation(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    };

    // Obtener ubicación inicial
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);

    // Opcional: Escuchar cambios de ubicación
    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);

    // Cleanup
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const refreshLocation = () => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null
        });
      },
      (error) => {
        let errorMessage = 'Error al obtener ubicación';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Acceso a la ubicación denegado';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Ubicación no disponible';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado';
            break;
        }
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: errorMessage
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0 // Forzar nueva lectura
      }
    );
  };

  return { ...location, refreshLocation };
};
