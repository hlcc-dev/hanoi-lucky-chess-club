import { getActiveClient } from "./getActiveClient";
import type { ChessLeaderboardEntry } from
    "../components/ChessboardComps/ChessLeaderboard";

export async function getPuzzleStats(puzzleDate: string) {
    const supabaseClient = await getActiveClient();
    return supabaseClient
        .from("daily_puzzle_solves")
        .select(`
            user_id,
            puzzle_date,
            time_seconds,
            attempt,
            solved_at,
            profiles (
                username
            )
            
        `)
        .eq("puzzle_date", puzzleDate)
        .order('attempt', { ascending: true },)
        .order('time_seconds', { ascending: true },)
        .returns<ChessLeaderboardEntry[]>();
}

export async function updatePuzzleStats(user_id: string, puzzle_date: string, time_seconds: number, attempt: number) {
    const supabaseClient = await getActiveClient();
    // Update puzzle statistics in Supabase
    return supabaseClient
        .from("daily_puzzle_solves")
        .upsert({ user_id, puzzle_date, time_seconds, attempt });
}

