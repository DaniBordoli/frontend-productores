export const PillInput = ({ icon, error, ...props }) => {
  return (
    <div
      className={`flex items-center gap-3 bg-white rounded-full pl-[6px] pr-4 py-[6px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border ${
        error ? 'border-[#F35F50]' : 'border-transparent focus-within:border-[#DEDEDE]'
      }`}
    >
      <div
        className={`flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0 ${
          error ? 'bg-[#FDEFEE]' : 'bg-[#F6F6F6]'
        }`}
      >
        <span style={{ color: error ? '#F35F50' : '#888888' }}>{icon}</span>
      </div>
      <input
        className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
        {...props}
      />
    </div>
  );
};

export default PillInput;
