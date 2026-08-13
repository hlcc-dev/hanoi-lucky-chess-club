import {
    supabasePersistent,
    supabaseSessionOnly,
} from "./supabaseClient";
import { toastError } from "./toastUtils";
import i18n from "../i18n/config";

interface Login {
    email: string;
    password: string;
    rememberMe?: boolean;
}

async function signIn({
    email,
    password,
    rememberMe = false,
}: Login): Promise<boolean> {
    const client = rememberMe
        ? supabasePersistent
        : supabaseSessionOnly;

    const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
    });

    // Handle login failure first
    if (error || !data.session) {
        console.log("Login error:", error);

        // If account exists but email is not confirmed, Supabase often reports as invalid login
        if (error?.message?.toLowerCase().includes("confirm")) {
            toastError(i18n.t("errors.confirmEmail"));

            await supabasePersistent.auth.resend({
                type: "signup",
                email,
            });

            return false;
        }

        toastError(i18n.t("errors.wrongCredentials"));
        return false;
    }

    // Check email verification state
    if (!data.user?.email_confirmed_at) {
        toastError(i18n.t("errors.confirmEmail"));

        await supabasePersistent.auth.resend({
            type: "signup",
            email,
        });

        return false;
    }

    return true;
}

export default signIn;