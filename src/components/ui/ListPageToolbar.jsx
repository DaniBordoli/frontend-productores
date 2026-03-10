import { SearchInput } from './SearchInput';
import { FiltersDropdown } from '../FiltersDropdown';
import { Button } from './Button';

export const ListPageToolbar = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Buscar',
  filters,
  onFilterChange,
  filterSections,
  addLabel,
  onAdd,
  addButtonWidth = 220,
  children,
}) => (
  <div className="flex flex-wrap items-center gap-3 mb-4 w-full">
    <div className="flex-1 md:flex-none md:w-[319px]">
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
      />
    </div>

    {filterSections && (
      <FiltersDropdown
        values={filters}
        onChange={onFilterChange}
        sections={filterSections}
      />
    )}

    <div className="hidden md:flex flex-1" />

    {children}

    {addLabel && (
      <div className="hidden md:block">
        <Button
          variant="primary"
          size="lg"
          onClick={onAdd}
          style={{ width: addButtonWidth, height: 48, minWidth: 180 }}
        >
          {addLabel}
        </Button>
      </div>
    )}
  </div>
);

export default ListPageToolbar;
