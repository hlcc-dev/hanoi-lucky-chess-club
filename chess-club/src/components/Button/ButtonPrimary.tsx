type ButtonSize = "sm" | "md" | "lg"

type ButtonPrimaryProps = {
  label: string
  onClick?: () => void
  disabled?: boolean
  size?: ButtonSize
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-w-[96px] min-h-[36px] px-3 text-sm",
  md: "min-w-[140px] min-h-[44px] px-4 text-base",
  lg: "min-w-[180px] min-h-[52px] px-6 text-lg",
}

function ButtonPrimary({
  label,
  onClick,
  disabled = false,
  size = "md",
}: ButtonPrimaryProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-club-primary
        text-club-dark
        border-2
        rounded-2xl
        font-medium
        transition
        hover:bg-club-secondary
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${sizeClasses[size]}
      `}
    >
      {label}
    </button>
  )
}

export default ButtonPrimary