import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export const Breadcrumb = ({ parentLabel, parentPath, currentLabel }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => navigate(parentPath)}
        className="flex items-center justify-center bg-white rounded-full border border-[#DEDEDE] hover:bg-gray-50 transition-colors"
        style={{ width: 36, height: 36 }}
      >
        <ArrowLeft className="w-4 h-4" style={{ color: '#7A7A7A' }} />
      </button>
      <span
        className="text-sm cursor-pointer hover:opacity-80 transition-opacity"
        style={{ color: '#7A7A7A' }}
        onClick={() => navigate(parentPath)}
      >
        {parentLabel}
      </span>
      <ChevronRight className="w-4 h-4" style={{ color: '#7A7A7A' }} />
      <span
        className="text-sm font-medium"
        style={{
          background: 'linear-gradient(135deg, #37784C 0%, #5F9C73 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {currentLabel}
      </span>
    </div>
  );
};

export default Breadcrumb;
