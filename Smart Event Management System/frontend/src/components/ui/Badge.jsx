const variantClasses = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-800',
  purple: 'bg-purple-100 text-purple-800',
  primary: 'bg-[#E8441A]/10 text-[#E8441A]',
  dark: 'bg-[#1A1A2E] text-white',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
};

const dotColors = {
  default: 'bg-gray-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  purple: 'bg-purple-500',
  primary: 'bg-[#E8441A]',
  dark: 'bg-white',
};

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-semibold
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
