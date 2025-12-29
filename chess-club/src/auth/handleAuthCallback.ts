import { supabasePersistent } from "../utils/supabaseClient";

export async function handleAuthCallback(navigate: (path: string) => void) {
    const { data, error } = await supabasePersistent.auth.getSession();

    if (error) {
        console.error("Auth callback error:", error.message);
        return;
    }

    if (data.session) {
        // User is now VERIFIED
        navigate("/");
    }
}