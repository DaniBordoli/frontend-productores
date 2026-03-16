export const FormField = ({ label, error, children }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-xs text-[#F35F50] px-2">{error}</p>}
    </div>
  );
};

export default FormField;
