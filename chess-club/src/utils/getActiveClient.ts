import {
    supabasePersistent,
    supabaseSessionOnly,
} from "./supabaseClient";

export async function getActiveClient() {
    // Try persistent first
    const { data: pUser } = await supabasePersistent.auth.getUser();
    if (pUser?.user) return supabasePersistent;

    // Then session client
    const { data: sUser } = await supabaseSessionOnly.auth.getUser();
    if (sUser?.user) return supabaseSessionOnly;

    // fallback (not logged in)
    return supabasePersistent;
}