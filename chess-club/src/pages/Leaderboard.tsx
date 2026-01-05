import { useEffect, useState, useRef } from "react";
import { getActiveClient } from "../utils/getActiveClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket, faFire, faCalendar, faShuffle, faGlobe, faCrown, faPuzzlePiece } from "@fortawesome/free-solid-svg-icons";
import { supabasePersistent } from "../utils/supabaseClient";



const CACHE_KEY = "leaderboardCache_v1";

function loadCache(): Record<LeaderboardType, LeaderboardRow[]> {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        return raw ? JSON.parse(raw) : { "Daily Puzzle": [], blitz: [], bullet: [], rapid: [], daily: [], "960": [], fide: [] };
    } catch {
        return { "Daily Puzzle": [], blitz: [], bullet: [], rapid: [], daily: [], "960": [], fide: [] };
    }
}

function saveCache(cache: Record<LeaderboardType, LeaderboardRow[]>) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

type LeaderboardType =
    | "Daily Puzzle"
    | "blitz"
    | "bullet"
    | "rapid"
    | "daily"
    | "960"
    | "fide";

const leaderboardTabs: { label: string; value: LeaderboardType, icon: any }[] = [
    { label: "Daily Puzzle", value: "Daily Puzzle", icon: faPuzzlePiece },
    { label: "Blitz", value: "blitz", icon: faFire },
    { label: "Bullet", value: "bullet", icon: faRocket },
    { label: "Rapid", value: "rapid", icon: faRocket },
    { label: "Daily", value: "daily", icon: faCalendar },
    { label: "960", value: "960", icon: faShuffle },
    { label: "FIDE", value: "fide", icon: faGlobe },
];

interface LeaderboardRow {
    id: string;
    chess_com_name: string;
    chess_com_title: string | null;
    rating: number | null;
    profiles: {
        username: string;
    } | null;
}

interface DailyPuzzleWinner {
    user_id: string;
    chess_com_name: string;
    username: string | null;
    wins: number;
}

