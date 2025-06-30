import React, { useEffect, useState } from 'react';
import { 
  Search, Filter, MessageCircle, Clock, MapPin, AlertTriangle, Shield, Heart, Home, Flame,
  Send, ThumbsUp, Share2, MoreHorizontal, User, Eye, EyeOff, Globe, Lock
} from 'lucide-react';
import { getIncidents, getIncidentComments, createComment } from '../api/endpoints';

const getIncidentIcon = (type) => {
  const icons = {
    'robo': <Shield className="w-5 h-5" />,
    'emergencia-medica': <Heart className="w-5 h-5" />,
    'violencia-familiar': <Home className="w-5 h-5" />,
    'incendio': <Flame className="w-5 h-5" />,
    'otro': <AlertTriangle className="w-5 h-5" />
  };
  return icons[type] || <AlertTriangle className="w-5 h-5" />;
};

const getIncidentColor = (type) => {
  const colors = {
    'robo': 'from-red-500 to-red-600',
    'emergencia-medica': 'from-blue-500 to-blue-600',
    'violencia-familiar': 'from-purple-500 to-purple-600',
    'incendio': 'from-orange-500 to-orange-600',
    'otro': 'from-gray-500 to-gray-600'
  };
  return colors[type] || 'from-gray-500 to-gray-600';
};

