interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
    icon?: boolean
    password_check?: boolean
}

function Input({
    type = "email",
    placeholder = "Email",
    icon = false,
    password_check = false,
    ...props
}: InputProps) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className={`
            w-full
            ${icon ? "pl-8" : "pl-3"}
            pr-3
            py-2
            border
            rounded-lg
            focus:outline-none
            focus:ring-2
            ${password_check ? "focus:ring-red-500" : "focus:ring-club-primary"}
            `}
            {...props}
        />
    );
}

export default Input;