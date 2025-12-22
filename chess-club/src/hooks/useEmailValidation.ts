import { useState } from "react";
import { supabaseSessionOnly } from "../utils/supabaseClient";
import { toastError } from "../utils/toastUtils";

type StatusState = "idle" | "loading" | "success" | "error";

export function useEmailValidation() {
    const [status, setStatus] = useState<StatusState>("idle");

    const validateEmail = async (email: string): Promise<boolean> => {
        if (!email) {
            setStatus("error");
            return false;
        }

        setStatus("loading");

        try {
            const { data, error } =
                await supabaseSessionOnly.functions.invoke("email_check", {
                    body: { email },
                });

            if (error) {
                toastError("Error validating email. Please try again later.");
                setStatus("error");
                return false;
            }

            if (data?.valid === true) {
                setStatus("success");
                return true;
            } else {
                toastError("Invalid email address. Please check and try again.");
                setStatus("error");
                return false;
            }
        } catch {
            toastError("An unexpected error occurred during email validation.");
            setStatus("error");
            return false;
        }
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