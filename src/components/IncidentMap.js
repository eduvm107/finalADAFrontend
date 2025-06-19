import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { MapPin } from 'lucide-react';
// Componente para el mapa de incidentes
const IncidentMap = ({ incidents }) => {
    return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Mapa de Incidentes Reportados" }), _jsxs("div", { className: "bg-gray-100 rounded-lg h-96 flex items-center justify-center relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100" }), _jsxs("div", { className: "relative z-10", children: [_jsx(MapPin, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 text-center", children: "Mapa Interactivo" }), _jsxs("p", { className: "text-sm text-gray-500 text-center mt-2", children: [incidents.length, " incidentes reportados"] })] }), incidents.map((incident, index) => (_jsx("div", { className: `absolute w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold ${incident.type === 'robo' ? 'bg-red-500' :
                            incident.type === 'emergencia-medica' ? 'bg-blue-500' :
                                incident.type === 'violencia-familiar' ? 'bg-purple-500' :
                                    incident.type === 'incendio' ? 'bg-orange-500' : 'bg-gray-500'}`, style: {
                            left: `${20 + (index % 5) * 15}%`,
                            top: `${20 + Math.floor(index / 5) * 20}%`
                        }, children: index + 1 }, incident.id)))] })] }));
};
export default IncidentMap;
