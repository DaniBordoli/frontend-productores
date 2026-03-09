import Stroke from '../../assets/Stroke.svg';

/**
 * Reusable data table with consistent styling.
 *
 * Props:
 *  - columns: Array<{ key, label, align?, sortable? }>
 *  - data: Array of row objects
 *  - renderRow: (item, index) => <tr>...</tr>
 *  - emptyIcon?: ReactNode (icon shown in empty state)
 *  - emptyTitle: string
 *  - emptySubtitle: string
 *  - colSpan?: number (for empty state, defaults to columns.length)
 */
export const DataTable = ({
  columns,
  data,
  renderRow,
  emptyIcon,
  emptyTitle = 'No se encontraron resultados',
  emptySubtitle = '',
  colSpan,
}) => {
  const span = colSpan ?? columns.length;

  return (
    <div className="bg-white rounded-2xl border border-[#DEDEDE]">
      <div className="overflow-x-auto">
        <table className="w-full rounded-2xl overflow-hidden text-[#363636]">
          <thead style={{ background: '#F6F6F6' }}>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3 text-sm font-medium ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.sortable ? (
                    <span className="flex items-center gap-2">
                      {col.label}
                      <img src={Stroke} alt="sort" className="w-4 h-4 ml-1" />
                    </span>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={span} className="px-6 py-12 text-center text-[#363636]">
                  {emptyIcon && <div className="flex justify-center mb-3">{emptyIcon}</div>}
                  <p className="text-lg font-medium">{emptyTitle}</p>
                  {emptySubtitle && <p className="text-sm">{emptySubtitle}</p>}
                </td>
              </tr>
            ) : (
              data.map((item, idx) => renderRow(item, idx))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
