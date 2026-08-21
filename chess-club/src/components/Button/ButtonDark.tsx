type ButtonSize = "sm" | "md" | "lg"
/** "gold" is the header CTA treatment; "dark" is the site-wide default. */
type ButtonTone = "dark" | "gold"

type ButtonDarkProps = {
    label: string
    onClick?: () => void
    disabled?: boolean
    size?: ButtonSize
    tone?: ButtonTone
}

const sizeClasses: Record<ButtonSize, string> = {
    sm: "min-w-[96px] min-h-[36px] px-3 text-sm",
    md: "min-w-[140px] min-h-[44px] px-4 text-base",
    lg: "min-w-[180px] min-h-[52px] px-6 text-lg",
}

const toneClasses: Record<ButtonTone, string> = {
    dark: "bg-club-dark border-club-dark text-club-light hover:bg-club-light hover:text-club-dark",
    gold: "bg-brand-gold border-brand-gold text-brand-ink hover:bg-brand-gold-hover",
}

function ButtonDark({
    label,
    onClick,
    disabled = false,
    size = "md",
    tone = "dark",
}: ButtonDarkProps) {
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
        </button>
    )
}

export default ButtonDark