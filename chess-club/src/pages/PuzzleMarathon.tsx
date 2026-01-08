import { getActiveClient } from "../utils/getActiveClient";
import type { PuzzleBankTypes } from "../types/puzzleBankTypes";
import { useEffect, useState, useRef } from "react";
import ChessBoard from "../components/ChessBoard";
import { FaLightbulb } from "react-icons/fa";
import { TbPuzzle2 } from "react-icons/tb";
import { GrFormNextLink } from "react-icons/gr";
import { PiSkipForwardFill } from "react-icons/pi";
import { FaRegSquareFull } from "react-icons/fa6";

import { useUser } from "../hooks/useUser";

import ChessLoading from "../components/ChessboardComps/ChessLoading";

import {
    initPuzzleEngineFen,
    tryPuzzleMove,
    makeFirstComputerMove,
    type PuzzleEngine,
} from "../utils/puzzleEngine";

import type { PuzzleMarathonTypes } from "../types/puzzleMarathonTypes";
import {
    getMarathonPuzzleStats,
    incrementMarathonLevel,
    updateMarathonPoints,
    incrementMarathonPuzzleCount
} from "../utils/updateMarathonPuzzleStats";

import { useNavigate } from "react-router-dom";
import { toastError } from "../utils/toastUtils";

function PuzzleMarathon() {

    // global loading state and puzzle fetching loading state
    const [loading, setLoading] = useState(true);
    const [puzzleLoading, setPuzzleLoading] = useState(false);

    // get authenticated user or redirect if not logged in
    const { user, loading: userLoading } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user && !userLoading) {
            navigate("/login");
            toastError("Please log in to access the Puzzle Marathon.");
        }
    }, [user, userLoading]);

    // user marathon stats from database and dynamically tracked earned points
    const [marathonStats, setMarathonStats] = useState<PuzzleMarathonTypes | null>(null);
    const [currentPoints, setCurrentPoints] = useState(40);

    // timer state for every puzzle
    const [time, setTime] = useState(0);

    // puzzle list storage and current puzzle index tracker
    const [puzzles, setPuzzles] = useState<PuzzleBankTypes[]>([]);
    const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);

    // game ui feedback state and puzzle flow button states
    const [message, setMessage] = useState<string | null>(null);
    const [showNextButton, setShowNextButton] = useState(false);
    const [disableSkipButton, setDisableSkipButton] = useState(false);

    // dynamic feedback messages for different puzzle results
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

    // board orientation puzzle fen and rating state
    const [boardOrientation, setBoardOrientation] = useState<"white" | "black">("white");
    const [fen, setFen] = useState<string>("start");
    const [rating, setRating] = useState<number | null>(null);

    // chess puzzle engine reference instance
    const engineRef = useRef<PuzzleEngine | null>(null);

    // supabase rpc fetches random puzzles and prevents duplicates
    async function fetchPuzzles() {
        const supabaseClient = await getActiveClient();
        if (puzzles.length === 0) {
            setPuzzleLoading(true);
        }

        const { data, error } = await supabaseClient
            .rpc("get_random_puzzles_timestamp");

        if (error) {
            console.error("Failed to fetch puzzles:", error);
            return;
        }

        if (data) {
            const existingPuzzles = puzzles.map(p => p.id);
            const newPuzzles = (data as PuzzleBankTypes[]).filter(p => !existingPuzzles.includes(p.id));
            setPuzzles(prevPuzzles => [...prevPuzzles, ...newPuzzles]);
            console.log("Fetched puzzles:", data);
            setDisableSkipButton(false);
        }
    }

    // initial puzzle fetch when page loads
    useEffect(() => {
        if (puzzles.length > 0) return;

        fetchPuzzles();
    }, []);

    // fetch user marathon stats when user becomes available
    useEffect(() => {
        if (!user) return;

        // Fetch marathon stats
        getMarathonPuzzleStats(user.id)
            .then((stats) => {
                setMarathonStats(stats);
                console.log("Marathon stats:", stats);
            })
            .catch((error) => {
                console.error("Error fetching marathon stats:", error);
            });
    }, [user]);

    // global loading turns off only when user and puzzles are ready
    useEffect(() => {
        if (user && puzzles.length > 0 && !puzzleLoading) {
            setLoading(false);
        }
    }, [user, puzzles, puzzleLoading]);

    // automatically fetch more puzzles when nearing end and disable skip button
    useEffect(() => {
        if (puzzles.length === 0) return;
        // If we are on just before the last puzzle, fetch more puzzles
        console.log("Current puzzle index:", currentPuzzleIndex, "Total puzzles:", puzzles.length);
        if (currentPuzzleIndex === puzzles.length - 2) {
            fetchPuzzles();
            setDisableSkipButton(true);
            console.log('Disbaled skip button set to true while fetching puzzles.' + disableSkipButton);
        }

    }, [currentPuzzleIndex, puzzles]);

    // increments timer every second and resets when puzzle changes
    useEffect(() => {
        const timer = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [time]);

    // handles user move validates with engine updates board feedback and scoring
    function handleMove(from: string, to: string): boolean {
        console.log(`Move from ${from} to ${to}`);

        if (!engineRef.current) return false;
        if (from === to) return false;

        const result = tryPuzzleMove(engineRef.current, from, to);
        console.log("Move result:", result);

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
            setCurrentPoints((prevPoints) => Math.max(prevPoints - 5, 0));
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
                            console.log("Marathon level incremented in the database.");
                        })
                        .catch((error) => {
                            console.error("Error incrementing marathon level:", error);
                        });
                }

                // Always update points in DB 
                if (user) {
                    updateMarathonPoints(user.id, levelPoints)
                        .then(() => {
                            console.log("Marathon points updated in the database.");
                        })
                        .catch((error) => {
                            console.error("Error updating marathon points:", error);
                        });
                    // Increment total puzzles solved
                    incrementMarathonPuzzleCount(user.id)
                        .then(() => {
                            console.log("Marathon puzzle count incremented in the database.");
                        })
                        .catch((error) => {
                            console.error("Error incrementing marathon puzzle count:", error);
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

                console.log("Total Points:", totalPoints, "New Level:", newLevel, "Level Points:", levelPoints);
            }, 1000);
        }
        return true; // Return true if the move is valid, false otherwise
    }

    // initializes puzzle engine whenever puzzle index changes and plays first move
    useEffect(() => {
        if (puzzles.length === 0) return;

        const currentPuzzle = puzzles[currentPuzzleIndex];
        setRating(currentPuzzle.rating);
        console.log("Initializing puzzle index:", currentPuzzleIndex, "with rating:", currentPuzzle.rating);

        // Split moves safely (handles extra spaces)
        const movesArray = currentPuzzle.moves
            .trim()
            .split(/\s+/);

        if (movesArray.length === 0) return;

        // Init engine with remaining moves AFTER first one
        engineRef.current = initPuzzleEngineFen(currentPuzzle.fen, movesArray.slice(1));
        setBoardOrientation(engineRef.current.chess.turn() === "w" ? "white" : "black");

        // Show initial puzzle position
        setFen(currentPuzzle.fen);
        setPuzzleLoading(false);

        //disbale next button
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

    // moves to next puzzle resets timer message and rating
    function handleNextPuzzle() {
        setCurrentPuzzleIndex((prevIndex) => prevIndex + 1);
        setTime(0);
        setMessage(null);
        setRating(puzzles[currentPuzzleIndex].rating);
        console.log("Moved to next puzzle. New rating:", puzzles[currentPuzzleIndex].rating);
    }

    function handleSkipPuzzle() {
        setCurrentPuzzleIndex((prevIndex) => prevIndex + 1);
        setTime(0);
    };
    // show fullscreen loader while initializing or fetching
    if (loading || puzzleLoading || userLoading) {
        return (<div className="fixed inset-0 flex items-center justify-center bg-club-primary">
            <ChessLoading />
        </div>);
    }
    // fullscreen locked puzzle marathon layout
    return (
        <div className="fixed inset-0 z-30 flex flex-col items-center justify-start overflow-hidden mt-20 px-3 py-3 bg-club-primary border-t">
            <div className="z-30 w-full max-w-sm flex flex-col items-center justify-center mb-4 mt-2">
                <TbPuzzle2 className="text-white text-4xl mb-1" />
                <h1 className="text-2xl font-bold text-white">Puzzle Marathon</h1>
                <p className="text-[11px] text-gray-200 opacity-80 tracking-wide mt-1">
                    Sharpen your mind. Enjoy the challenge.
                </p>
            </div>
            <div className="w-full max-w-sm bg-club-light rounded-2xl shadow-xl p-4 mb-3">
                <ChessBoard fen={fen} onMove={handleMove} boardOrientation={boardOrientation} />
            </div>
            <div className="w-full max-w-sm bg-club-light rounded-2xl shadow-lg p-4 mb-3 space-y-3">
                <div className="grid grid-cols-3 w-full text-sm font-medium">
                    <p className="text-left font-medium text-gray-700">
                        Total Points : {marathonStats ? marathonStats.points : "N/A"}
                    </p>

                    <p className="text-center text-sm font-bold text-gray-700 flex items-center justify-center">
                        {Math.floor(time / 60)}:{time % 60 < 10 ? `0${time % 60}` : time % 60}
                    </p>

                    <p className="text-right font-medium text-gray-700">
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
                    <p className="text-center text-gray-700 font-bold w-16">Lv {marathonStats ? marathonStats.level : "N/A"}</p>
                </div>
            </div>
            <div className=" flex flex-row justify-between w-full max-w-sm bg-club-light rounded-2xl shadow-lg p-4 mb-3">
                <p className="text-sm font-medium text-gray-700 flex items-center gap-2">

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

            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl rounded-t-2xl h-20 flex justify-center items-center w-full">
                <div className="flex w-full h-full overflow-hidden rounded-t-2xl">
                    <button
                        className="w-1/3 h-full flex items-center justify-center bg-club-light text-club-dark border-r rounded-tl-2xl font-semibold active:scale-95 transition"
                        disabled={showNextButton}
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
        </div>
    );
}

export default PuzzleMarathon;