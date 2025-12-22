import { useEffect, useState } from "react";

const TIMER_KEY = "daily-puzzle-timer";

export function usePuzzleTimer(resetKey: number) {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        let start: number;

        const stored = localStorage.getItem(TIMER_KEY);

        if (stored) {
            start = JSON.parse(stored).start;
        } else {
            start = Date.now();
            localStorage.setItem(TIMER_KEY, JSON.stringify({ start }));
        }

        const interval = setInterval(() => {
            setElapsed(Math.floor((Date.now() - start) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [resetKey]);

    function resetTimer() {
        const start = Date.now();
        localStorage.setItem(TIMER_KEY, JSON.stringify({ start }));
        setElapsed(0);
    }

    return { elapsed, resetTimer };
}