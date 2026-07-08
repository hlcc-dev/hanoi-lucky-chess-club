import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ChessLoadingProps {
    text?: string;
}

function ChessLoading({ text }: ChessLoadingProps) {
    const { t } = useTranslation("puzzles");
    const resolvedText = text ?? t("loadingDefault");
    // lets add ... to the text every half second to show loading progress
    const [displayText, setDisplayText] = useState(resolvedText);

    useEffect(() => {
        let dotCount = 0;
        const interval = setInterval(() => {
            dotCount = (dotCount + 1) % 4;
            setDisplayText(resolvedText + ".".repeat(dotCount));
        }, 500);

        return () => clearInterval(interval);
    }, [resolvedText]);
    return (
        <div className="flex  items-center justify-center h-full w-full">
            <style>{`
                @keyframes tileWave {
                    0% { transform: scale(1); opacity: 0.6; }
                    40% { transform: scale(1.15); opacity: 1; }
                    80% { transform: scale(1); opacity: 0.6; }
                    100% { transform: scale(1); opacity: 0.6; }
                }
            `}</style>

            <div className="flex flex-col items-center gap-6">
                {/* Animated chessboard skeleton */}
                <div className="grid grid-cols-4 gap-1">
                    {Array.from({ length: 16 }).map((_, i) => (
                        <div
                            key={i}
                            className={`
                                w-12 h-12 rounded-sm
                                ${(i + Math.floor(i / 4)) % 2 === 0
                                    ? "bg-gray-800"
                                    : "bg-gray-300"}
                            `}
                            style={{
                                animation: "tileWave 1.6s infinite",
                                animationDelay: `${(i % 4) * 0.2 + Math.floor(i / 4) * 0.1}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Loading text */}
                <p className="text-xl text-club-dark tracking-wide">
                    {displayText}
                </p>
            </div>
        </div>
    );
}

export default ChessLoading;