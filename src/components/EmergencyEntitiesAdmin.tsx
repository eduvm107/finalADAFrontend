import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Phone, Building } from 'lucide-react';
import { 
  getEmergencyEntities, 
  createEmergencyEntity, 
  updateEmergencyEntity, 
  deleteEmergencyEntity 
} from '../api/endpoints';
import { EmergencyEntity } from '../utils/emergencyEntitiesLima';
import { useAuth } from '../hooks/useAuth';
import LoginForm from './LoginForm';

interface EmergencyEntityFormData {
  name: string;
  type: 'policia' | 'hospital' | 'bomberos' | 'serenazgo' | 'defensa_civil';
  address: string;
  district: string;
  phone: string;
  lat: number;
  lng: number;
}

const EmergencyEntitiesAdmin: React.FC = () => {
  const [authChanged, setAuthChanged] = useState(false);
  const isAuthenticated = useAuth();
  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={() => setAuthChanged(!authChanged)} />;
  }

  const [entities, setEntities] = useState<EmergencyEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEntity, setEditingEntity] = useState<EmergencyEntity | null>(null);
  const [formData, setFormData] = useState<EmergencyEntityFormData>({
    name: '',
    type: 'policia',
    address: '',
    district: '',
    phone: '',
    lat: -12.0464,
    lng: -77.0428
  });

  useEffect(() => {
    loadEntities();
  }, []);

  const loadEntities = async () => {
    try {
      setLoading(true);
      const data = await getEmergencyEntities();
      setEntities(data);
    } catch (error) {
      console.error('Error al cargar entidades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEntity) {
        await updateEmergencyEntity({ ...formData, id: editingEntity.id });
      } else {
        await createEmergencyEntity(formData);
      }
      
      setShowForm(false);
      setEditingEntity(null);
      resetForm();
      loadEntities();
    } catch (error) {
      console.error('Error al guardar entidad:', error);
    }
  };

  const handleEdit = (entity: EmergencyEntity) => {
    setEditingEntity(entity);
    setFormData({
      name: entity.name,
      type: entity.type,
      address: entity.address,
      district: entity.district,
      phone: entity.phone,
      lat: entity.coordinates.lat,
      lng: entity.coordinates.lng
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta entidad?')) {
      try {
        await deleteEmergencyEntity(id);
        loadEntities();
      } catch (error) {
        console.error('Error al eliminar entidad:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'policia',
      address: '',
      district: '',
      phone: '',
      lat: -12.0464,
      lng: -77.0428
    });
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'policia': 'bg-blue-100 text-blue-600 border-blue-200',
      'hospital': 'bg-red-100 text-red-600 border-red-200',
      'bomberos': 'bg-orange-100 text-orange-600 border-orange-200',
      'serenazgo': 'bg-purple-100 text-purple-600 border-purple-200',
      'defensa_civil': 'bg-yellow-100 text-yellow-600 border-yellow-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'policia': 'Policía',
      'hospital': 'Hospital',
      'bomberos': 'Bomberos',
      'serenazgo': 'Serenazgo',
      'defensa_civil': 'Defensa Civil'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Cargando entidades de emergencia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Administración de Entidades de Emergencia
        </h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingEntity(null);
            resetForm();
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Agregar Entidad
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {['policia', 'hospital', 'bomberos', 'serenazgo', 'defensa_civil'].map(type => (
          <div key={type} className={`p-4 rounded-lg border ${getTypeColor(type)}`}>
            <div className="text-2xl font-bold">
              {entities.filter(e => e.type === type).length}
            </div>
            <div className="text-sm">{getTypeLabel(type)}</div>
          </div>
        ))}
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">
              {editingEntity ? 'Editar Entidad' : 'Nueva Entidad'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="policia">Policía</option>
                  <option value="hospital">Hospital</option>
                  <option value="bomberos">Bomberos</option>
                  <option value="serenazgo">Serenazgo</option>
                  <option value="defensa_civil">Defensa Civil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Dirección</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Distrito</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Teléfono</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Latitud</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Longitud</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
                >
                  {editingEntity ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingEntity(null);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de entidades */}
      <div className="space-y-4">
        {entities.map((entity) => (
          <div key={entity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{entity.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${getTypeColor(entity.type)}`}>
                    {getTypeLabel(entity.type)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {entity.address}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {entity.phone}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {entity.coordinates.lat.toFixed(4)}, {entity.coordinates.lng.toFixed(4)}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(entity)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(entity.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {entities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay entidades registradas. Agrega la primera entidad.
        </div>
      )}
    </div>
  );
};

export default EmergencyEntitiesAdmin;
