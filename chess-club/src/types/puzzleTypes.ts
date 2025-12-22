/* ================= GAME TYPES ================= */

export interface GamePlayer {
    name: string;
    id: string;
    color: "white" | "black";
    rating: number;
}

export interface GamePerf {
    key: string;
    name: string;
}

export interface Game {
    id: string;
    perf: GamePerf;
    rated: boolean;
    players: GamePlayer[];
    pgn: string;
    clock?: string;
}

/* ================= PUZZLE TYPES ================= */

export type PuzzleTheme =
    | "veryLong"
    | "endgame"
    | "mateIn4"
    | "backRankMate"
    | string;

export interface Puzzle {
    id: string;
    rating: number;
    plays: number;
    initialPly: number;
    solution: string[];
    themes: PuzzleTheme[];
}

/* ================= API RESPONSE ================= */

export interface DailyPuzzle {
    game: Game;
    puzzle: Puzzle;
}