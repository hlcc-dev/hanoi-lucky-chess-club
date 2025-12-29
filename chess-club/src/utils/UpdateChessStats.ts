import { getActiveClient } from "./getActiveClient";
import { useUser } from "../hooks/useUser";

interface ChessStatsInput {
    chess_com_name: string;
    chess_com_player_id: number;
    chess_com_blitz?: number;
    chess_com_bullet?: number;
    chess_com_rapid?: number;
    chess_com_daily?: number;
    chess_com_960_daily?: number;
    chess_com_title?: "GM" | "IM" | "FM" | "CM" | "WGM" | "WIM" | "WFM" | "WCM";
    fide_rating?: number;
}

async function updateChessStats({
    chess_com_name,
    chess_com_player_id,
    chess_com_blitz = 1200,
    chess_com_bullet = 1200,
    chess_com_rapid = 1200,
    chess_com_daily = 1200,
    chess_com_960_daily = 1200,
    chess_com_title,
    fide_rating,
}: ChessStatsInput): Promise<boolean> {
    const { user } = useUser();
    // Ensure we have a logged-in user
    if (!user) {
        return false;
    }

    const supabaseClient = await getActiveClient();

    const { error } = await supabaseClient
        .from("chess_com_stats")
        .update({
            chess_com_name,
            chess_com_player_id,
            chess_com_blitz,
            chess_com_bullet,
            chess_com_rapid,
            chess_com_daily,
            chess_com_960_daily,
            chess_com_title,
            fide_rating,
        })
        .eq("id", user.id);

    if (error) {
        console.error("Chess stats update failed:", error.message);
        return false;
    }

    return true;
}

export default updateChessStats;