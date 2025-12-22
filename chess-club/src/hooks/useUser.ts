import { useEffect, useState } from "react";
import { supabasePersistent } from "../utils/supabaseClient";
import type { User } from "@supabase/supabase-js";

interface Profile {
    id: string;
    username: string;
}

interface ChessStats {
    chess_com_name: string | null;
    chess_com_player_id: number | null;
    chess_com_blitz: number | null;
    chess_com_bullet: number | null;
    chess_com_rapid: number | null;
    chess_com_daily: number | null;
    chess_com_960_daily: number | null;
    chess_com_title: string | null;
    fide_rating: number | null;
}

export function useUser() {
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [chessStats, setChessStats] = useState<ChessStats | null>(null);
    const [loading, setLoading] = useState(true);

    async function loadUser() {
        setLoading(true);

        const {
            data: { user },
        } = await supabasePersistent.auth.getUser();

        if (!user) {
            setAuthUser(null);
            setProfile(null);
            setChessStats(null);
            setLoading(false);
            return;
        }

        setAuthUser(user);

        const { data: profileData, error: profileError } = await supabasePersistent
            .from("profiles")
            .select("id, username")
            .eq("id", user.id)
            .maybeSingle();

        const { data: chessData, error: chessError } = await supabasePersistent
            .from("chess_com_stats")
            .select(`
                chess_com_name,
                chess_com_player_id,
                chess_com_blitz,
                chess_com_bullet,
                chess_com_rapid,
                chess_com_daily,
                chess_com_960_daily,
                chess_com_title,
                fide_rating
            `
            )
            .eq("id", user.id)
            .maybeSingle()
            .returns<ChessStats>();

        if (profileError || chessError) {
            console.error("Error loading user data:", profileError?.message, chessError?.message);
            setProfile(null);
            setChessStats(null);
            setLoading(false);
            return;
        }

        setProfile(profileData ?? null);
        setChessStats(chessData ?? null);
        setLoading(false);
    }

    useEffect(() => {
        loadUser();

        const {
            data: { subscription },
        } = supabasePersistent.auth.onAuthStateChange(() => {
            loadUser();
        });

        return () => subscription.unsubscribe();
    }, []);

    return {
        user: authUser,
        profile,
        chessStats,
        loading,
    };
}