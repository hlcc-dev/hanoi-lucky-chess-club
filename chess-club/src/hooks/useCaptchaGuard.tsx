import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const VERIFY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-captcha`;


export function useCaptchaGuard() {
    const captchaRef = useRef<ReCAPTCHA | null>(null);

    const Captcha = (
        <ReCAPTCHA
            ref={captchaRef}
            sitekey={SITE_KEY}
            size="invisible"
        />
    );

    const runWithCaptcha = async (action: () => Promise<void> | void) => {
        if (!captchaRef.current) return;

        const token = await captchaRef.current.executeAsync();
        captchaRef.current.reset();

        if (!token) {
            console.error("Captcha did not return a token");
            throw new Error("Captcha failed to execute");
        }

        const res = await fetch(VERIFY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        });

        const data = await res.json();
        console.log("Captcha verification response:", data);

        if (!data?.success && !data?.success === true) {
            console.error("Captcha verification failed:", data);
            throw new Error("Captcha verification failed ❌");
        }

        await action(); // only run if captcha is valid
    };

    return { Captcha, runWithCaptcha };
}