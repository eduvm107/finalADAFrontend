// Componente para contactos de emergencia
import React from 'react';
import { Shield, Flame, Heart, Phone, MapPin } from 'lucide-react';

const EmergencyContacts = ({ emergencyEntities }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Contactos de Emergencia</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {emergencyEntities.map((entity) => (
          <div key={entity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                entity.type === 'police' ? 'bg-blue-100 text-blue-600' :
                entity.type === 'fire' ? 'bg-red-100 text-red-600' :
                'bg-green-100 text-green-600'
              }`}>
                {entity.type === 'police' ? <Shield className="w-6 h-6" /> :
                 entity.type === 'fire' ? <Flame className="w-6 h-6" /> :
                 <Heart className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{entity.name}</h3>
                <p className="text-sm text-gray-600 capitalize">
                  {entity.type === 'police' ? 'Policía' :
                   entity.type === 'fire' ? 'Bomberos' : 'Médico'}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-lg font-bold text-green-600">{entity.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{entity.address}</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
              Llamar Ahora
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyContacts;
