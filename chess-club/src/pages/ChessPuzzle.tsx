import { useEffect, useRef, useState } from "react";
import ChessBoard from "../components/ChessBoard";
import fetchDailyPuzzle from "../hooks/useFetchPuzzle";
import {
    initPuzzleEngine,
    tryPuzzleMove,
    type PuzzleEngine,
} from "../utils/puzzleEngine";

function ChessPuzzle() {
    /*
      1. Fetch the daily puzzle data.
         This includes:
         - full game PGN
         - puzzle solution moves
         - loading and error states
    */
    const { puzzle, loading, error } = fetchDailyPuzzle();

    /*
      2. Store the puzzle engine in a ref.
         - useRef is used so the engine persists across renders
         - changing engine state should NOT trigger re-renders
    */
    const engineRef = useRef<PuzzleEngine | null>(null);

    /*
      3. FEN string that controls the board position.
         Whenever this state changes, the chessboard updates.
    */
    const [fen, setFen] = useState("");

    /*
      4. Board orientation is visual only.
         "white" means white pieces are at the bottom.
         "black" means black pieces are at the bottom.
    */
    const [boardOrientation, setBoardOrientation] =
        useState<"white" | "black">("white");

    /* ================= INITIALIZE PUZZLE ENGINE ================= */

    useEffect(() => {
        /*
          5. Do nothing until puzzle data is available.
        */
        if (!puzzle) return;

        /*
          6. Initialize the puzzle engine.
             Inside initPuzzleEngine:
             - the full PGN is loaded
             - the opponent’s last move is extracted and saved
             - that last move is undone
             After this call, the engine is positioned
             BEFORE the opponent’s blunder.
        */
        engineRef.current = initPuzzleEngine(
            puzzle.game.pgn,
            puzzle.puzzle.solution
        );

        /*
          7. Get the FEN of the position BEFORE the last move.
             This is the position we want to show first.
        */
        const fenBeforeLastMove = engineRef.current.chess.fen();

        /*
          8. Render that position on the board.
        */
        setFen(fenBeforeLastMove);

        /*
          9. Determine whose turn it is.
             chess.turn() returns:
             - "w" if white is to move
             - "b" if black is to move

             The board is oriented so the side to move
             is visually at the bottom.
        */
        const turn = engineRef.current.chess.turn();
        setBoardOrientation(turn === "w" ? "black" : "white");

        /*
          10. Apply the opponent’s last move after a delay.
              This delay exists purely for visual clarity,
              so the user can see the blunder happen.
        */
        const timer = setTimeout(() => {
            if (!engineRef.current) return;

            /*
              11. The opponent’s last move was stored
                  inside the puzzle engine during initialization.
            */
            const { from, to, promotion } = engineRef.current.lastMove;

            /*
              12. Apply the opponent’s blunder move.
            */
            engineRef.current.chess.move({
                from,
                to,
                promotion: promotion ?? "q",
            });

            /*
              13. Update the board to reflect the move.
            */
            setFen(engineRef.current.chess.fen());
        }, 1000);

        /*
          14. Cleanup:
              If the component unmounts or the puzzle changes,
              cancel the delayed move to avoid side effects.
        */
        return () => clearTimeout(timer);

    }, [puzzle]);

    /* ================= HANDLE USER MOVE ================= */

    const handleMove = (from: string, to: string) => {
        /*
          15. If the puzzle engine is not initialized,
              ignore all moves.
        */
        if (!engineRef.current) return false;

        /*
          16. If a piece is dropped onto the same square,
              ignore the action silently.
        */
        if (from === to) {
            return false;
        }

        /*
          17. Delegate move validation to the puzzle engine.
              The engine will decide whether the move is:
              - illegal
              - legal but wrong for the puzzle
              - correct
        */
        const result = tryPuzzleMove(engineRef.current, from, to);

        /*
          18. Case: Illegal chess move.
              Examples:
              - wrong turn
              - illegal square
              - invalid piece movement

              The move is ignored silently.
        */
        if (!result.ok && !result.wrong) {
            return false;
        }

        /*
          19. Case: Legal chess move but WRONG puzzle move.
              The engine has already undone the move.
              Here we only notify the user.
        */
        if (result.wrong) {
            alert("Wrong move, try again");
            return false;
        }

        /*
          20. Case: Correct puzzle move.
              Update the board position.
        */
        setFen(result.fen);

        /*
          21. If there are no more solution moves,
              the puzzle is solved.
        */
        if (result.finished) {
            alert("Puzzle solved");
        }

        return true;
    };

    /* ================= RENDER ================= */

    /*
      22. Show loading state while fetching puzzle.
    */
    if (loading) return <div>Loading</div>;

    /*
      23. Show error state if fetch fails.
    */
    if (error) return <div>Error: {error}</div>;

    /*
      24. Safety check: do not render the board
          until a valid FEN exists.
    */
    if (!fen) return null;

    return (
        <div className="grow">
            {/* 
              25. Center the chessboard horizontally
                  and limit its maximum width.
            */}
            <div className="w-full max-w-md justify-center items-center mx-auto my-8">
                <ChessBoard
                    fen={fen}
                    onMove={handleMove}
                    boardOrientation={boardOrientation}
                />
            </div>
        </div>
    );
}

export default ChessPuzzle;