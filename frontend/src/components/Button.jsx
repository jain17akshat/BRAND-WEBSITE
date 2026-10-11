import React, { forwardRef } from 'react';
import { Loader2, Check } from 'lucide-react';

/**
 * Button — Unified boutique button component for SHRAVIKO.
 *
 * Variants:
 *  - 'primary': Deep plum (#57324F) background, white text, 12px rounded, hover #42253C
 *  - 'secondary': Transparent/ivory background, deep plum text & border, blush hover
 *  - 'text': Dark brown/plum link with clear hover underline & keyboard focus
 */
export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isSuccess = false,
  successText = 'Added to Cart',
  disabled = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  type = 'button',
  onClick,
  ...props
}, ref) => {
  // Sizing definitions
  const sizeClasses = {
    sm: 'min-h-[38px] px-4 py-1.5 text-xs rounded-xl',
    md: 'min-h-[48px] px-6 py-2.5 text-sm sm:text-[15px] rounded-xl',
    lg: 'min-h-[52px] px-8 py-3 text-base rounded-xl',
  }[size] || 'min-h-[48px] px-6 py-2.5 text-sm rounded-xl';

  // Variant definitions
  let variantClasses = '';
  if (variant === 'primary') {
    variantClasses = `
      bg-[#57324F] hover:bg-[#42253C] active:bg-[#351C30] text-white
      border border-[#57324F] shadow-sm hover:shadow-md
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#57324F] focus-visible:ring-offset-2
      disabled:bg-[#8C7D75]/40 disabled:border-transparent disabled:text-white/80 disabled:cursor-not-allowed
    `;
  } else if (variant === 'secondary') {
    variantClasses = `
      bg-transparent hover:bg-[#FBEAE5] active:bg-[#F5EBF3] text-[#57324F]
      border border-[#57324F]
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#57324F] focus-visible:ring-offset-2
      disabled:border-[#EAE2D7] disabled:text-[#8C7D75] disabled:cursor-not-allowed
    `;
  } else if (variant === 'text') {
    variantClasses = `
      bg-transparent text-[#57324F] hover:text-[#42253C] underline-offset-4 hover:underline
      p-0 min-h-0 border-none shadow-none font-semibold
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#57324F] focus-visible:rounded-md
      disabled:text-[#8C7D75] disabled:no-underline disabled:cursor-not-allowed
    `;
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`
        relative inline-flex items-center justify-center font-manrope font-semibold
        transition-all duration-200 ease-out select-none cursor-pointer
        ${variant !== 'text' ? sizeClasses : ''}
        ${variantClasses}
        ${className}
      `}
      {...props}
    >
      {/* Loading state spinner (preserves button dimensions) */}
      {isLoading && (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>Processing...</span>
        </span>
      )}

      {/* Success feedback state */}
      {!isLoading && isSuccess && (
        <span className="inline-flex items-center gap-2 text-white">
          <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
          <span>{successText}</span>
        </span>
      )}

      {/* Normal idle state */}
      {!isLoading && !isSuccess && (
        <span className="inline-flex items-center gap-2">
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';
