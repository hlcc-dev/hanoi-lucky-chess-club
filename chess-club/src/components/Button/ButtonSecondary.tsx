type ButtonSize = "sm" | "md" | "lg"
/** "cream" is the header CTA treatment; "light" is the site-wide default. */
type ButtonTone = "light" | "cream"

interface ButtonSecondaryProps {
  label: string
  onClick?: () => void
  disabled?: boolean
  size?: ButtonSize
  icon?: React.ReactNode
  tone?: ButtonTone
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-w-[96px] min-h-[36px] px-3 text-sm",
  md: "min-w-[140px] min-h-[44px] px-4 text-base",
  lg: "min-w-[180px] min-h-[52px] px-6 text-lg",
}

const toneClasses: Record<ButtonTone, string> = {
  light: "bg-club-light text-club-dark hover:bg-club-secondary",
  cream: "bg-header-fg text-brand-ink hover:bg-brand-cream-hover",
}

function ButtonSecondary({
  label,
  onClick,
  disabled = false,
  size = "md",
  icon,
  tone = "light",
}: ButtonSecondaryProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-2xl
        font-medium
        transition
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${toneClasses[tone]}
        ${sizeClasses[size]}
      `}
    >
      {label}
      {icon && <span className="ml-2 inline-flex">{icon}</span>}
    </button>
  )
}

export default ButtonSecondary