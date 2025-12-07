import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { destinationService } from '../services/destinationService';
import { Destination, DestinationFilters, DestinationType, DestinationFormData } from '../types';
import DestinationModal from '../components/DestinationModal';

const Destinations: React.FC = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<DestinationFilters>({
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    type: '' as DestinationType | '',
    countryCode: '',
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const loadDestinations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await destinationService.getAll(filters);
      setDestinations(data.destinations);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading destinations:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadDestinations();
  }, [loadDestinations]);

  const handleSearch = () => {
    setFilters({
      ...filters,
      type: searchFilters.type || undefined,
      countryCode: searchFilters.countryCode || undefined,
      page: 1,
    });
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleCreate = () => {
    setSelectedDestination(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleModify = () => {
    if (!selectedDestination) {
      alert('Por favor selecciona un destino');
      return;
    }
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleSave = async (data: DestinationFormData) => {
    if (modalMode === 'create') {
      await destinationService.create(data);
    } else if (selectedDestination) {
      await destinationService.update(selectedDestination.id, data);
    }
    await loadDestinations();
    setSelectedDestination(null);
  };

  const handleRemove = async () => {
    if (!selectedDestination) {
      alert('Por favor selecciona un destino');
      return;
    }
    if (window.confirm(`¿Estás seguro de eliminar "${selectedDestination.name}"?`)) {
      try {
        await destinationService.delete(selectedDestination.id);
        await loadDestinations();
        setSelectedDestination(null);
      } catch (error) {
        console.error('Error deleting destination:', error);
        alert('Error al eliminar el destino');
      }
    }
  };

  const user = authService.getStoredUser();

  return (
    <div className="min-h-screen bg-white-off flex">
      {/* Sidebar */}
      <div className="w-64 bg-primary text-white p-6 flex flex-col animate-slide-down">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">HotelBediaX</h2>
          <p className="text-secondary-light text-sm">Bienvenido, {user?.name}</p>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4 text-secondary">Data selector</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Tipo</label>
              <select
                value={searchFilters.type}
                onChange={(e) => setSearchFilters({ ...searchFilters, type: e.target.value as DestinationType | '' })}
                className="w-full px-3 py-2 bg-primary-light text-white rounded-lg border border-secondary-dark focus:ring-2 focus:ring-secondary transition-smooth"
              >
                <option value="">Todos</option>
                <option value="Beach">Beach</option>
                <option value="Mountain">Mountain</option>
                <option value="City">City</option>
                <option value="Cultural">Cultural</option>
                <option value="Adventure">Adventure</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2">Código de País</label>
              <input
                type="text"
                value={searchFilters.countryCode}
                onChange={(e) => setSearchFilters({ ...searchFilters, countryCode: e.target.value.toUpperCase() })}
                maxLength={2}
                className="w-full px-3 py-2 bg-primary-light text-white rounded-lg border border-secondary-dark focus:ring-2 focus:ring-secondary transition-smooth"
                placeholder="Ej: MX"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="w-full bg-secondary hover:bg-secondary-dark text-primary font-semibold py-3 rounded-lg transition-smooth transform hover:scale-105 mb-4"
        >
          Search
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-smooth"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-primary mb-6">Destinations</h1>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleCreate}
              className="bg-secondary hover:bg-secondary-dark text-primary font-semibold px-6 py-3 rounded-lg transition-smooth transform hover:scale-105"
            >
              Create destiny
            </button>
            <button
              onClick={handleModify}
              className="bg-primary-light hover:bg-primary text-white font-semibold px-6 py-3 rounded-lg transition-smooth transform hover:scale-105"
            >
              Modify destiny
            </button>
            <button
              onClick={handleRemove}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-smooth transform hover:scale-105"
            >
              Remove destiny
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-custom overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-primary">Cargando...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">ID (int)</th>
                    <th className="px-6 py-4 text-left font-semibold">Name (string)</th>
                    <th className="px-6 py-4 text-left font-semibold">Description (string)</th>
                    <th className="px-6 py-4 text-left font-semibold">CountryCode (string)</th>
                    <th className="px-6 py-4 text-left font-semibold">Type (enum)</th>
                    <th className="px-6 py-4 text-left font-semibold">Last Modif (DateTime)</th>
                  </tr>
                </thead>
                <tbody>
                  {destinations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No hay destinos disponibles
                      </td>
                    </tr>
                  ) : (
                    destinations.map((destination) => (
                      <tr
                        key={destination.id}
                        onClick={() => setSelectedDestination(destination)}
                        className={`border-b border-gray-200 hover:bg-secondary-light cursor-pointer transition-smooth ${
                          selectedDestination?.id === destination.id ? 'bg-secondary-light' : ''
                        }`}
                      >
                        <td className="px-6 py-4 text-primary font-medium">{destination.id}</td>
                        <td className="px-6 py-4 text-primary">{destination.name}</td>
                        <td className="px-6 py-4 text-gray-600">{destination.description}</td>
                        <td className="px-6 py-4 text-primary font-medium">{destination.countryCode}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-secondary text-primary rounded-full text-sm font-semibold">
                            {destination.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(destination.lastModif).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center gap-4">
            <button
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-smooth"
            >
              Anterior
            </button>
            <span className="text-primary">
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <button
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-smooth"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Modal para Create/Edit */}
      <DestinationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDestination(null);
        }}
        onSave={handleSave}
        destination={selectedDestination}
        mode={modalMode}
      />
    </div>
  );
};

export default Destinations;

