const paddingVariants = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const shadowVariants = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
};

const Card = ({
  children,
  title,
  subtitle,
  footer,
  padding = 'md',
  shadow = 'md',
  hover = false,
  border = false,
  className = '',
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl
        ${paddingVariants[padding]}
        ${shadowVariants[shadow]}
        ${border ? 'border border-gray-100' : ''}
        ${hover ? 'transition-all duration-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-bold text-[#1A1A2E]">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      <div>{children}</div>
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-100">{footer}</div>
      )}
    </div>
  );
};

export default Card;
