import { useEffect, useState } from "react";
import {
    supabasePersistent,
    supabaseSessionOnly,
} from "../utils/supabaseClient";
import type { User } from "@supabase/supabase-js";

interface Profile {
    id: string;
    username: string;
}

export interface ChessStats {
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

interface PuzzleStats {
    user_id: string;
    puzzle_date: string;
    time_seconds: number;
    solved_at: string;
    attempt: number;
}

export function useUser() {
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [chessStats, setChessStats] = useState<ChessStats | null>(null);
    const [puzzleStats, setPuzzleStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    async function loadUser() {
        setLoading(true);

        // 1️⃣ Determine which client has the user
        let activeClient = supabasePersistent;

        let {
            data: { user },
        } = await supabasePersistent.auth.getUser();

        if (!user) {
            const {
                data: { user: sessionUser },
            } = await supabaseSessionOnly.auth.getUser();

            if (sessionUser) {
                user = sessionUser;
                activeClient = supabaseSessionOnly;
            }
        }

        // 2️⃣ If still no user → clear state
        if (!user) {
            setAuthUser(null);
            setProfile(null);
            setChessStats(null);
            setPuzzleStats(null);
            setLoading(false);
            return;
        }

        setAuthUser(user);

        // 3️⃣ Load profile
        const { data: profileData, error: profileError } = await activeClient
            .from("profiles")
            .select("id, username")
            .eq("id", user.id)
            .maybeSingle();

        // 4️⃣ Load chess stats
        const { data: chessData, error: chessError } = await activeClient
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
            `)
            .eq("id", user.id)
            .maybeSingle()
            .returns<ChessStats>();

        // 5️⃣ Load puzzle stats
        const today = new Date().toISOString().split("T")[0];

        const { data: puzzleData, error: puzzleError } = await activeClient
            .from("daily_puzzle_solves")
            .select("*")
            .eq("user_id", user.id)
            .eq("puzzle_date", today)
            .single()
            .returns<PuzzleStats>();

        if (profileError || chessError || puzzleError) {
            console.error(
                "Error loading user data:",
                profileError?.message,
                chessError?.message,
                puzzleError?.message
            );
        }

        setProfile(profileData ?? null);
        setChessStats(chessData ?? null);
        setPuzzleStats(puzzleData ?? null);
        setLoading(false);
    }

    useEffect(() => {
        loadUser();

        const {
            data: { subscription: persistentSub },
        } = supabasePersistent.auth.onAuthStateChange(() => {
            loadUser();
        });

        const {
            data: { subscription: sessionSub },
        } = supabaseSessionOnly.auth.onAuthStateChange(() => {
            loadUser();
        });

        return () => {
            persistentSub.unsubscribe();
            sessionSub.unsubscribe();
        };
    }, []);

    return {
        user: authUser,
        profile,
        chessStats,
        puzzleStats,
        loading,
    };
}