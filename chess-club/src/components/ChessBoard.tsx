import { useMemo, useState } from "react";
import { Chessboard, type PieceDropHandlerArgs } from "react-chessboard";
import { Chess } from "chess.js";
import { FaChessQueen, FaChessRook, FaChessBishop, FaChessKnight } from "react-icons/fa";

interface ChessBoardProps {
    fen?: string;
    onMove: (from: string, to: string, promotion?: string) => boolean;
    boardOrientation?: "white" | "black";
    movesEnabled?: boolean;
}

function isValidFen(fen: string) {
    try {
        new Chess(fen);
        return true;
    } catch {
        return false;
    }
}

function ChessBoard({ fen, onMove, boardOrientation, movesEnabled = true }: ChessBoardProps) {
    const [pendingMove, setPendingMove] = useState<{ from: string; to: string } | null>(null);
    const [showPromotionModal, setShowPromotionModal] = useState(false);

    const isPromotionMove = (from: string, to: string) => {
        const game = new Chess(fen);
        const piece = game.get(from as any);

        // must exist and must be a pawn
        if (!piece || piece.type !== "p") return false;

        const toRank = parseInt(to[1]);

        // white pawn promotes on rank 8
        if (piece.color === "w" && toRank === 8) return true;

        // black pawn promotes on rank 1
        if (piece.color === "b" && toRank === 1) return true;

        return false;
    };

    const handlePromotionSelect = (piece: string) => {
        if (!pendingMove) return;

        onMove(pendingMove.from, pendingMove.to, piece);
        setPendingMove(null);
        setShowPromotionModal(false);
    };

    if (!fen || !isValidFen(fen)) {
        return null;
    }

    const options = useMemo(() => ({
        position: fen,

        onPieceDrop: ({ sourceSquare, targetSquare }: PieceDropHandlerArgs) => {
            if (!targetSquare) return false;

            if (isPromotionMove(sourceSquare, targetSquare)) {
                setPendingMove({ from: sourceSquare, to: targetSquare });
                setShowPromotionModal(true);
                return false;
            }

            return onMove(sourceSquare, targetSquare);
        },

        boardStyle: {
            borderRadius: "6px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.5)",
        },

        animationDuration: 1000,
        allowDragging: movesEnabled,
        boardOrientation: boardOrientation ?? "white",
        allowDrawingArrows: true,
        animationDurationInMs: 400,
        clearArrowsOnPositionChange: true,
        clearHighlightsOnMove: true,
        customDarkSquareStyle: {
            backgroundColor: "#000000",
        },
        customLightSquareStyle: {
            backgroundColor: "#EBD5AB",
        },
    }), [fen, onMove, boardOrientation]);

    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Chessboard options={options} />

            {showPromotionModal && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.4)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        paddingTop: "40px",
                        zIndex: 20,
                    }}
                >
                    <div
                        style={{
                            background: "#ffffff",
                            padding: "16px 22px",
                            borderRadius: "10px",
                            textAlign: "center",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                            border: "2px solid black",
                        }}
                    >

                        <div style={{ display: "flex", gap: "12px" }}>
                            <button
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "6px",
                                    border: "2px solid black",
                                    cursor: "pointer",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "32px",
                                    background: "#EBD5AB",
                                }}
                                onClick={() => handlePromotionSelect("q")}
                            >
                                <FaChessQueen />
                            </button>

                            <button
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "6px",
                                    border: "2px solid black",
                                    cursor: "pointer",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "32px",
                                    background: "#B28A65",
                                    color: "white",
                                }}
                                onClick={() => handlePromotionSelect("r")}
                            >
                                <FaChessRook />
                            </button>

                            <button
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "6px",
                                    border: "2px solid black",
                                    cursor: "pointer",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "32px",
                                    background: "#EBD5AB",
                                }}
                                onClick={() => handlePromotionSelect("b")}
                            >
                                <FaChessBishop />
                            </button>

                            <button
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "6px",
                                    border: "2px solid black",
                                    cursor: "pointer",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "32px",
                                    background: "#B28A65",
                                    color: "white",
                                }}
                                onClick={() => handlePromotionSelect("n")}
                            >
                                <FaChessKnight />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChessBoard;