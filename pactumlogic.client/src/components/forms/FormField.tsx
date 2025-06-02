interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  className?: string;
  min?: number;
  max?: number;
  error?: string; // Add error prop
}

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  options,
  className = "",
  error, // Add error prop
}: FormFieldProps) => {
  return (
    <div className={className}>
      <label className='block text-sm font-medium text-gray-700 mb-1'>
        {label} {required && "*"}
      </label>
      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
            error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
          }`}
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={type === "number" ? 1 : undefined}
          max={type === "number" ? 120 : undefined}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
            error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
          }`}
          required={required}
        />
      )}
      {error && (
        <p className='mt-1 text-sm text-red-600'>{error}</p>
      )}
    </div>
  );
};

export default FormField;