import { supabasePersistent } from "./supabaseClient";

interface SignUp {
    email: string;
    password: string;
    username: string;
}

async function signUp({
    email,
    password,
    username,
}: SignUp): Promise<boolean> {
    const { data, error } = await supabasePersistent.auth.signUp({
        email,
        password,
        options: {
            data: {
                username,
            },
            emailRedirectTo: `${import.meta.env.VITE_SITE_URL}/auth/callback`,
        },
    });

    if (error || !data.user) {
        return false;
    }

    return true;
}

export default signUp;