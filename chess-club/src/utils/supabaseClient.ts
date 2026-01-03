import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabasePersistent = createClient(supabaseUrl, anonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
});

const storage = typeof window !== "undefined" ? window.sessionStorage : undefined;

export const supabaseSessionOnly = createClient(supabaseUrl, anonKey, {
    auth: {
        persistSession: false,
        storage: storage,
        autoRefreshToken: false,
    },
});