const getIncidentBadgeColor = (type) => {
  const colors = {
    'robo': 'bg-red-100 text-red-800 border-red-200',
    'emergencia-medica': 'bg-blue-100 text-blue-800 border-blue-200',
    'violencia-familiar': 'bg-purple-100 text-purple-800 border-purple-200',
    'incendio': 'bg-orange-100 text-orange-800 border-orange-200',
    'otro': 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
};

// Componente para un post individual (estilo red social)
const IncidentPost = ({ incident, onCommentAdd }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  // Cargar comentarios cuando se abra la sección
  useEffect(() => {
    if (showComments && comments.length === 0) {
      loadComments();
    }
  }, [showComments]);

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const incidentComments = await getIncidentComments(incident.id);
      setComments(incidentComments || []);
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsCommenting(true);
    try {
      const commentData = {
        incidentId: incident.id,
        comment: newComment.trim(),
        userId: 1, // Por ahora usuario fijo
        timestamp: new Date().toISOString()
      };

      const createdComment = await createComment(commentData);
      setComments(prev => [...prev, createdComment]);
      setNewComment('');
      onCommentAdd && onCommentAdd(incident.id);
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      alert('Error al enviar comentario. Inténtalo de nuevo.');
    } finally {
      setIsCommenting(false);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Hace un momento';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} h`;
    return `Hace ${Math.floor(diffInMinutes / 1440)} días`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 mx-2 lg:mx-4"> {/* Agregado margen horizontal */}
      {/* Header del post */}
      <div className="p-8 pb-6"> {/* Aumentado padding de p-6 pb-4 a p-8 pb-6 */}
        <div className="flex items-start space-x-6"> {/* Aumentado espacio de space-x-4 a space-x-6 */}
          {/* Avatar */}
          <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${getIncidentColor(incident.type)} flex items-center justify-center text-white shadow-lg`}> {/* Aumentado tamaño de w-12 h-12 a w-14 h-14 */}
            {getIncidentIcon(incident.type)}
          </div>
          
          {/* Información del usuario y post */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2"> {/* Aumentado espacio y margen */}
              <h3 className="font-semibold text-gray-900 text-lg"> {/* Texto más grande */}
                {incident.anonymous ? 'Usuario Anónimo' : `Usuario #${incident.userId}`}
              </h3>
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getIncidentBadgeColor(incident.type)}`}> {/* Más padding */}
                {incident.type?.replace('-', ' ').toUpperCase()}
              </span>
              {incident.anonymous ? <Lock className="w-5 h-5 text-gray-400" /> : <Globe className="w-5 h-5 text-gray-400" />} {/* Iconos más grandes */}
            </div>
            
            <div className="flex items-center space-x-3 text-base text-gray-500 mb-4"> {/* Aumentado espacio y texto más grande */}
              <Clock className="w-5 h-5" /> {/* Icono más grande */}
              <span>{formatTimeAgo(incident.timestamp)}</span>
              <span>•</span>
              <MapPin className="w-5 h-5" /> {/* Icono más grande */}
              <span>{incident.lat?.toFixed(4)}, {incident.lng?.toFixed(4)}</span>
            </div>
          </div>
          
          {/* Botón de opciones */}
          <button className="p-3 rounded-full hover:bg-gray-100 transition-colors"> {/* Más padding */}
            <MoreHorizontal className="w-6 h-6 text-gray-400" /> {/* Icono más grande */}
          </button>
        </div>
        
        {/* Contenido del post */}
        <div className="mt-6"> {/* Aumentado margen */}
          <p className="text-gray-900 text-lg leading-relaxed"> {/* Texto más grande */}
            {incident.description || 'Sin descripción disponible'}
          </p>
        </div>
      </div>

      {/* Separador */}
      <div className="border-t border-gray-100"></div>

      {/* Acciones del post */}
      <div className="px-8 py-4"> {/* Aumentado padding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8"> {/* Aumentado espacio de space-x-6 a space-x-8 */}
            <button className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors"> {/* Más espacio */}
              <ThumbsUp className="w-6 h-6" /> {/* Icono más grande */}
              <span className="text-base font-medium">Me gusta</span> {/* Texto más grande */}
            </button>
            
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-3 text-gray-600 hover:text-green-600 transition-colors"
            >
              <MessageCircle className="w-6 h-6" /> {/* Icono más grande */}
              <span className="text-base font-medium"> {/* Texto más grande */}
                Comentar {comments.length > 0 && `(${comments.length})`}
              </span>
            </button>
            
            <button className="flex items-center space-x-3 text-gray-600 hover:text-purple-600 transition-colors"> {/* Más espacio */}
              <Share2 className="w-6 h-6" /> {/* Icono más grande */}
              <span className="text-base font-medium">Compartir</span> {/* Texto más grande */}
            </button>
          </div>
          
          <div className="text-sm text-gray-500 font-medium"> {/* Agregado font-medium */}
            #{incident.id}
          </div>
        </div>
      </div>

      {/* Sección de comentarios */}
      {showComments && (
        <>
          <div className="border-t border-gray-100"></div>
          <div className="p-8 pt-6"> {/* Aumentado padding */}
            {/* Formulario para nuevo comentario */}
            <form onSubmit={handleSubmitComment} className="mb-6"> {/* Aumentado margen */}
              <div className="flex space-x-4"> {/* Aumentado espacio */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center"> {/* Aumentado tamaño */}
                  <User className="w-5 h-5 text-white" /> {/* Icono más grande */}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe un comentario..."
                    className="w-full p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    rows={3}
                  />
                  <div className="flex justify-end mt-3"> {/* Aumentado margen */}
                    <button
                      type="submit"
                      disabled={!newComment.trim() || isCommenting}
                      className="px-6 py-3 bg-blue-500 text-white rounded-full text-base font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      <Send className="w-5 h-5" /> {/* Icono más grande */}
                      <span>{isCommenting ? 'Enviando...' : 'Enviar'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Lista de comentarios */}
            <div className="space-y-5"> {/* Aumentado espacio entre comentarios */}
              {loadingComments ? (
                <div className="text-center py-6 text-gray-500"> {/* Aumentado padding */}
                  <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div> {/* Spinner más grande */}
                  <span className="text-base">Cargando comentarios...</span> {/* Texto más grande */}
                </div>
              ) : comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={comment.id || index} className="flex space-x-4"> {/* Aumentado espacio */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center"> {/* Aumentado tamaño */}
                      <User className="w-5 h-5 text-white" /> {/* Icono más grande */}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-2xl px-5 py-4"> {/* Más padding */}
                        <div className="flex items-center space-x-3 mb-2"> {/* Más espacio y margen */}
                          <span className="font-medium text-base text-gray-900"> {/* Texto más grande */}
                            Usuario #{comment.userId || 'Anónimo'}
                          </span>
                          <span className="text-sm text-gray-500"> {/* Mantener texto pequeño para timestamp */}
                            {formatTimeAgo(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-800 text-base leading-relaxed"> {/* Texto más grande */}
                          {comment.comment || comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500"> {/* Aumentado padding */}
                  <MessageCircle className="w-10 h-10 mx-auto mb-3 text-gray-300" /> {/* Icono más grande */}
                  <p className="text-base">No hay comentarios aún. ¡Sé el primero en comentar!</p> {/* Texto más grande */}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Componente principal del foro
const IncidentForum = ({ incidents, searchTerm, setSearchTerm, filterType, setFilterType, getFilteredIncidents }) => {
  const [incidentList, setIncidentList] = useState(incidents);
  const [sortBy, setSortBy] = useState('recent'); // recent, popular, comments

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        console.log('🔄 Cargando incidentes para el foro...');
        const incidents = await getIncidents();
        console.log('✅ Incidentes cargados:', incidents);
        setIncidentList(incidents);
      } catch (error) {
        console.error('❌ Error al cargar incidentes:', error);
        alert('Error al cargar los incidentes. Revisa la conexión.');
      }
    };
    fetchIncidents();
  }, []);

  useEffect(() => {
    setIncidentList(incidents);
  }, [incidents]);

  // Filtrar y ordenar incidentes
  const filteredAndSortedIncidents = incidentList
    .filter(incident => {
      const matchesSearch = incident.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           incident.type?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || incident.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });

  const handleCommentAdd = (incidentId) => {
    // Podrías actualizar el estado o hacer alguna acción cuando se añada un comentario
    console.log('Comentario añadido al incidente:', incidentId);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6">
      {/* Header del foro */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 flex items-center justify-center">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Foro de Incidentes</h1>
            <p className="text-gray-600 text-lg">Comparte y comenta sobre los reportes de la comunidad</p>
          </div>
        </div>

        {/* Controles de búsqueda y filtros */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar incidentes, descripción, tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 text-lg"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-4">
            <div className="flex items-center space-x-3">
              <Filter className="w-6 h-6 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-lg min-w-[200px]"
              >
                <option value="all">Todos los tipos</option>
                <option value="robo">🔴 Robo</option>
                <option value="emergencia-medica">🔵 Emergencia Médica</option>
                <option value="violencia-familiar">🟣 Violencia Familiar</option>
                <option value="incendio">🟠 Incendio</option>
                <option value="otro">⚪ Otro</option>
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-lg min-w-[180px]"
            >
              <option value="recent">Más recientes</option>
              <option value="oldest">Más antiguos</option>
            </select>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
          <div className="text-base text-gray-600">
            Mostrando <span className="font-semibold">{filteredAndSortedIncidents.length}</span> de <span className="font-semibold">{incidentList.length}</span> incidentes
          </div>
          <div className="flex items-center space-x-6 text-base text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>En línea</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de posts */}
      <div className="space-y-8">
        {filteredAndSortedIncidents.length > 0 ? (
          filteredAndSortedIncidents.map((incident) => (
            <IncidentPost 
              key={incident.id} 
              incident={incident} 
              onCommentAdd={handleCommentAdd}
            />
          ))
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No se encontraron incidentes</h3>
            <p className="text-gray-600 mb-8 text-lg">
              {searchTerm || filterType !== 'all' 
                ? 'Intenta cambiar los filtros de búsqueda'
                : 'Aún no hay incidentes reportados en la comunidad'
              }
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="px-8 py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-lg font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentForum;
