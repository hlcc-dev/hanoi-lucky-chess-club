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

    if (error || !data.session) {
        toastError("Wrong email or password. Please try again.");
        return false;
    }

    return true;
}

export default signIn;