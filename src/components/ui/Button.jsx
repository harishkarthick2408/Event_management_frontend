import { Loader2 } from 'lucide-react';

const sizeClasses = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-xl',
};

const variantClasses = {
  primary: 'bg-[#E8441A] text-white hover:bg-[#C73A15] focus:ring-[#E8441A]/50',
  secondary: 'bg-[#1A1A2E] text-white hover:bg-[#2a2a4e] focus:ring-[#1A1A2E]/50',
  outline: 'border-2 border-[#E8441A] text-[#E8441A] bg-transparent hover:bg-[#E8441A] hover:text-white focus:ring-[#E8441A]/50',
  ghost: 'text-gray-600 bg-transparent hover:bg-gray-100 hover:text-[#1A1A2E] focus:ring-gray-300',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/50',
  success: 'bg-[#10B981] text-white hover:bg-emerald-600 focus:ring-emerald-500/50',
  white: 'bg-white text-[#E8441A] hover:bg-gray-50 focus:ring-white/50',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        LeftIcon && <LeftIcon className="w-4 h-4" />
      )}
      {children}
      {!loading && RightIcon && <RightIcon className="w-4 h-4" />}
    </button>
  );
};

export default Button;
