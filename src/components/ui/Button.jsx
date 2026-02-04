/**
 * Button - Midnight Ivory theme
 * Gold accent on hover, smooth transitions
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary/90 hover:shadow-soft",
    secondary:
      "bg-background border border-border text-primary hover:border-gold hover:text-gold",
    gold:
      "bg-gold/20 text-gold hover:bg-gold/30",
    ghost: "bg-transparent text-primary hover:bg-primary/5",
    danger: "bg-danger text-white hover:bg-danger/90",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""
        } ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
