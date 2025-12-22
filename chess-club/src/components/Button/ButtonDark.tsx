type ButtonSize = "sm" | "md" | "lg"

type ButtonDarkProps = {
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

function ButtonDark({
    label,
    onClick,
    disabled = false,
    size = "md",
}: ButtonDarkProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`
        bg-club-dark
        border-club-dark
        text-club-light
        border-2
        rounded-2xl
        font-medium
        transition
        hover:bg-club-light
        hover:text-club-dark
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${sizeClasses[size]}
      `}
        >
            {label}
        </button>
    )
}

export default ButtonDark