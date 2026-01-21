import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, Clock, CheckCircle, Truck } from 'lucide-react';
import tripService from '../services/trip.service';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    enCurso: 0,
    pendientes: 0,
    finalizados: 0,
  });
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const trips = await tripService.getMyTrips();
      
      setStats({
        total: trips.length,
        enCurso: trips.filter(t => t.estado === 'en_curso').length,
        pendientes: trips.filter(t => ['solicitado', 'cotizando', 'confirmado'].includes(t.estado)).length,
        finalizados: trips.filter(t => t.estado === 'finalizado').length,
      });

      setRecentTrips(trips.slice(0, 5));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bienvenido</h1>
          <p className="text-gray-600 mt-1">Gestiona tus viajes y solicitudes</p>
        </div>
        <Link
          to="/solicitar-viaje"
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" />
          Solicitar Viaje
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Viajes</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Curso</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.enCurso}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendientes}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Finalizados</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.finalizados}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Viajes Recientes</h2>
        </div>
        <div className="p-6">
          {recentTrips.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No tienes viajes aún</p>
              <Link
                to="/solicitar-viaje"
                className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                Solicitar tu primer viaje →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTrips.map((trip) => (
                <Link
                  key={trip._id}
                  to={`/viajes/${trip._id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{trip.numeroViaje}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {trip.origen?.ciudad} → {trip.destino?.ciudad}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        trip.estado === 'en_curso' ? 'bg-indigo-100 text-indigo-800' :
                        trip.estado === 'finalizado' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {trip.estado}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(trip.fechaProgramada).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
