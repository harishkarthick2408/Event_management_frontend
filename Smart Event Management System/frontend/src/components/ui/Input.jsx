import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  disabled = false,
  required = false,
  name,
  id,
  hint,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-[#1A1A2E]">
          {label}
          {required && <span className="text-[#E8441A] ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {LeftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <LeftIcon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-3 rounded-xl border transition-all duration-200
            text-[#1A1A2E] placeholder-gray-400 bg-white
            focus:outline-none focus:ring-2 focus:ring-[#E8441A] focus:border-transparent
            disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60
            ${error ? 'border-red-500 focus:ring-red-400' : 'border-gray-200'}
            ${LeftIcon ? 'pl-10' : ''}
            ${isPassword || RightIcon ? 'pr-10' : ''}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        {!isPassword && RightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <RightIcon className="w-4 h-4" />
          </div>
        )}
      </div>
      {hint && !error && (
        <p className="text-xs text-gray-500 mt-0.5">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
