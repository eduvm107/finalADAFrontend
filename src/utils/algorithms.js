// Algoritmos reutilizables para el sistema
import { emergencyEntities } from './data';
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
export const findNearestEntities = (incidentLat, incidentLng, k = 3) => {
    const entitiesWithDistance = emergencyEntities.map(entity => (Object.assign(Object.assign({}, entity), { distance: calculateDistance(incidentLat, incidentLng, entity.lat, entity.lng) })));
    const quickSort = (arr) => {
        if (arr.length <= 1)
            return arr;
        const pivot = arr[Math.floor(arr.length / 2)];
        const left = arr.filter(x => x.distance < pivot.distance);
        const middle = arr.filter(x => x.distance === pivot.distance);
        const right = arr.filter(x => x.distance > pivot.distance);
        return [...quickSort(left), ...middle, ...quickSort(right)];
    };
    return quickSort(entitiesWithDistance).slice(0, k);
};
export const getHotZones = (incidents) => {
    const zones = {};
    incidents.forEach(incident => {
        const zoneKey = `${Math.floor(incident.location.lat * 100)}-${Math.floor(incident.location.lng * 100)}`;
        zones[zoneKey] = (zones[zoneKey] || 0) + 1;
    });
    return Object.entries(zones)
        .filter(([, count]) => Number(count) >= 2)
        .map(([zone, count]) => ({
        zone,
        count: Number(count),
        lat: parseFloat(zone.split('-')[0]) / 100,
        lng: parseFloat(zone.split('-')[1]) / 100
    }));
};
export const getFilteredIncidents = (incidents, filterType, searchTerm) => {
    let filtered = incidents;
    if (filterType !== 'all') {
        filtered = filtered.filter(incident => incident.type === filterType);
    }
    if (searchTerm) {
        filtered = filtered.filter(incident => incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            incident.type.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return filtered.sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateB - dateA;
    });
};
