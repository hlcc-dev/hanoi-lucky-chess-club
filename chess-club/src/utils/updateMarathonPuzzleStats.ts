import { getActiveClient } from "./getActiveClient";
import type { PuzzleMarathonTypes } from "../types/puzzleMarathonTypes";

/**
 * Get user marathon stats (RPC)
 */
export async function getMarathonPuzzleStats(userId: string): Promise<PuzzleMarathonTypes> {
    const client = await getActiveClient();

    const { data, error } = await client.rpc("get_marathon_stats", {
        uid: userId,
    });

    if (error || !data) {
        console.error("get_marathon_stats error:", error);
        throw new Error("Could not fetch marathon puzzle stats");
    }

    return data as PuzzleMarathonTypes;
}

/**
 * Increment puzzle count (RPC)
 */
export async function incrementMarathonPuzzleCount(userId: string): Promise<boolean> {
    const client = await getActiveClient();

    const { error } = await client.rpc("increment_marathon_puzzles", {
        uid: userId,
    });

    if (error) {
        console.error("increment_marathon_puzzles error:", error);
        throw new Error("Could not increment marathon puzzle count");
    }

    return true;
}

/**
 * Increment level (RPC)
 */
export async function incrementMarathonLevel(userId: string): Promise<boolean> {
    const client = await getActiveClient();

    const { error } = await client.rpc("increment_marathon_level", {
        uid: userId,
    });

    if (error) {
        console.error("increment_marathon_level error:", error);
        throw new Error("Could not increment marathon level");
    }

    return true;
}

/**
 * Update points (RPC)
 */
export async function updateMarathonPoints(userId: string, newPoints: number): Promise<boolean> {
    const client = await getActiveClient();

    const { error } = await client.rpc("update_marathon_points", {
        uid: userId,
        new_points: newPoints,
    });

    if (error) {
        console.error("update_marathon_points error:", error);
        throw new Error("Could not update marathon points");
    }

    return true;
}