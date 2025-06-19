import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Shield, Flame, Heart, Phone, Navigation } from 'lucide-react';
// Componente para mostrar entidades cercanas
const NearestEntities = ({ nearestEntities }) => {
    return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Entidades de Emergencia M\u00E1s Cercanas" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Algoritmo K-Nearest Neighbors aplicado para encontrar las 3 entidades m\u00E1s cercanas" }), nearestEntities.length > 0 ? (_jsx("div", { className: "space-y-4", children: nearestEntities.map((entity, index) => (_jsx("div", { className: "border rounded-lg p-4 hover:bg-gray-50", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center ${entity.type === 'police' ? 'bg-blue-100 text-blue-600' :
                                            entity.type === 'fire' ? 'bg-red-100 text-red-600' :
                                                'bg-green-100 text-green-600'}`, children: entity.type === 'police' ? _jsx(Shield, { className: "w-5 h-5" }) :
                                            entity.type === 'fire' ? _jsx(Flame, { className: "w-5 h-5" }) :
                                                _jsx(Heart, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900", children: entity.name }), _jsx("p", { className: "text-sm text-gray-600", children: entity.address }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Distancia: ", entity.distance.toFixed(2), " km"] })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-lg font-bold text-green-600", children: entity.phone }), _jsx(Phone, { className: "w-5 h-5 text-green-600" })] })] }) }, entity.id))) })) : (_jsxs("div", { className: "text-center py-8", children: [_jsx(Navigation, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Reporta un incidente para ver las entidades m\u00E1s cercanas" })] }))] }));
};
export default NearestEntities;
