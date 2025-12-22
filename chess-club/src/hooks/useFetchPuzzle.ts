import { useState, useEffect } from "react";
import { type DailyPuzzle } from "../types/puzzleTypes";

function useFetchPuzzle() {
    const url = "https://lichess.org/api/puzzle/daily";

    const [puzzle, setPuzzle] = useState<DailyPuzzle | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];

        // Safe localStorage access
        const cachedPuzzle = localStorage.getItem("dailyPuzzle");
        const cachedDate = localStorage.getItem("dailyPuzzleDate");

        if (cachedPuzzle && cachedDate === today) {
            setPuzzle(JSON.parse(cachedPuzzle));
            setLoading(false);
            return;
        } else if (cachedDate !== today) {
            // Clear outdated cache
            localStorage.removeItem("dailyPuzzle");
            localStorage.removeItem("dailyPuzzleDate");
        }

        const fetchPuzzle = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();

                // Cache it
                localStorage.setItem("dailyPuzzle", JSON.stringify(data));
                localStorage.setItem("dailyPuzzleDate", today);

                setPuzzle(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPuzzle();
    }, [url]);

    return { puzzle, loading, error };
}

export default useFetchPuzzle;