/* ---------- Common ---------- */

export interface ChessRating {
    rating: number
    date: number
    rd?: number
    game?: string
}

export interface ChessRecord {
    win: number
    loss: number
    draw: number
}

/* ---------- Profile ---------- */

export interface ChessStreamingPlatform {
    type: string
    channel_url: string
}
/* ---------- Game Modes ---------- */

export interface ChessGameMode {
    last: ChessRating
    best: ChessRating
    record: ChessRecord
}

/* ---------- Extra Stats ---------- */

export interface ChessPuzzleRush {
    best: {
        total_attempts: number
        score: number
    }
}

export interface ChessTactics {
    highest: {
        rating: number
        date: number
    }
    lowest: {
        rating: number
        date: number
    }
}

/* ---------- Full Stats ---------- */

export interface ChessStats {
    chess_blitz?: ChessGameMode
    chess_bullet?: ChessGameMode
    chess_rapid?: ChessGameMode
    chess_daily?: ChessGameMode
    chess960_daily?: ChessGameMode

    fide?: number

    puzzle_rush?: ChessPuzzleRush
    tactics?: ChessTactics
}