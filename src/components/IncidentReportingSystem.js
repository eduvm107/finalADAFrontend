import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { AlertTriangle, MapPin, Plus, Navigation, MessageCircle, Phone, Users } from 'lucide-react';
import IncidentForm from './IncidentForm';
import IncidentMap from './IncidentMap';
import NearestEntities from './NearestEntities';
import IncidentForum from './IncidentForum';
import EmergencyContacts from './EmergencyContacts';
import AnalyticsPanel from './AnalyticsPanel';
import { emergencyEntities } from '../utils/data';
import { findNearestEntities, getHotZones, getFilteredIncidents } from '../utils/algorithms';
const IncidentReportingSystem = () => {
    const [activeTab, setActiveTab] = useState('map');
    const [incidents, setIncidents] = useState([]);
    const [newIncident, setNewIncident] = useState({
        type: '',
        description: '',
        location: { lat: -12.0464, lng: -77.0428 },
        anonymous: false,
        timestamp: new Date()
    });
    const [nearestEntitiesState, setNearestEntities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const handleSubmitIncident = () => {
        if (!newIncident.type)
            return;
        const incident = Object.assign(Object.assign({}, newIncident), { id: Date.now(), timestamp: new Date() });
        setIncidents(prev => [...prev, incident]);
        const nearest = findNearestEntities(newIncident.location.lat, newIncident.location.lng, 3);
        setNearestEntities(nearest);
        setNewIncident({
            type: '',
            description: '',
            location: { lat: -12.0464, lng: -77.0428 },
            anonymous: false,
            timestamp: new Date()
        });
        setActiveTab('entities');
    };
    const hotZones = getHotZones(incidents);
    const filteredIncidents = () => getFilteredIncidents(incidents, filterType, searchTerm);
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("header", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center py-4", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(AlertTriangle, { className: "w-8 h-8 text-red-600" }), _jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Sistema de Reporte de Incidentes" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Reportes en cola:" }), _jsx("span", { className: "bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium", children: incidents.length })] })] }) }) }), _jsx("nav", { className: "bg-white border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "flex space-x-8", children: [
                            { id: 'map', label: 'Mapa de Incidentes', icon: MapPin },
                            { id: 'report', label: 'Reportar Incidente', icon: Plus },
                            { id: 'entities', label: 'Entidades Cercanas', icon: Navigation },
                            { id: 'forum', label: 'Foro de Reportes', icon: MessageCircle },
                            { id: 'contacts', label: 'Contactos de Emergencia', icon: Phone },
                            { id: 'analytics', label: 'Análisis de Zonas', icon: Users }
                        ].map(({ id, label, icon: Icon }) => (_jsxs("button", { onClick: () => setActiveTab(id), className: `flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === id
                                ? 'border-red-500 text-red-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: [_jsx(Icon, { className: "w-4 h-4" }), _jsx("span", { children: label })] }, id))) }) }) }), _jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [activeTab === 'map' && _jsx(IncidentMap, { incidents: incidents }), activeTab === 'report' && (_jsx(IncidentForm, { newIncident: newIncident, setNewIncident: setNewIncident, handleSubmitIncident: handleSubmitIncident })), activeTab === 'entities' && (_jsx(NearestEntities, { nearestEntities: nearestEntitiesState })), activeTab === 'forum' && (_jsx(IncidentForum, { incidents: incidents, searchTerm: searchTerm, setSearchTerm: setSearchTerm, filterType: filterType, setFilterType: setFilterType, getFilteredIncidents: filteredIncidents })), activeTab === 'contacts' && (_jsx(EmergencyContacts, { emergencyEntities: emergencyEntities })), activeTab === 'analytics' && (_jsx(AnalyticsPanel, { incidents: incidents, nearestEntities: nearestEntitiesState, hotZones: hotZones }))] })] }));
};
export default IncidentReportingSystem;
