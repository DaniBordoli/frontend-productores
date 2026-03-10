import { useMemo } from 'react';

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = useMemo(() => {
    const items = [];
    const delta = 1;

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    items.push(1);
    if (rangeStart > 2) items.push('...');
    for (let i = rangeStart; i <= rangeEnd; i++) items.push(i);
    if (rangeEnd < totalPages - 1) items.push('...');
    if (totalPages > 1) items.push(totalPages);

    return items;
  }, [currentPage, totalPages]);

  const basePageStyle = {
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    cursor: 'pointer',
    userSelect: 'none',
  };

  return (
    <div className="flex justify-end mt-4">
      <div
        className="flex items-center gap-2 px-2 py-2"
        style={{
          borderRadius: 100,
          border: '1px solid #DEDEDE',
          background: '#FFFFFF',
          minWidth: 380,
          boxSizing: 'border-box',
          height: 56,
        }}
      >
        <button
          className="px-5 py-2 text-base font-medium"
          style={{
            borderRadius: 80,
            border: '1px solid #DEDEDE',
            background: currentPage === 1 ? '#F6F6F6' : '#FFFFFF',
            color: currentPage === 1 ? '#ABABAB' : '#363636',
            minWidth: 90,
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          }}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Anterior
        </button>

        {pages.map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="mx-1 text-base font-medium text-gray-400">
              ...
            </span>
          ) : (
            <span
              key={page}
              className="mx-1 text-base font-medium text-gray-900"
              style={{
                ...basePageStyle,
                border: page === currentPage ? '1px solid #DEDEDE' : '1px solid transparent',
                background: page === currentPage ? '#fff' : 'transparent',
                fontWeight: 500,
              }}
              onClick={() => onPageChange(page)}
            >
              {page}
            </span>
          )
        )}

        <button
          className="px-5 py-2 text-base font-medium"
          style={{
            borderRadius: 80,
            background: currentPage === totalPages ? '#F0F0F0' : '#DEEDE0',
            color: currentPage === totalPages ? '#ABABAB' : '#45845C',
            minWidth: 110,
            border: currentPage === totalPages ? '1px solid #DEDEDE' : '1px solid #DEEDE0',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          }}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Pagination;
