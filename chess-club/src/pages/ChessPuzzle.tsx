import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import useAttempt from "../hooks/useAttempt";
import { useUser } from "../hooks/useUser";
import { usePuzzleTimer } from "../hooks/usePuzzleTimer";
import fetchDailyPuzzle from "../hooks/useFetchPuzzle";

import ChessBoard from "../components/ChessBoard";
import ChessLoading from "../components/ChessboardComps/ChessLoading";
import ChessLeaderboard from "../components/ChessboardComps/ChessLeaderboard";
import type { ChessLeaderboardEntry } from "../components/ChessboardComps/ChessLeaderboard";
import PuzzleCompleted from "../components/ChessboardComps/PuzzleCompleted";

import {
    initPuzzleEngine,
    tryPuzzleMove,
    type PuzzleEngine,
} from "../utils/puzzleEngine";

import { getPuzzleStats, updatePuzzleStats } from "../utils/puzzleStats";
import { toastError, toastSuccess, toastInfo } from "../utils/toastUtils";

function ChessPuzzle() {
    const navigate = useNavigate();

    // User information
    const user = useUser();
    const userId = user.user?.id ?? null;

    //Allow moves only if user has not played today

    const [movesEnabled, setMovesEnabled] = useState(true);

    // Daily puzzle data
    const { puzzle, loading, error } = fetchDailyPuzzle();

    // Puzzle engine reference
    const engineRef = useRef<PuzzleEngine | null>(null);

    // Board position
    const [fen, setFen] = useState("");

    // Board orientation
    const [boardOrientation, setBoardOrientation] =
        useState<"white" | "black">("white");

    // Timer reset trigger
    const [resetKey, setResetKey] = useState(0);

    // Elapsed time
    const { elapsed } = usePuzzleTimer(resetKey, movesEnabled);

    // Attempts counter
    const { attempts, incrementAttempt } = useAttempt();



    // Leaderboard data
    const [puzzleStats, setPuzzleStats] = useState<ChessLeaderboardEntry[]>([]);
    const frozenElapsedRef = useRef(0);
    const frozenAttemptsRef = useRef(0);

    useEffect(() => {
        if (!userId) return;

        const me = puzzleStats.find(p => p.user_id === userId);
        if (!me) return;

        frozenElapsedRef.current = me.time_seconds;
        frozenAttemptsRef.current = me.attempt;

    }, [puzzleStats, userId]);

    // Displayed time (memoized for stability)
    const displayElapsed = useMemo(
        () => (movesEnabled ? elapsed : frozenElapsedRef.current),
        [movesEnabled, elapsed]
    );

    // Displayed attempts (memoized for stability)
    const displayAttempts = useMemo(
        () => (movesEnabled ? attempts : frozenAttemptsRef.current),
        [movesEnabled, attempts]
    );


    // is it solved already?
    const puzzleSolved = useMemo(() => {
        return puzzleStats.some(
            (player: ChessLeaderboardEntry) => player.user_id === userId
        );
    }, [puzzleStats, userId]);

    // Leaderboard loading state
    const [statsLoading, setStatsLoading] = useState(true);

    // Leaderboard error state
    const [statsError, setStatsError] = useState<string | null>(null);

    // Today’s puzzle date
    const puzzleDate = useMemo(
        () => new Date().toISOString().slice(0, 10),
        []
    );

    // Puzzle completed modal state
    const [showPuzzleCompleted, setShowPuzzleCompleted] = useState(false);


    // Redirect if user is not logged in
    useEffect(() => {
        if (!user.loading && !userId) {
            toastError("You must be logged in to access the daily puzzle.");
            navigate("/login");
        }
    }, [user.loading, userId, navigate]);
    // Prevent duplicate already-played notifications
    const alreadyNotifiedRef = useRef(false);

    // Notify if user has already played today
    useEffect(() => {
        if (alreadyNotifiedRef.current) return;

        if (!user.loading && user.puzzleStats) {
            setMovesEnabled(false);
            setShowPuzzleCompleted(true);
            alreadyNotifiedRef.current = true;
        }
    }, [user.loading, user.puzzleStats]);


    // Initialize puzzle engine when puzzle loads (once per puzzleDate)
    useEffect(() => {
        if (!puzzle) return;

        engineRef.current = initPuzzleEngine(
            puzzle.game.pgn,
            puzzle.puzzle.solution
        );

        const initialFen = engineRef.current.chess.fen();
        setFen(initialFen);

        const turn = engineRef.current.chess.turn();
        setBoardOrientation(turn === "w" ? "black" : "white");


        const timer = setTimeout(() => {
            if (!engineRef.current) return;

            const { from, to, promotion } = engineRef.current.lastMove;

            engineRef.current.chess.move({
                from,
                to,
                promotion: promotion ?? "q",
            });

            setFen(engineRef.current.chess.fen());
        }, 2000);


        return () => {
            clearTimeout(timer);
            engineRef.current = null; // adjust here in the future for cleanup
        };
    }, [puzzleDate, puzzle, puzzleSolved, userId]);

    // Reset timer when puzzle changes
    useEffect(() => {
        if (!puzzle?.puzzle?.id) return;
        setResetKey(prev => prev + 1);
    }, [puzzle?.puzzle?.id]);

    // Fetch leaderboard stats
    useEffect(() => {
        setStatsLoading(true);
        setStatsError(null);

        (async () => {
            try {
                const { data, error } = await getPuzzleStats(puzzleDate);

                if (error) {
                    setStatsError(error.message);
                    return;
                }

                setPuzzleStats(data || []);
                console.log("Puzzle stats:", data);
            } catch (err: any) {
                setStatsError(err.message);
            } finally {
                setStatsLoading(false);
            }
        })();
    }, [puzzleDate]);

    // Handle user move on the board
    const handleMove = (from: string, to: string) => {
        if (!engineRef.current) return false;
        if (from === to) return false;

        const result = tryPuzzleMove(engineRef.current, from, to);

        if (!result.ok && !result.wrong) return false;

        if (result.wrong) {
            if (result.previewFen) {
                setFen(result.previewFen);
            }

            setTimeout(() => {
                setFen(result.fen);
                toastError("Wrong move for the puzzle. Try another move.");
                incrementAttempt();
            }, 500);

            return false;
        }

        setFen(result.fen);

        if (result.pendingOpponentMove) {
            setTimeout(() => {
                if (!engineRef.current || !result.pendingOpponentMove) return;

                const { from, to, promotion } = result.pendingOpponentMove;

                engineRef.current.chess.move({
                    from,
                    to,
                    promotion: promotion ?? "q",
                });

                setFen(engineRef.current.chess.fen());
            }, 500);
        }

        if (result.finished) {
            setShowPuzzleCompleted(true);

            if (userId) {
                updatePuzzleStats(userId, puzzleDate, elapsed, attempts)
                    .then(({ error }) => {
                        if (error) {
                            console.error("Error updating puzzle stats:", error);
                        }
                    });

                setMovesEnabled(false);
                frozenElapsedRef.current = elapsed;
                frozenAttemptsRef.current = attempts;
                // Update leaderboard instantly
                setPuzzleStats(prev => [
                    ...prev,
                    {
                        user_id: userId,
                        puzzle_date: puzzleDate,
                        time_seconds: elapsed,
                        attempt: attempts,
                        solved_at: new Date().toISOString(),
                        profiles: {
                            username: user.profile?.username ?? "You",
                        },
                    },
                ]);
            }

            return true;
        }

        return true;
    };

    // Loading screen
    if (loading || user.loading) {
        return (
            <div className="flex w-full grow flex-1 items-center justify-center py-10">
                <ChessLoading text="Loading puzzle" />
            </div>
        );
    }

    // Stop render if user is missing
    if (!user.user) return null;

    // Error state
    if (error) return <div>Error: {error}</div>;

    // Wait until board is ready
    if (!fen) return null;

    return (
        <div className="grow flex flex-col items-center px-3 sm:px-0">
            {showPuzzleCompleted && (
                <PuzzleCompleted
                    time={displayElapsed}
                    attempts={displayAttempts}
                    onClose={() => setShowPuzzleCompleted(false)}
                />
            )}
            <div className="w-full max-w-5xl mx-auto mt-4 mb-6 sm:mt-6 sm:mb-8">
                <div className="relative flex justify-center">
                    <div className="flex items-center gap-3 bg-club-primary/20 px-4 py-3 sm:px-8 sm:py-4 rounded-xl border border-black/20 shadow-md">
                        <h1 className="text-lg sm:text-2xl font-semibold tracking-wide text-center">
                            Daily Chess Puzzle - Rating : {puzzle?.puzzle.rating}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="flex w-full max-w-270 flex-col md:flex-row justify-center items-start gap-6 md:gap-12 mx-auto">
                {/* Board section - full width on mobile */}
                <div className="flex justify-center w-full md:w-auto">
                    <ChessBoard
                        fen={fen}
                        onMove={handleMove}
                        boardOrientation={boardOrientation}
                        movesEnabled={movesEnabled}
                    />
                </div>

                {/* Leaderboard / stats - below board on mobile, right side on desktop */}
                <div className="w-full max-w-md flex flex-col gap-4 mt-6 md:mt-0">
                    {statsLoading && (
                        <div className="text-sm text-gray-500 text-center">
                            Loading leaderboard…
                        </div>
                    )}

                    {statsError && (
                        <div className="text-sm text-red-500 text-center">
                            {statsError}
                        </div>
                    )}

                    {!statsLoading && !statsError && (
                        <ChessLeaderboard
                            user_id={userId}
                            data={puzzleStats}
                            statsLoading={statsLoading}
                            statsError={statsError}
                            displayElapsed={movesEnabled ? displayElapsed : frozenElapsedRef.current}
                            displayAttempts={movesEnabled ? displayAttempts : frozenAttemptsRef.current}
                            movesEnabled={movesEnabled}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChessPuzzle;