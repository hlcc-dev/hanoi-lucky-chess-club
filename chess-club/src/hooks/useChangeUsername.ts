
import { getActiveClient } from "../utils/getActiveClient";
import { useUser } from "../hooks/useUser";
import { useState } from "react";

export function useChangeUsername() {
    const { profile } = useUser();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const changeUsername = async (username: string) => {
        setLoading(true);
        setError(null);

        const supabaseClient = await getActiveClient();

        if (!profile?.id) {
            setLoading(false);
            setError("User not authenticated");
            throw new Error("User not authenticated");
        }

        const r = await supabaseClient.from("profiles").select("*").eq("id", profile.id);
        console.log(r);

        const { data, error: supabaseError } = await supabaseClient
            .from("profiles")
            .update({ username })
            .eq("id", profile.id)       // no ?
            .select()
            .single();

        console.log("UPDATED ROW:", data);

        if (supabaseError) {
            setLoading(false);
            setError(supabaseError.message);
            throw new Error(supabaseError.message);
        }

        setLoading(false);
        return true;
    };

    return { changeUsername, loading, error };
}