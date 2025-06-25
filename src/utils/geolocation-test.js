// Test para verificar la funcionalidad de geolocalización
// Este archivo es solo para pruebas y se puede eliminar después

console.log('🧪 Iniciando pruebas de geolocalización...');

// Verificar que la API de geolocalización esté disponible
if (navigator.geolocation) {
  console.log('✅ API de geolocalización disponible');
  
  // Probar obtener ubicación
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log('✅ Ubicación obtenida exitosamente:');
      console.log(`📍 Latitud: ${position.coords.latitude}`);
      console.log(`📍 Longitud: ${position.coords.longitude}`);
      console.log(`🎯 Precisión: ${position.coords.accuracy} metros`);
      
      // Calcular distancia desde Lima (coordenadas por defecto)
      const limaLat = -12.0464;
      const limaLng = -77.0428;
      const distance = Math.sqrt(
        Math.pow(position.coords.latitude - limaLat, 2) + 
        Math.pow(position.coords.longitude - limaLng, 2)
      ) * 111.32; // Conversión aproximada a km
      
      console.log(`📏 Distancia desde Lima: ${distance.toFixed(2)} km`);
      
      if (distance < 50) {
        console.log('✅ Usuario parece estar en Lima o alrededores');
      } else {
        console.log('ℹ️ Usuario está lejos de Lima, ubicación real detectada');
      }
    },
    (error) => {
      console.error('❌ Error al obtener ubicación:');
      console.error(`Código: ${error.code}`);
      console.error(`Mensaje: ${error.message}`);
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.log('🚫 El usuario denegó el acceso a la ubicación');
          console.log('💡 Sugerencia: Permitir acceso a la ubicación en el navegador');
          break;
        case error.POSITION_UNAVAILABLE:
          console.log('📡 Información de ubicación no disponible');
          break;
        case error.TIMEOUT:
          console.log('⏱️ Tiempo de espera agotado');
          break;
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
} else {
  console.error('❌ API de geolocalización no disponible en este navegador');
}
