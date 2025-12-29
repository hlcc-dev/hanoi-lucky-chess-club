import { useState, useRef, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import {
    FaChessKing,
    FaChessQueen,
    FaChessRook,
    FaChessKnight,
    FaChevronDown,
} from "react-icons/fa";
import ButtonSecondary from "./ButtonSecondary";
import ButtonDark from "./ButtonDark";
import {
    supabasePersistent,
    supabaseSessionOnly,
} from "../../utils/supabaseClient";
import { toastSuccess } from "../../utils/toastUtils";

interface AuthButtonsProps {
    mobile?: boolean;
    onAction?: () => void;
}

function AuthButtons({ mobile = false, onAction }: AuthButtonsProps) {
    const { user, profile, loading } = useUser();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    // Keep a stable profile reference to avoid UI flashing when loading toggles
    const stableProfileRef = useRef(profile);

    useEffect(() => {
        if (profile) {
            // User logged in or profile updated
            stableProfileRef.current = profile;
        } else if (!loading) {
            // User logged out and loading finished → clear cached profile
            stableProfileRef.current = null;
        }
    }, [profile, loading]);

    const stableProfile = stableProfileRef.current;

    /* ================= NOT LOGGED IN ================= */
    if (!stableProfile && !user) {
        return (
            <div className={mobile ? "flex flex-col gap-3" : "flex gap-3"}>
                <ButtonDark
                    label="Join Now"
                    size={mobile ? "md" : "sm"}
                    onClick={() => {
                        navigate("/signup");
                        onAction?.();
                    }}
                />
                <ButtonSecondary
                    label="Login"
                    size={mobile ? "md" : "sm"}
                    onClick={() => {
                        navigate("/login");
                        onAction?.();
                    }}
                />
            </div>
        );
    }

    /* ================= MOBILE (LOGGED IN) ================= */
    if (mobile) {
        return (
            <div className="flex flex-col gap-3">
                <button
                    onClick={() => {
                        navigate("/dashboard");
                        onAction?.();
                    }}
                    className="
                    flex items-center gap-3
                    px-4 py-3
                    rounded-lg
                    bg-white
                    border border-club-secondary
                    hover:bg-club-light
                "
                >
                    <FaChessQueen className="text-lg" />
                    <span>Dashboard</span>
                </button>

                <button
                    onClick={async () => {
                        await Promise.all([
                            supabasePersistent.auth.signOut(),
                            supabaseSessionOnly.auth.signOut(),
                        ]);
                        toastSuccess("Logged out successfully");
                        navigate("/", { replace: true });
                        onAction?.();
                    }}
                    className="
                    flex items-center gap-3
                    px-4 py-3
                    rounded-lg
                    bg-white
                    border border-red-500/40
                    text-red-600
                    hover:bg-red-50
                "
                >
                    <FaChessKnight className="text-lg" />
                    <span>Logout</span>
                </button>
            </div>
        );
    }

    /* ================= DESKTOP DROPDOWN ================= */
    return (
        <div className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg bg-club-dark px-4 py-2 text-white hover:bg-club-dark/90"
            >
                <FaChessKing />
                <span className="font-medium">{stableProfile?.username}</span>
                <FaChevronDown
                    className={`transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"
                        }`}
                />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-club-dark/20 bg-white shadow-lg overflow-hidden z-50">
                    <button
                        onClick={() => {
                            setOpen(false);
                            navigate("/dashboard");
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 hover:bg-club-light"
                    >
                        <FaChessQueen />
                        <span>Dashboard</span>
                    </button>

                    <button
                        onClick={() => {
                            setOpen(false);
                            navigate("/settings");
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 hover:bg-club-light"
                    >
                        <FaChessRook />
                        <span>Settings</span>
                    </button>

                    <button
                        onClick={async () => {
                            setOpen(false);
                            await Promise.all([
                                supabasePersistent.auth.signOut(),
                                supabaseSessionOnly.auth.signOut(),
                            ]);
                            toastSuccess("Logged out successfully");
                            navigate("/", { replace: true });
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
                    >
                        <FaChessKnight />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default AuthButtons;