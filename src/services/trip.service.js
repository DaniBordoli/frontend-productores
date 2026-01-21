import api from './api';

const tripService = {
  // Obtener todos los viajes del productor actual
  getMyTrips: async (params = {}) => {
    const response = await api.get('/trips', { params });
    return response.data.trips || [];
  },

  // Obtener un viaje específico
  getById: async (id) => {
    const response = await api.get(`/trips/${id}`);
    return response.data.trip || response.data;
  },

  // Crear solicitud de viaje
  create: async (data) => {
    const response = await api.post('/trips', data);
    return response.data;
  },

  // Actualizar viaje
  update: async (id, data) => {
    const response = await api.put(`/trips/${id}`, data);
    return response.data;
  },

  // Proponer precio
  proposePrice: async (id, price) => {
    const response = await api.patch(`/trips/${id}/propose-price`, { price });
    return response.data;
  },
};

export default tripService;
