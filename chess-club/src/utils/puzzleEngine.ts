import { Chess, type Move } from "chess.js";

/* ================= TYPES ================= */

/**
 * PuzzleEngine interface represents the state of the puzzle.
 * It keeps track of the chess instance, the solution moves,
 * the current position in the solution, and the last move made by the opponent.
 * This allows the engine to validate user moves against the solution sequence.
 */
export interface PuzzleEngine {
    chess: Chess;
    solution: string[]; // UCI moves like ["f7h7", "g5g6", ...]
    index: number;
    lastMove: {
        from: string;
        to: string;
        promotion?: string;
    };

}

export interface PuzzleEngineFen {
    chess: Chess;
    solution: string[]; // UCI moves like ["f7h7", "g5g6", ...]
    index: number;
    lastMove: {
        from: string;
        to: string;
        promotion?: string;
    };

}

/* ================= INIT ENGINE ================= */

/**
 * Initialize puzzle engine
 * @param fullPgn - full game PGN from Lichess
 * @param solution - lichess solution array (UCI)
 *
 * This function sets up the puzzle engine by:
 * 1) Creating a new chess instance.
 * 2) Loading the full game PGN to reach the final position.
 * 3) Extracting the opponent's last move from the game history.
 *    This move is saved separately as `lastMove` to keep track of the position before the user's move.
 * 4) Undoing the last move to revert the board to the position before the opponent's last move,
 *    so the user can attempt the puzzle from that point.
 * 5) Returning the initialized engine object with the chess instance,
 *    solution moves, current index, and last move info.
 */
export function initPuzzleEngine(
    fullPgn: string,
    solution: string[]
): PuzzleEngine {
    const chess = new Chess();

    // Load full game
    try {
        chess.loadPgn(fullPgn);
    } catch {
        throw new Error("Invalid PGN");
    }

    //learn the board orientation


    // Get opponent's last move safely
    const history = chess.history({ verbose: true }) as Move[];
    const lastMove = history.at(-1);

    if (!lastMove) {
        throw new Error("No last move found in PGN");
    }

    // Go back to position BEFORE the mistake
    chess.undo();

    return {
        chess,
        solution,
        index: 0,
        lastMove: {
            from: lastMove.from,
            to: lastMove.to,
            promotion: lastMove.promotion,
        },
    };
}

export function initPuzzleEngineFen(
    fen: string,
    solution: string[]
): PuzzleEngineFen {
    const chess = new Chess();

    chess.load(fen);
    return {
        chess,
        solution,
        index: 0,
        lastMove: {
            from: "",
            to: "",
        },
    };
}


export function makeFirstComputerMove(
    engine: PuzzleEngine,
    from: string,
    to: string,
    promotion?: string
): {
    ok: boolean;
    fen: string;
} {
    let move;
    try {
        // Try to apply the move ONCE
        move = engine.chess.move({
            from,
            to,
            ...(to[1] === "8" || to[1] === "1" ? { promotion: promotion || 'q' } : {}),
        });
    } catch {
        throw new Error("Invalid first move");
    }

    // Illegal move (wrong color, illegal square, wrong turn, etc.)
    if (!move) {
        throw new Error("Invalid first move");
    }
    return {
        ok: true,
        fen: engine.chess.fen(),
    };
}
// Load full game

/* ================= TRY USER MOVE ================= */

/**
 * Apply a user move.
 * - checks correctness against solution
 * - applies user move
 * - auto-plays opponent reply if exists
 *
 * This function attempts to apply the user's move and validates it as follows:
 * 1) Tries to apply the move on the chess instance.
 *    - If the move is illegal (e.g. invalid squares, wrong turn), chess.js throws or returns null.
 *    - Illegal moves are silently ignored to avoid interrupting user input flow.
 * 2) If the move is illegal, return ok: false without changing the board.
 * 3) If the move is legal, compare it to the expected solution move at the current index.
 * 4) If the move does not match the expected solution move:
 *    - Undo the move to revert the board to the previous state.
 *    - Return ok: false and wrong: true to indicate a wrong move.
 *    - Undo is required here to maintain the puzzle state consistent and allow retry.
 * 5) If the move matches the solution:
 *    - Increment the solution index.
 *    - If there is an opponent reply move, apply it automatically and increment the index again.
 * 6) Return ok: true and updated FEN, indicating success.
 * 7) Indicate if the puzzle is finished when all solution moves have been played.
 */
export function tryPuzzleMove(
    engine: PuzzleEngine,
    from: string,
    to: string,
    promotion?: string | 'q',
): {
    ok: boolean;
    wrong?: boolean;
    fen: string;
    finished: boolean;
    pendingOpponentMove?: { from: string; to: string; promotion?: string } | null;
    wrongMove?: { from: string; to: string, promotion?: string } | null;
    previewFen?: string;
} {
    let move;
    try {
        // Try to apply the move ONCE
        move = engine.chess.move({
            from,
            to,
            ...(to[1] === "8" || to[1] === "1" ? { promotion: promotion ?? "q" } : {}),
        });
    } catch {
        // chess.js threw -> illegal input (ignore silently)
        // Illegal moves are ignored to avoid disrupting user input flow,
        // allowing the user to try another move without penalty.
        return {
            ok: false,
            fen: engine.chess.fen(),
            finished: false,
        };
    }

    // Illegal move (wrong color, illegal square, wrong turn, etc.)
    if (!move) {
        return {
            ok: false,
            fen: engine.chess.fen(),
            finished: false,
        };
    }


    // Validate against expected solution move (UCI)
    const expected = engine.solution[engine.index];
    if (!expected) {
        return {
            ok: false,
            fen: engine.chess.fen(),
            finished: true,
        };
    }

    const expFrom = expected.slice(0, 2);
    const expTo = expected.slice(2, 4);
    let expPromotion: string | undefined = undefined;
    if (expected.length > 4) {
        expPromotion = expected[4];
    }

    if (from !== expFrom || to !== expTo || promotion !== expPromotion) {
        // Capture board AFTER the wrong (but legal) move
        const previewFen = engine.chess.fen();

        // Revert the move so puzzle state remains correct
        engine.chess.undo();

        return {
            ok: false,
            wrong: true,
            previewFen,
            fen: engine.chess.fen(),
            finished: false,
            wrongMove: {
                from,
                to,
                ...(to[1] === "8" || to[1] === "1" ? { promotion: "q" } : {}),
            },
        };
    }

    // Correct user move
    engine.index++;

    // Prepare opponent reply if it exists,
    // but DO NOT apply it yet.
    // React will decide WHEN to play it (for animation / delay).
    let pendingOpponentMove: { from: string; to: string; promotion?: string } | null = null;

    if (engine.index < engine.solution.length) {
        const opp = engine.solution[engine.index];

        pendingOpponentMove = {
            from: opp.slice(0, 2),
            to: opp.slice(2, 4),
            promotion: "q",
        };

        // Advance solution index,
        // but leave the move unplayed for now.
        engine.index++;
    }

    return {
        ok: true,
        fen: engine.chess.fen(),
        finished: engine.index >= engine.solution.length,
        pendingOpponentMove,
    };
}