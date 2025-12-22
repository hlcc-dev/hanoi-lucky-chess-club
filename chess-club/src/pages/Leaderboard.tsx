import { useEffect, useState } from "react";
import { supabasePersistent } from "../utils/supabaseClient";

type LeaderboardType =
    | "blitz"
    | "bullet"
    | "rapid"
    | "daily"
    | "960"
    | "fide";

const leaderboardTabs: { label: string; value: LeaderboardType }[] = [
    { label: "Blitz", value: "blitz" },
    { label: "Bullet", value: "bullet" },
    { label: "Rapid", value: "rapid" },
    { label: "Daily", value: "daily" },
    { label: "960", value: "960" },
    { label: "FIDE", value: "fide" },
];

const columnMap: Record<LeaderboardType, string> = {
    blitz: "chess_com_blitz",
    bullet: "chess_com_bullet",
    rapid: "chess_com_rapid",
    daily: "chess_com_daily",
    "960": "chess_com_960_daily",
    fide: "fide_rating",
};

interface LeaderboardRow {
    id: string;
    chess_com_name: string;
    chess_com_title: string | null;
    rating: number | null;
    profiles: {
        username: string;
    } | null;
}

function Leaderboard() {
    const [type, setType] = useState<LeaderboardType>("blitz");
    const [rows, setRows] = useState<LeaderboardRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // get current user id
    useEffect(() => {
        supabasePersistent.auth.getUser().then(({ data }) => {
            setCurrentUserId(data.user?.id ?? null);
        });
    }, []);

    // fetch leaderboard
    useEffect(() => {
        async function fetchLeaderboard() {
            setLoading(true);

            const { data, error } = await supabasePersistent
                .from("chess_com_stats")
                .select(`
                    id,
                    chess_com_name,
                    chess_com_title,
                    ${columnMap[type]},
                    profiles (
                        username
                    )
                `)
                .not("chess_com_name", "is", null)
                .order(columnMap[type], { ascending: false })
                .limit(50);

            if (!error && data) {
                setRows(
                    data.map((row: any) => ({
                        id: row.id,
                        chess_com_name: row.chess_com_name,
                        chess_com_title: row.chess_com_title,
                        rating: row[columnMap[type]],
                        profiles: row.profiles,
                    }))
                );
            }

            setLoading(false);
        }

        fetchLeaderboard();
    }, [type]);

    return (
        <div className="grow">
            {/* HEADER */}
            <div className="max-w-6xl mx-auto mb-6">
                <h1 className="text-4xl font-bold text-center mb-4">
                    Leaderboard
                </h1>

                {/* TABS */}
                <div className="flex flex-wrap justify-center gap-2">
                    {leaderboardTabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setType(tab.value)}
                            className={`
                                px-4 py-2 rounded-lg border font-medium transition
                                ${type === tab.value
                                    ? "bg-club-primary text-club-dark border-club-secondary"
                                    : "border-club-secondary hover:bg-club-secondary/10"
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* TABLE */}
            <div className="max-w-6xl mx-auto bg-white rounded-xl border border-club-dark/20 shadow-sm overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-club-primary text-club-dark">
                        <tr>
                            <th className="px-4 py-3 text-left w-16">#</th>
                            <th className="px-4 py-3 text-left">Player</th>
                            <th className="px-4 py-3 text-right">Rating</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={3} className="py-8 text-center">
                                    Loading leaderboard...
                                </td>
                            </tr>
                        )}

                        {!loading && rows.length === 0 && (
                            <tr>
                                <td colSpan={3} className="py-8 text-center">
                                    No players found.
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            rows.map((row, index) => {
                                const isMe = row.id === currentUserId;

                                const rankColor =
                                    index === 0
                                        ? "text-yellow-600"
                                        : index === 1
                                            ? "text-gray-500"
                                            : index === 2
                                                ? "text-amber-700"
                                                : "text-club-dark";

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
                                            className={`px-4 py-3 font-bold ${rankColor}`}
                                        >
                                            {index + 1}
                                        </td>

                                        {/* PLAYER */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">
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

                                            <div className="text-xs text-gray-500">
                                                {row.chess_com_name}
                                            </div>
                                        </td>

                                        {/* RATING */}
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-lg font-bold">
                                                {row.rating ?? "-"}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Leaderboard;