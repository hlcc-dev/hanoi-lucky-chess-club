import { useEffect } from "react";
import { handleAuthCallback } from "./handleAuthCallback";

export default function AuthCallbackPage() {
    useEffect(() => {
        handleAuthCallback();
    }, []);

    return <p>Verifying your email…</p>;
}