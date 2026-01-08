
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import ChessBoard from "../components/ChessBoard";
import ChessLoading from "../components/ChessboardComps/ChessLoading";
import { FaLightbulb } from "react-icons/fa";
import { TbPuzzle2 } from "react-icons/tb";
import { GrFormNextLink } from "react-icons/gr";
import { PiSkipForwardFill } from "react-icons/pi";
import { FaRegSquareFull } from "react-icons/fa6";

import { useUser } from "../hooks/useUser";

import type { PuzzleBankTypes } from "../types/puzzleBankTypes";
import type { PuzzleMarathonTypes } from "../types/puzzleMarathonTypes";

// Engine / utils

import { getActiveClient } from "../utils/getActiveClient";
import {
    initPuzzleEngineFen,
    tryPuzzleMove,
    makeFirstComputerMove,
    type PuzzleEngine,
} from "../utils/puzzleEngine";
import { toastError } from "../utils/toastUtils";


// Stats / DB

import {
    getMarathonPuzzleStats,
    incrementMarathonLevel,
    updateMarathonPoints,
    incrementMarathonPuzzleCount
} from "../utils/updateMarathonPuzzleStats";

function PuzzleMarathon() {


    // Global loading & auth

    const [loading, setLoading] = useState(true);
    const [puzzleLoading, setPuzzleLoading] = useState(false);
    const { user, loading: userLoading } = useUser();
    const navigate = useNavigate();


    // User stats & scoring

    const [marathonStats, setMarathonStats] = useState<PuzzleMarathonTypes | null>(null);
    const [currentPoints, setCurrentPoints] = useState(40);


    // Puzzle flow & UI state

    const [message, setMessage] = useState<string | null>(null);
    const [showNextButton, setShowNextButton] = useState(false);
    const [disableSkipButton, setDisableSkipButton] = useState(false);


    // Timer & rating

    const [time, setTime] = useState(0);
    const [rating, setRating] = useState<number | null>(null);


    // Puzzle data & engine

    const [puzzles, setPuzzles] = useState<PuzzleBankTypes[]>([]);
    const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
    const engineRef = useRef<PuzzleEngine | null>(null);


    // Chessboard helpers

    const [hintArrows, setHintArrows] = useState<
        {
            startSquare: string;
            endSquare: string;
            color: string;
        }[]
    >([]);
    const [boardOrientation, setBoardOrientation] = useState<"white" | "black">("white");
    const [fen, setFen] = useState<string>("start");


    // Dynamic feedback messages for different puzzle results

    const correctMessages = [
        "Great job!",
        "Well done!",
        "You're on fire!",
        "Keep it up!",
        "Excellent move!",
    ];
    const incorrectMessages = [
        "Oops, try again.",
        "Not quite right.",
        "Keep practicing!",
        "Don't give up!",
        "Almost had it!",
    ];
    const finishedMessages = [
        "Puzzle completed! Please proceed to the next one.",
        "You're a puzzle master! Please move on to the next challenge.",
        "Fantastic work! One more?",
        "You nailed it! Next puzzle awaits.",
        "Brilliant solving! Ready for the next?",
    ];

    // supabase rpc fetches random puzzles and prevents duplicates
    async function fetchPuzzles() {
        const supabaseClient = await getActiveClient();
        if (puzzles.length === 0) {
            setPuzzleLoading(true);
        }

        const { data, error } = await supabaseClient
            .rpc("get_random_puzzles_timestamp");

        if (error) {
            return;
        }

        if (data) {
            const existingPuzzles = puzzles.map(p => p.id);
            const newPuzzles = (data as PuzzleBankTypes[]).filter(p => !existingPuzzles.includes(p.id));
            setPuzzles(prevPuzzles => [...prevPuzzles, ...newPuzzles]);
            setDisableSkipButton(false);
        }
    }


    // Redirect unauthenticated users

    useEffect(() => {
        if (!user && !userLoading) {
            navigate("/login");
            toastError("Please log in to access the Puzzle Marathon.");
        }
    }, [user, userLoading]);


    // Initial puzzle fetch

    useEffect(() => {
        if (puzzles.length > 0) return;
        fetchPuzzles();
    }, []);


    // Fetch marathon stats

    useEffect(() => {
        if (!user) return;
        getMarathonPuzzleStats(user.id)
            .then((stats) => {
                setMarathonStats(stats);
            })
            .catch((error) => {
            });
    }, [user]);


    // Global loading resolution

    useEffect(() => {
        if (user && puzzles.length > 0 && !puzzleLoading) {
            setLoading(false);
        }
    }, [user, puzzles, puzzleLoading]);


    // Prefetch puzzles

    useEffect(() => {
        if (puzzles.length === 0) return;

        // If we are just before the last puzzle, fetch more puzzles
        if (currentPuzzleIndex === puzzles.length - 2) {
            fetchPuzzles();
            setDisableSkipButton(true);
        }
    }, [currentPuzzleIndex, puzzles]);


    // Puzzle timer

    useEffect(() => {
        const timer = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [time]);


    // Initialize puzzle engine

    useEffect(() => {
        if (puzzles.length === 0) return;

        const currentPuzzle = puzzles[currentPuzzleIndex];
        setRating(currentPuzzle.rating);

        // Split moves safely (handles extra spaces)
        const movesArray = currentPuzzle.moves
            .trim()
            .split(/\s+/);

        if (movesArray.length === 0) return;

        // Init engine with remaining moves AFTER first one
        engineRef.current = initPuzzleEngineFen(currentPuzzle.fen, movesArray.slice(1));
        setBoardOrientation(engineRef.current.chess.turn() === "w" ? "white" : "black");

        // Show initial puzzle position and reset states
        setFen(currentPuzzle.fen);
        setCurrentPoints(40);
        setPuzzleLoading(false);

        // Disable next button
        setShowNextButton(false);

        // Computer makes FIRST move
        const timer = setTimeout(() => {
            if (!engineRef.current) return;
            const success = makeFirstComputerMove(engineRef.current, movesArray[0].slice(0, 2), movesArray[0].slice(2, 4));
            if (success) {
                setFen(engineRef.current.chess.fen());
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [currentPuzzleIndex, puzzles]);

    // Chess interaction

    function handleMove(from: string, to: string): boolean {
        setHintArrows([]);

        if (!engineRef.current) return false;
        if (from === to) return false;

        const result = tryPuzzleMove(engineRef.current, from, to);

        if (!result.ok && !result.wrong) return false;

        if (result.wrong) {
            // temporarily preview wrong move then restore board and penalize
            if (result.previewFen) {
                setFen(result.previewFen);
            }

            setTimeout(() => {
                setFen(result.fen);
            }, 500);

            setMessage(
                incorrectMessages[
                Math.floor(Math.random() * incorrectMessages.length)
                ]
            );
            //lose 10 points for wrong move
            setCurrentPoints((prevPoints) => Math.max(prevPoints - 10, 0));
            return false;
        }


        setMessage(
            correctMessages[
            Math.floor(Math.random() * correctMessages.length)
            ]
        );
        setFen(result.fen);

        if (result.pendingOpponentMove) {
            // plays automatic opponent reply moves with delay
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

        // puzzle finished update stats points level database ui and show next button
        if (result.finished) {
            setTimeout(() => {
                setMessage(
                    finishedMessages[Math.floor(Math.random() * finishedMessages.length)
                    ]

                );
                setShowNextButton(true);
                const cachedLevel = marathonStats?.level ?? 1;
                const currentLevelPoints = marathonStats?.points ?? 0;

                // Convert to lifetime accumulated points
                const lifetimePoints = (cachedLevel - 1) * 100 + currentLevelPoints;

                // Add earned points
                const totalPoints = lifetimePoints + currentPoints;

                // New level based on total points
                const newLevel = Math.floor(totalPoints / 100) + 1;

                // Remaining points inside level (0–99)
                const levelPoints = totalPoints % 100;

                // If level increased → update DB level
                if (newLevel > cachedLevel && user) {
                    incrementMarathonLevel(user.id)
                        .then(() => {
                        })
                        .catch((error) => {
                        });
                }

                // Always update points in DB 
                if (user) {
                    updateMarathonPoints(user.id, levelPoints)
                        .then(() => {
                        })
                        .catch((error) => {
                        });
                    // Increment total puzzles solved
                    incrementMarathonPuzzleCount(user.id)
                        .then(() => {
                        })
                        .catch((error) => {
                        });
                }

                // Update UI state
                setMarathonStats((prevStats) =>
                    prevStats
                        ? {
                            ...prevStats,
                            level: newLevel,
                            points: levelPoints,
                        }
                        : null
                );

            }, 1000);
        }
        return true; // Return true if the move is valid, false otherwise
    }

    // Puzzle navigation
    function handleNextPuzzle() {
        setCurrentPuzzleIndex((prevIndex) => prevIndex + 1);
        setTime(0);
        setMessage(null);
        setRating(puzzles[currentPuzzleIndex].rating);
    }

    function handleSkipPuzzle() {
        setCurrentPuzzleIndex((prevIndex) => prevIndex + 1);
        setTime(0);
    }

    // Hints & penalties

    function handleHint() {
        if (!engineRef.current) return;
        const nextMove = engineRef.current.solution[engineRef.current.index];
        if (!nextMove) return;
        const from = nextMove.slice(0, 2);
        const to = nextMove.slice(2, 4);
        setHintArrows([
            {
                startSquare: from,
                endSquare: to,
                color: "rgba(255,165,0,0.85)",
            },
        ]);
        // lose 5 points for hint
        setCurrentPoints((prevPoints) => Math.max(prevPoints - 5, 0));
    }

    // Show fullscreen loader while initializing or fetching
    if (loading || puzzleLoading || userLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-club-primary">
                <ChessLoading />
            </div>
        );
    }

    // fullscreen locked puzzle marathon layout
    return (
        <div className="fixed inset-0 z-30 flex flex-col items-center justify-start overflow-x-hidden mt-20 md:mt-35 px-3 py-3 bg-club-primary border-t">
            <div className="z-30 w-full max-w-sm mx-auto md:max-w-full flex flex-col items-center justify-center mb-4 mt-2 text-center">
                <TbPuzzle2 className="text-white text-4xl mb-1" />
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">Puzzle Marathon</h1>
                <p className="text-[11px] md:text-sm lg:text-base text-gray-200 opacity-80 tracking-wide mt-1">
                    Sharpen your mind. Enjoy the challenge.
                </p>
            </div>
            {/* Layout wrapper for ChessBoard and right panels */}
            <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row md:items-start md:justify-between md:gap-8">
                <div className="w-full max-w-sm mx-auto md:max-w-[560px] md:w-full lg:max-w-none lg:w-[760px] bg-club-light rounded-2xl shadow-xl p-4 mb-3">
                    <ChessBoard
                        fen={fen}
                        onMove={handleMove}
                        boardOrientation={boardOrientation}
                        hintArrows={hintArrows}
                        movesEnabled={!showNextButton}
                    />
                </div>
                {/* Right side column for stats and message panels */}
                <div className="w-full flex flex-col mx-auto md:w-[360px] lg:w-[400px] shrink-0">
                    <div className="w-full max-w-sm mx-auto md:w-[360px] lg:w-[400px] bg-club-light rounded-2xl shadow-lg p-4 mb-3 space-y-3">
                        <div className="grid grid-cols-3 w-full text-sm md:text-base lg:text-lg font-semibold">
                            <p className="text-left font-semibold text-gray-800 md:text-base lg:text-lg">
                                Points : {marathonStats ? marathonStats.points : "N/A"} <span className='font-bold text-club-primary'>+ {currentPoints}</span>
                            </p>

                            <p className="text-center text-base md:text-lg lg:text-xl font-bold text-gray-800 flex items-center justify-center">
                                {Math.floor(time / 60)}:{time % 60 < 10 ? `0${time % 60}` : time % 60}
                            </p>

                            <p className="text-right font-semibold text-gray-800 md:text-base lg:text-lg">
                                Rating : {rating ? rating : "N/A"}
                            </p>
                        </div>

                        <div className="flex flex-row justify-between items-center space-x-4">
                            <div className="w-full h-3 bg-white/40 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-club-primary rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${marathonStats ? marathonStats.points : 0}%` }}
                                ></div>
                            </div>
                            <p className="text-center text-gray-800 font-bold md:text-lg lg:text-xl w-16">Lv {marathonStats ? marathonStats.level : "N/A"}</p>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between w-full max-w-sm mx-auto md:w-[360px] lg:w-[400px] bg-club-light rounded-2xl shadow-lg p-4 mb-3">
                        <p className="text-base md:text-lg lg:text-xl font-semibold text-gray-800 flex items-center gap-3">
                            {/*first move computer so black = white to move*/}
                            {message ? (
                                <span>{message}</span>
                            ) : boardOrientation === "black" ? (
                                <>
                                    <FaRegSquareFull className="text-black bg-white" />
                                    White to move.
                                </>
                            ) : (
                                <>
                                    <FaRegSquareFull className="text-white bg-black" />
                                    Black to move.
                                </>
                            )}
                        </p>
                    </div>
                    {/* Desktop-only action bar (right side) */}
                    <div className="hidden md:flex flex-col gap-3 mt-2 w-full max-w-sm mx-auto md:w-[360px] lg:w-[400px]">
                        <button
                            className="w-full h-12 flex items-center justify-center bg-club-light text-club-dark rounded-xl font-semibold text-base md:text-lg lg:text-xl active:scale-95 transition"
                            disabled={showNextButton}
                            onClick={handleHint}
                        >
                            <FaLightbulb className="inline mr-2" />
                            Hint
                        </button>

                        <button
                            className="w-full h-12 flex items-center justify-center bg-club-light text-club-dark rounded-xl font-semibold text-base md:text-lg lg:text-xl active:scale-95 transition"
                            disabled={showNextButton || disableSkipButton}
                            onClick={handleSkipPuzzle}
                        >
                            <PiSkipForwardFill className="inline mr-2" />
                            Skip
                        </button>

                        <button
                            className="w-full h-12 flex items-center justify-center bg-club-light text-club-dark rounded-xl font-semibold text-base md:text-lg lg:text-xl disabled:opacity-40 active:scale-95 transition"
                            onClick={handleNextPuzzle}
                            disabled={!showNextButton}
                        >
                            <GrFormNextLink className="inline mr-2" />
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <div className="fixed md:hidden bottom-0 left-0 right-0 bg-white shadow-2xl rounded-t-2xl h-20 flex justify-center items-center w-full">
                <div className="flex w-full h-full overflow-hidden rounded-t-2xl">
                    <button
                        className="w-1/3 h-full flex items-center justify-center bg-club-light text-club-dark border-r rounded-tl-2xl font-semibold active:scale-95 transition"
                        disabled={showNextButton}
                        onClick={handleHint}
                    >
                        <FaLightbulb className="inline mr-2" />
                        Hint
                    </button>

                    <button
                        className="w-1/3 h-full flex items-center justify-center bg-club-light text-club-dark border-r font-semibold active:scale-95 transition"
                        disabled={showNextButton || disableSkipButton}
                        onClick={handleSkipPuzzle}
                    >
                        <PiSkipForwardFill className="inline mr-2" />
                        Skip
                    </button>

                    <button
                        className="w-1/3 h-full flex items-center justify-center bg-club-light text-club-dark rounded-tr-2xl disabled:opacity-40 active:scale-95 transition font-semibold"
                        onClick={handleNextPuzzle}
                        disabled={!showNextButton}
                    >
                        <GrFormNextLink className="inline mr-2" />
                        Next
                    </button>
                </div>
            </div>
            {/* Transparent overlay for points gained */}
            {showNextButton && (
                <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
                    <div className="bg-transparent animate-fade-in">
                        <span
                            className="
                                text-club-primary
                                text-6xl md:text-7xl lg:text-8xl
                                font-extrabold
                                drop-shadow-lg
                                animate-pulse
                                transform
                                scale-110
                            "
                        >
                            +{currentPoints}
                        </span>
                    </div>
                </div>
            )}

        </div>

    );
}

export default PuzzleMarathon;