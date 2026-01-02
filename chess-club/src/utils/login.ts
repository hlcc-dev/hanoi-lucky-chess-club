import {
    supabasePersistent,
    supabaseSessionOnly,
} from "./supabaseClient";
import { toastError } from "./toastUtils";

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
            toastError("Please confirm your email address. A new verification email has been sent.");

            await supabasePersistent.auth.resend({
                type: "signup",
                email,
            });

            return false;
        }

        toastError("Wrong email or password. Please try again.");
        return false;
    }

    // Check email verification state
    if (!data.user?.email_confirmed_at) {
        toastError("Please confirm your email address. A new verification email has been sent.");

        await supabasePersistent.auth.resend({
            type: "signup",
            email,
        });

        return false;
    }

    return true;
}

export default signIn;