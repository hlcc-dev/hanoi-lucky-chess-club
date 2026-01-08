export interface PuzzleBankTypes {
    id: number;
    puzzle_id: string;
    fen: string;
    moves: string;
    rating: number;
    rating_deviation: number;
    popularity: number;
    nb_plays: number;
    themes: string;
    opening_tags: string;
}