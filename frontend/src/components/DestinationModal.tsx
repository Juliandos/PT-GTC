import React, { useState, useEffect } from 'react';
import { Destination, DestinationFormData, DestinationType } from '../types';

interface DestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DestinationFormData) => Promise<void>;
  destination?: Destination | null;
  mode: 'create' | 'edit';
}

const DestinationModal: React.FC<DestinationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  destination,
  mode,
}) => {
  const [formData, setFormData] = useState<DestinationFormData>({
    name: '',
    description: '',
    countryCode: '',
    type: 'Beach',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && destination) {
        setFormData({
          name: destination.name,
          description: destination.description,
          countryCode: destination.countryCode,
          type: destination.type,
        });
      } else {
        setFormData({
          name: '',
          description: '',
          countryCode: '',
          type: 'Beach',
        });
      }
      setError('');
    }
  }, [isOpen, destination, mode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'countryCode' ? value.toUpperCase() : value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al guardar el destino');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-primary">
              {mode === 'create' ? 'Crear Destino' : 'Modificar Destino'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-smooth"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-slide-down">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
                Nombre *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={100}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-smooth"
                placeholder="Ej: Playa del Carmen"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-primary mb-2">
                Descripción *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                minLength={10}
                maxLength={500}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-smooth resize-none"
                placeholder="Describe el destino turístico..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="countryCode" className="block text-sm font-medium text-primary mb-2">
                  Código de País *
                </label>
                <input
                  type="text"
                  id="countryCode"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={2}
                  pattern="[A-Z]{2}"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-smooth uppercase"
                  placeholder="MX"
                />
                <p className="text-xs text-gray-500 mt-1">2 letras mayúsculas (ISO 3166-1)</p>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-primary mb-2">
                  Tipo *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-smooth"
                >
                  <option value="Beach">Beach</option>
                  <option value="Mountain">Mountain</option>
                  <option value="City">City</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Adventure">Adventure</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-smooth"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-smooth transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Actualizar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DestinationModal;