function Leaderboard() {
    const [type, setType] = useState<LeaderboardType>("Daily Puzzle");
    const [rows, setRows] = useState<LeaderboardRow[]>([]);
    const [dailyPuzzleWinnersRows, setDailyPuzzleWinnersRows] = useState<DailyPuzzleWinner[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const cacheRef = useRef<Record<LeaderboardType, LeaderboardRow[]>>(loadCache());
    const dailyPuzzleCacheRef = useRef<DailyPuzzleWinner[] | null>(null);

    // get current user id
    useEffect(() => {
        (async () => {
            const client = await getActiveClient();
            if (!client) {
                setCurrentUserId(null);
                return;
            }
            const { data } = await client.auth.getUser();
            setCurrentUserId(data.user?.id ?? null);
        })();
    }, []);

    // fetch leaderboard (ONE TIME ONLY)
    useEffect(() => {
        async function fetchLeaderboard() {
            setLoading(true);

            // If already cached from earlier visit show instantly,
            // but STILL fetch from DB once to revalidate.
            if (dailyPuzzleCacheRef.current || Object.values(cacheRef.current).some(x => x.length > 0)) {
                applyTabData();
                // don't return; still go on to fetch fresh data
            }

            // ---------- FETCH DAILY PUZZLE WINNERS ----------
            const { data: dailyData, error: dailyError } = await supabasePersistent.rpc("get_daily_puzzle_winners");
            if (dailyError) {
                dailyPuzzleCacheRef.current = [];
                console.error("Failed to fetch Daily Puzzle winners:", dailyError.message);
            } else {
                dailyPuzzleCacheRef.current = dailyData || [];
                console.log(dailyData);
            }

            // ---------- FETCH ALL LEADERBOARD RATINGS AT ONCE ----------
            const { data, error } = await supabasePersistent
                .from("chess_com_stats")
                .select(`
                    id,
                    chess_com_name,
                    chess_com_title,
                    chess_com_blitz,
                    chess_com_bullet,
                    chess_com_rapid,
                    chess_com_daily,
                    chess_com_960_daily,
                    fide_rating,
                    profiles ( username )
                `)
                .not("chess_com_name", "is", null)
                .limit(200);

            if (error || !data) {
                setLoading(false);
                return;
            }

            function mapRows(
                ratingKey:
                    | "chess_com_blitz"
                    | "chess_com_bullet"
                    | "chess_com_rapid"
                    | "chess_com_daily"
                    | "chess_com_960_daily"
                    | "fide_rating"
            ) {
                const rowsArray = (data ?? []) as any[];

                return rowsArray
                    .sort((a, b) => ((b?.[ratingKey] ?? 0) as number) - ((a?.[ratingKey] ?? 0) as number))
                    .map((row: any) => ({
                        id: row.id as string,
                        chess_com_name: row.chess_com_name as string,
                        chess_com_title: row.chess_com_title as string | null,
                        rating: (row?.[ratingKey] as number) ?? null,
                        profiles: row.profiles ?? null,
                    }));
            }

            cacheRef.current = {
                "Daily Puzzle": [],
                blitz: mapRows("chess_com_blitz"),
                bullet: mapRows("chess_com_bullet"),
                rapid: mapRows("chess_com_rapid"),
                daily: mapRows("chess_com_daily"),
                "960": mapRows("chess_com_960_daily"),
                fide: mapRows("fide_rating"),
            };

            saveCache(cacheRef.current);

            applyTabData();
            setLoading(false);
        }

        fetchLeaderboard();
    }, []);

    function applyTabData() {
        if (type === "Daily Puzzle") {
            setRows([]);
            setDailyPuzzleWinnersRows(dailyPuzzleCacheRef.current || []);
        } else {
            setDailyPuzzleWinnersRows([]);
            setRows(cacheRef.current[type] || []);
        }
    }

    useEffect(() => {
        applyTabData();
    }, [type]);

    return (
        <div className="grow px-2 sm:px-0">
            {/* HEADER */}
            <div className="max-w-6xl mx-auto mb-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4">
                    Leaderboard
                </h1>

                {/* TABS */}
                <div className="flex flex-wrap justify-center gap-2 text-sm sm:text-base">
                    {leaderboardTabs.map((tab) => (
                        <div key={tab.value} className="flex items-center gap-1">

                            <button
                                key={tab.value}
                                disabled={loading}
                                onClick={() => setType(tab.value)}
                                className={`
                                px-4 py-2 rounded-lg border font-medium transition
                                disabled:opacity-50 disabled:cursor-not-allowed
                                ${type === tab.value
                                        ? "bg-club-primary text-club-dark border-club-secondary"
                                        : "border-club-secondary hover:bg-club-secondary/10"
                                    }
                            `}
                            >
                                <FontAwesomeIcon icon={tab.icon} />
                                {tab.label}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* TABLE */}
            <div className="max-w-6xl mx-auto bg-white rounded-lg sm:rounded-xl border border-club-dark/20 shadow-sm overflow-x-auto">
                <table className="w-full border-collapse text-sm sm:text-base">
                    <thead className="bg-club-primary text-club-dark">
                        <tr>
                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-left w-16">#</th>
                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Player</th>
                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-right">
                                {type === "Daily Puzzle" ? "Wins" : "Rating"}
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading && rows.length > 0 && (
                            <tr>
                                <td colSpan={3} className="py-3 text-center text-sm text-gray-500">
                                    Updating…
                                </td>
                            </tr>
                        )}
                        {loading && rows.length === 0 && type !== "Daily Puzzle" && (
                            <tr>
                                <td colSpan={3} className="py-8 text-center">
                                    Loading leaderboard...
                                </td>
                            </tr>
                        )}

                        {!loading && rows.length === 0 && type !== "Daily Puzzle" && (
                            <tr>
                                <td colSpan={3} className="py-8 text-center">
                                    No players found.
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            rows.map((row, index) => {
                                const isMe = row.id === currentUserId;

                                return (
                                    <tr
                                        key={row.id}
                                        className={`
                                            transition
                                            ${isMe
                                                ? "bg-club-light"
                                                : "hover:bg-club-light/50"
                                            }
                                        `}
                                    >
                                        {/* RANK */}
                                        <td
                                            className={`flex flex-row justify-center items-center px-3 sm:px-4 py-2 sm:py-3 font-bold text-black text-sm md:text-lg  lg:text-xl} `}
                                        >
                                            {index === 0 && (
                                                <FontAwesomeIcon className="inline mr-1 text-yellow-400" icon={faCrown} />
                                            )}

                                            {index === 1 && (
                                                <FontAwesomeIcon className="inline mr-1 text-gray-400" icon={faCrown} />
                                            )}

                                            {index === 2 && (
                                                <FontAwesomeIcon className="inline mr-1 text-[#cd7f32]" icon={faCrown} />
                                            )}
                                            {index + 1}

                                        </td>

                                        {/* PLAYER */}
                                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm sm:text-base">
                                                    {row.profiles?.username ??
                                                        "-"}
                                                </span>

                                                {row.chess_com_title && (
                                                    <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-club-secondary/20 text-club-secondary">
                                                        {row.chess_com_title}
                                                    </span>
                                                )}

                                                {isMe && (
                                                    <span className="text-xs font-semibold text-club-secondary">
                                                        (You)
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-[10px] sm:text-xs text-gray-500">
                                                {row.chess_com_name}
                                            </div>
                                        </td>

                                        {/* RATING */}
                                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-right">
                                            <span className="text-base sm:text-lg font-bold">
                                                {row.rating ?? "-"}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        {/* Daily Puzzle Winners rows appended below normal rows */}
                        {loading && dailyPuzzleWinnersRows.length > 0 && (
                            <tr>
                                <td colSpan={3} className="py-3 text-center text-sm text-gray-500">
                                    Updating…
                                </td>
                            </tr>
                        )}
                        {loading && dailyPuzzleWinnersRows.length === 0 && type === "Daily Puzzle" && (
                            <tr>
                                <td colSpan={3} className="py-8 text-center">
                                    Loading leaderboard...
                                </td>
                            </tr>
                        )}

                        {!loading && dailyPuzzleWinnersRows.length === 0 && type === "Daily Puzzle" && (
                            <tr>
                                <td colSpan={3} className="py-8 text-center">
                                    No players found.
                                </td>
                            </tr>
                        )}
                        {!loading && type === "Daily Puzzle" && dailyPuzzleWinnersRows.length > 0 &&
                            dailyPuzzleWinnersRows
                                .sort((a, b) => b.wins - a.wins)
                                .map((winner, index) => {
                                    const isMe = winner.user_id === currentUserId;
                                    return (
                                        <tr
                                            key={winner.user_id}
                                            className={`
                                                transition
                                                ${isMe ? "bg-club-light" : "hover:bg-club-light/50"}
                                            `}
                                        >
                                            {/* RANK */}
                                            <td
                                                className={`flex flex-row justify-center items-center px-3 sm:px-4 py-2 sm:py-3 font-bold text-black text-sm md:text-lg  lg:text-xl} `}
                                            >
                                                {index === 0 && (
                                                    <FontAwesomeIcon className="inline mr-1 text-yellow-400" icon={faCrown} />
                                                )}

                                                {index === 1 && (
                                                    <FontAwesomeIcon className="inline mr-1 text-gray-400" icon={faCrown} />
                                                )}

                                                {index === 2 && (
                                                    <FontAwesomeIcon className="inline mr-1 text-[#cd7f32]" icon={faCrown} />
                                                )}
                                                {index + 1}

                                            </td>

                                            {/* PLAYER */}
                                            <td className="px-3 sm:px-4 py-2 sm:py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-sm sm:text-base">
                                                        {winner.username ?? "-"}
                                                    </span>

                                                    {isMe && (
                                                        <span className="text-xs font-semibold text-club-secondary">
                                                            (You)
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="text-[10px] sm:text-xs text-gray-500">
                                                    {winner.chess_com_name}
                                                </div>
                                            </td>

                                            {/* WINS */}
                                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-right">
                                                <span className="text-base sm:text-lg font-bold">
                                                    {winner.wins}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Leaderboard;