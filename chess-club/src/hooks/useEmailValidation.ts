import { useState } from "react";
import { toastError } from "../utils/toastUtils";

type StatusState = "idle" | "loading" | "success" | "error";

export function useEmailValidation() {
    const [status, setStatus] = useState<StatusState>("idle");

    const validateEmail = async (email: string): Promise<boolean> => {
        if (!email) {
            setStatus("error");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            setStatus("error");
            toastError("Invalid email format. Please check again.");
            return false;
        }

        setStatus("loading");
        await new Promise((resolve) => setTimeout(resolve, 500));

        setStatus("success");
        return true;
    };

    const reset = () => {
        setStatus("idle");
    };

    return {
        status,
        validateEmail,
        reset,
    };
}