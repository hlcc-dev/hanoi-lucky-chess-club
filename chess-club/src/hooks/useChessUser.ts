import axios from "axios"
import { useRef, useState } from "react"
import { toastError } from "../utils/toastUtils"
import type { ChessStats } from "../types/chessStatsTypes"
import type { ChessUser } from "../types/chessUserTypes"
type Status = "idle" | "loading" | "success" | "error"

export function useChessUser() {
    const [status, setStatus] = useState<Status>("idle")
    const [profile, setProfile] = useState<any>(null)
    const [stats, setStats] = useState<any>(null)
    const controllerRef = useRef<AbortController | null>(null)

    const reset = () => {
        controllerRef.current?.abort()
        setStatus("idle")
        setProfile(null)
        setStats(null)
    }

    const checkUser = async (username: string) => {
        if (!username) {
            toastError("Please enter a Chess.com username.")
            return
        }


        // Cancel previous request
        controllerRef.current?.abort()
        controllerRef.current = new AbortController()

        setStatus("loading")

        try {
            const profileRes = await axios.get<ChessUser>(
                `https://api.chess.com/pub/player/${username}`,
                { signal: controllerRef.current.signal }
            )

            const statsRes = await axios.get<ChessStats>(
                `https://api.chess.com/pub/player/${username}/stats`,
                { signal: controllerRef.current.signal }
            )

            setProfile(profileRes.data)
            setStats(statsRes.data)
            setStatus("success")
        } catch (err: any) {
            if (axios.isCancel(err)) return

            if (err.response?.status === 404) {
                setStatus("error")
                toastError("Chess.com user not found. Please check the username.")
            } else {
                setStatus("error")
                toastError("An error occurred while fetching Chess.com data.")
            }
        }
    }

    return {
        status,
        profile,
        stats,
        checkUser,
        reset,
    }
}