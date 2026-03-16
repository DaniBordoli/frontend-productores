import { Search } from 'lucide-react';

export const SearchInput = ({
  value,
  onChange,
  placeholder = 'Buscar',
}) => (
  <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-11 pr-4 py-3 w-full border border-[#DEDEDE] rounded-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200"
        style={{ borderRadius: 80 }}
      />
  </div>
);

export default SearchInput;
