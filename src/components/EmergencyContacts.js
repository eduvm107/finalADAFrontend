import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Componente para contactos de emergencia
import React from 'react';
import { Shield, Flame, Heart, Phone, MapPin } from 'lucide-react';
const EmergencyContacts = ({ emergencyEntities }) => {
    return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-6", children: "Contactos de Emergencia" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: emergencyEntities.map((entity) => (_jsxs("div", { className: "border rounded-lg p-4 hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-3", children: [_jsx("div", { className: `w-12 h-12 rounded-full flex items-center justify-center ${entity.type === 'police' ? 'bg-blue-100 text-blue-600' :
                                        entity.type === 'fire' ? 'bg-red-100 text-red-600' :
                                            'bg-green-100 text-green-600'}`, children: entity.type === 'police' ? _jsx(Shield, { className: "w-6 h-6" }) :
                                        entity.type === 'fire' ? _jsx(Flame, { className: "w-6 h-6" }) :
                                            _jsx(Heart, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900", children: entity.name }), _jsx("p", { className: "text-sm text-gray-600 capitalize", children: entity.type === 'police' ? 'Policía' :
                                                entity.type === 'fire' ? 'Bomberos' : 'Médico' })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Phone, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "text-lg font-bold text-green-600", children: entity.phone })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(MapPin, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "text-sm text-gray-600", children: entity.address })] })] }), _jsx("button", { className: "w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500", children: "Llamar Ahora" })] }, entity.id))) })] }));
};
export default EmergencyContacts;
