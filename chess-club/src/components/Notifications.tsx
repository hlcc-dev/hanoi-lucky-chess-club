import ButtonPrimary from "./Button/ButtonPrimary";
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function Notifications({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="
        fixed inset-0 
        bg-black/60 
        flex items-center justify-center
        z-9999
      "
            onClick={onClose}
        >
            <div
                className="
          bg-club-light text-black 
          rounded-xl shadow-xl border border-black
          p-8 max-w-md w-[90%]
          text-center
          animate-[fadeIn_0.2s_ease]
        "
                onClick={(e) => e.stopPropagation()}
            >
                {children}
                <ButtonPrimary label="Close" onClick={onClose} size="lg" />
            </div>
        </div>
    );
}