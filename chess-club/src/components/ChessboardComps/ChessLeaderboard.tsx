import { useRef, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

// Types for leaderboard rows coming from the database
export interface ChessLeaderboardEntry {
    user_id: string;
    puzzle_date: string;
    time_seconds: number;
    attempt: number;
    solved_at: string;
    profiles: {
        username: string;
    };
}

// Props passed into the leaderboard component
interface ChessLeaderboardProps {
    user_id?: string | null;
    statsLoading?: boolean;
    statsError?: string | null;
    displayElapsed: number;
    displayAttempts: number;
    movesEnabled: boolean;
    data: ChessLeaderboardEntry[];
}

// Renders the daily puzzle leaderboard
function ChessLeaderboard({
    user_id,
    data,
    statsLoading,
    statsError,
    displayElapsed,
    displayAttempts,
    movesEnabled,
}: ChessLeaderboardProps) {
    // -------- MEMOIZED LEADERBOARD + WINDOW LOGIC --------
    const leaderboard = useMemo(() => data, [data]);

    const {
        visibleRows,
        userIndex,
        total
    } = useMemo(() => {
        const WINDOW = 5;
        const total = leaderboard.length;

        const userIndex = leaderboard.findIndex(
            (entry) => entry.user_id === user_id
        );

        const topRows = leaderboard.slice(0, 3);
        let visible: ChessLeaderboardEntry[] = [];

        if (userIndex === -1) {
            visible = leaderboard.slice(0, 10);
        } else if (userIndex < 3) {
            visible = leaderboard.slice(0, 10);
        } else if (userIndex >= total - WINDOW) {
            const tempVisibleRows = leaderboard.slice(Math.max(total - 10, 0), total);
            visible = [...topRows, ...tempVisibleRows];
        } else {
            const start = Math.max(userIndex - WINDOW, 3);
            const end = Math.min(userIndex + WINDOW + 1, total);
            const middleRows = leaderboard.slice(start, end);
            visible = [...topRows, ...middleRows];
        }

        return { visibleRows: visible, userIndex, total };
    }, [leaderboard, user_id]);

    // Refs are used to auto-scroll to the current user
    const containerRef = useRef<HTMLDivElement | null>(null);
    const userRowRef = useRef<HTMLDivElement | null>(null);

    // Centers the current user row on render/update
    useEffect(() => {
        if (userRowRef.current) {
            userRowRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [user_id, data]);

    return (
        <div className="mb-6 w-full max-w-2xl mx-auto justify-center items-center flex px-2 sm:px-0">
            <div className="bg-club-light/60 border border-black/20 rounded-2xl p-4 sm:p-6 shadow-lg w-full">

                {/* ===== Your Stats ===== */}
                <div className="mb-6 p-3 sm:p-4">
                    <p className="mb-3 text-lg font-bold text-center">Your Stats</p>

                    {!movesEnabled && (
                        <p className="mb-4 text-sm text-center text-gray-700">
                            You’ve already completed today’s puzzle. Come back tomorrow!
                        </p>
                    )}

                    <div className="flex justify-center content-center items-center gap-4 sm:gap-6 flex-wrap sm:flex-nowrap w-full text-center">
                        <div className="flex flex-col gap-1 px-4 py-3 rounded-xl border border-black/20 bg-[#f3e7c4] shadow-sm w-36 sm:w-40">
                            <span className="text-xs uppercase text-gray-600 text-center">
                                Time Elapsed
                            </span>
                            <span className="font-mono text-lg font-semibold self-center">
                                {Math.floor(displayElapsed / 60)}:
                                {String(displayElapsed % 60).padStart(2, "0")}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1 px-4 py-3 rounded-xl border border-black/20 bg-[#f3e7c4] shadow-sm w-36 sm:w-40">
                            <span className="text-xs uppercase text-gray-600 text-center">
                                Total Mistakes
                            </span>
                            <span className="font-mono text-lg font-bold self-center">
                                {displayAttempts}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ===== Leaderboard ===== */}
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center">
                    Daily Leaderboard
                </h2>

                {statsLoading && (
                    <p className="text-center text-sm text-gray-500">
                        Loading leaderboard…
                    </p>
                )}

                {statsError && (
                    <p className="text-center text-sm text-red-500">
                        {statsError}
                    </p>
                )}

                {leaderboard.length === 0 && !statsLoading && (
                    <div className="bg-[#ead9ad] rounded-lg px-4 py-3 text-sm text-center shadow-inner">
                        No solves yet. Be the first!
                    </div>
                )}

                {/* Enables vertical scrolling only */}
                {visibleRows.length > 0 && (
                    <div
                        ref={containerRef}
                        className="flex flex-col gap-2 px-4 py-5 max-h-65 sm:max-h-72 overflow-y-auto overflow-x-hidden overscroll-contain overflow-hidden"
                    >
                        {visibleRows.map((entry, index) => {
                            const isCurrentUser = user_id === entry.user_id;

                            return (
                                // Marks the current user row for scrolling
                                <div
                                    ref={isCurrentUser ? userRowRef : null}
                                    key={entry.solved_at}
                                    className={`flex items-center gap-3 sm:gap-4 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm shadow-inner
                                        ${isCurrentUser
                                            ? "bg-club-secondary font-semibold scale-[1.02]"
                                            : "bg-[#ead9ad]"
                                        }`}
                                >
                                    {/* Rank */}
                                    <div className="w-6 text-center font-semibold flex flex-row justify-center items-center">


                                        {index === 0 && (
                                            <FontAwesomeIcon className="inline mr-1 text-yellow-400" icon={faCrown} />
                                        )}

                                        {index === 1 && (
                                            <FontAwesomeIcon className="inline mr-1 text-gray-400" icon={faCrown} />
                                        )}

                                        {index === 2 && (
                                            <FontAwesomeIcon className="inline mr-1 text-[#cd7f32]" icon={faCrown} />
                                        )}
                                        {leaderboard.findIndex((e) => e.user_id === entry.user_id) + 1}
                                    </div>

                                    {/* Username */}
                                    <div
                                        className={`flex-1 truncate text-xs sm:text-sm ${isCurrentUser ? "text-center" : ""
                                            }`}
                                    >
                                        {entry.profiles.username}
                                    </div>

                                    {/* Time */}
                                    <div className="w-16 text-right font-mono">
                                        {Math.floor(entry.time_seconds / 60)}:
                                        {String(entry.time_seconds % 60).padStart(2, "0")}
                                    </div>

                                    {/* Attempts */}
                                    <div className="w-20 text-right text-gray-700 text-xs sm:text-sm">
                                        {entry.attempt} tries
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChessLeaderboard;