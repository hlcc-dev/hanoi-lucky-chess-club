import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import { useChessUser } from "../hooks/useChessUser";
import updateChessStats from "../utils/UpdateChessStats";
import { toastError } from "../utils/toastUtils";

export function useBackgroundChessRefresh() {
    const user = useUser();
    const { profile, stats, status, checkUser } = useChessUser();

    const [ranToday, setRanToday] = useState(false);

    useEffect(() => {
        // if no user logged in or already ran today, do nothing
        if (!user?.user) return;

        // if already ran today, do nothing
        if (ranToday) return;

        if (localStorage.getItem("last_chess_refresh") === null) {
            //set it to yesterday to force refresh on first run
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayKey = yesterday.toISOString().slice(0, 10);
            localStorage.setItem("last_chess_refresh", yesterdayKey);
        }
        const lastRun = localStorage.getItem("last_chess_refresh");
        const todayKey = new Date().toISOString().slice(0, 10);

        // already refreshed today
        if (lastRun === todayKey) {
            setRanToday(true);
            return;
        }

        checkUser(user?.chessStats?.chess_com_name || "");

        // if stats not loaded or error, do nothing
        if (status !== "success" || !stats) {
            return;
        }

        // update chess stats in background
        (async () => {
            try {
                await updateChessStats({
                    user_id: user.user?.id!,
                    chess_com_blitz: stats?.chess_blitz?.last?.rating,
                    chess_com_bullet: stats?.chess_bullet?.last?.rating,
                    chess_com_rapid: stats?.chess_rapid?.last?.rating,
                    chess_com_daily: stats?.chess_daily?.last?.rating,
                    chess_com_960_daily: stats?.chess960_daily?.last?.rating,
                    chess_com_title: profile?.title,
                    fide_rating: stats?.fide,
                });

                // mark as ran today
                localStorage.setItem("last_chess_refresh", todayKey);
                setRanToday(true);
            } catch (e) {
                toastError("Failed to refresh Chess.com stats in background.");
            }
        })();
    }, [user?.user, status, ranToday]);
}