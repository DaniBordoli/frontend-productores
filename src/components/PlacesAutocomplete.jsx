import { useRef, useEffect } from 'react';
import PinLocationIcon from '../assets/PinLocation.svg';

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
      <div className="flex items-center gap-3 bg-white rounded-full pl-[6px] pr-4 py-[6px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-transparent focus-within:border-[#DEDEDE]">
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#F6F6F6] flex-shrink-0">
          <img src={PinLocationIcon} alt="Location" className="w-4 h-4" />
        </div>
        <input
          ref={inputRef}
          type="text"
          defaultValue={value}
          required={required}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
        />
      </div>
    </div>
  );
};

export default PlacesAutocomplete;
