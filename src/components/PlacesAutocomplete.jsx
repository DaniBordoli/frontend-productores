import { useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';

const PlacesAutocomplete = ({ label, value, onPlaceSelect, required = false, placeholder = 'Buscar dirección...' }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'ar' },
      fields: ['address_components', 'formatted_address', 'geometry'],
      types: ['geocode', 'establishment'],
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace();
      if (!place.geometry) return;

      let direccion = place.formatted_address || '';
      let ciudad = '';
      let provincia = '';

      const get = (types) => {
        const c = (place.address_components || []).find(comp =>
          types.some(t => comp.types.includes(t))
        );
        return c?.long_name || '';
      };

      ciudad =
        get(['locality']) ||
        get(['sublocality', 'sublocality_level_1']) ||
        get(['administrative_area_level_2']) ||
        get(['administrative_area_level_3']) ||
        get(['administrative_area_level_1']);
      provincia = get(['administrative_area_level_1']);

      onPlaceSelect({
        direccion,
        ciudad,
        provincia,
        coordenadas: {
          latitud: place.geometry.location.lat(),
          longitud: place.geometry.location.lng(),
        },
      });
    });

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && '*'}
        </label>
      )}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          defaultValue={value}
          required={required}
          placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
    </div>
  );
};

export default PlacesAutocomplete;
