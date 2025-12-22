import {
    FaCheckCircle,
    FaTimesCircle,
    FaInfoCircle,
    FaExclamationTriangle,
} from "react-icons/fa"

type ToastType = "success" | "error" | "info" | "warning"

interface ToastContentProps {
    type: ToastType
    title: string
    message: string
}

const config = {
    success: {
        color: "#628141", //club-primary
        icon: <FaCheckCircle />,
    },
    error: {
        color: "#EF4444", // red-500
        icon: <FaTimesCircle />,
    },
    info: {
        color: "#FACC15", // yellow-500
        icon: <FaInfoCircle />,
    },
    warning: {
        color: "#F59E0B", // amber-500
        icon: <FaExclamationTriangle />,
    },
}

function ToastContent({ type, title, message }: ToastContentProps) {
    const { color, icon } = config[type]

    return (
        <div className="w-80 rounded-lg overflow-hidden shadow-md bg-white">
            {/* Header */}
            <div
                className="flex items-center gap-2 px-4 py-2 font-semibold"
                style={{ backgroundColor: color, color: "#1F2937" }}
            >
                <span className="text-lg">{icon}</span>
                <span>{title}</span>
            </div>

            {/* Body */}
            <div className="px-4 py-3 text-sm text-club-dark bg-club-light">
                {message}
            </div>
        </div>
    )
}

export default ToastContent