import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Input from '../components/Input';
import ButtonPrimary from '../components/Button/ButtonPrimary';
import { useUser } from "../hooks/useUser";
import { useChangeUsername } from '../hooks/useChangeUsername';
import type { ChessStats } from "../hooks/useUser";
import ChessLoading from '../components/ChessboardComps/ChessLoading';
import { checkUsernameAvailable } from '../utils/checkUsernameAvailable';
import { toastError, toastSuccess } from '../utils/toastUtils';
import { useChessUser } from '../hooks/useChessUser';
import updateChessStats from "../utils/UpdateChessStats";
import { FaEnvelope, FaUser } from 'react-icons/fa';
import { FaChessBoard } from "react-icons/fa6";

function Settings() {
    const navigate = useNavigate();
    const user = useUser();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const chessStats = useRef<ChessStats>(user.chessStats);
    const [chessUsername, setChessUsername] = useState("");
    useEffect(() => {
        if (!user.loading && user.profile && user.user) {
            setUsername(user.profile.username ?? '');
            setEmail(user.user.email ?? '');
            chessStats.current = user.chessStats;
            setChessUsername(user.chessStats?.chess_com_name ?? '');
        }
    }, [user.loading]);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
    const [checkingUsername, setCheckingUsername] = useState(false);
    const [usernameChanged, setUsernameChanged] = useState<boolean>(false);
    useEffect(() => {
        if (username !== (user.profile?.username ?? '')) {
            setIsUsernameAvailable(null);
        }
    }, [username]);
    const { changeUsername } = useChangeUsername();

    const { status, profile, stats, checkUser } = useChessUser();


    if (user.loading) {
        return (
            <div className='flex w-full grow flex-1 items-center justify-center py-10'>
                <ChessLoading
                    text="Loading user data" />
            </div>
        );
    }

    if (!user.user || !user.profile) {
        navigate("/login");
        toastError("Please log in to access settings.");
        return null;
    }
    return (
        <div
            className="
                min-h-screen
                w-full
                flex
                justify-center
                items-center
                bg-club-primary/20

                overflow-y-auto

                /* Hide scrollbar (mobile + tablet) */
                scrollbar-width-none
                [&::-webkit-scrollbar]:hidden

                /* Bring scrollbar back on large screens */
                lg:scrollbar-auto
                lg:[&::-webkit-scrollbar]:block
            "
        >
            <div
                className="
                    w-full
                    max-w-3xl

                    bg-linear-to-b
                    from-club-light
                    to-white/80

                    border
                    border-black/20

                    px-4
                    py-2

                    space-y-6

                    sm:px-6
                    sm:py-4
                    sm:space-y-8

                    md:rounded-4xl
                    md:shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                    md:backdrop-blur-xl
                    md:pb-10
                    md:my-5
                "
            >
                <h1
                    className="
                        text-xl
                        sm:text-5xl
                        font-extrabold
                        text-center
                        tracking-wide
                        drop-shadow-lg
                        text-club-primary
                    "
                >
                    Settings
                </h1>

                <div
                    className="
                        bg-white/80
                        rounded-3xl
                        border-2
                        border-black/20
                        shadow-xl

                        p-4
                        sm:p-8

                        space-y-4
                        sm:space-y-8
                    "
                >
                    <h2
                        className="
                            text-lg
                            sm:text-2xl
                            font-extrabold
                            text-center
                            text-club-primary
                        "
                    >
                        Profile
                    </h2>

                    <div
                        className="
                            flex
                            flex-col
                            sm:flex-row
                            w-full
                            items-start
                            sm:items-center
                            justify-between
                            gap-1
                            sm:gap-3
                        "
                    >
                        <label className="block text-sm font-semibold text-gray-800 min-w-24">
                            Username :
                        </label>

                        <div
                            className="
                                flex
                                flex-col
                                sm:flex-row
                                w-full
                                sm:items-center
                                gap-1
                                sm:gap-3
                            "
                        >
                            <div
                                className="
                                    flex
                                    flex-col
                                    sm:flex-row
                                    w-full
                                    sm:items-center
                                    gap-1
                                    sm:gap-3
                                "
                            >
                                <div className="relative w-full">
                                    <FaUser
                                        className="
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-club-dark/40
                                            pointer-events-none
                                        "
                                    />

                                    <Input
                                        icon
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        readOnly={usernameChanged}
                                    />
                                </div>

                                <div className="w-full sm:w-auto">
                                    <ButtonPrimary
                                        label={isUsernameAvailable === false ? "Not available" : "Change Username"}
                                        size="md"
                                        onClick={async () => {
                                            try {
                                                setCheckingUsername(true);

                                                const available = await checkUsernameAvailable(username);

                                                if (!available) {
                                                    setIsUsernameAvailable(false);
                                                    return;
                                                }

                                                await changeUsername(username);
                                                setIsUsernameAvailable(true);

                                            } finally {
                                                setCheckingUsername(false);
                                                setUsernameChanged(true);
                                                toastSuccess("Username changed successfully to " + username + "!");
                                            }
                                        }}
                                        disabled={
                                            checkingUsername ||
                                            !username.trim() ||
                                            username === (user.profile?.username ?? '') ||
                                            usernameChanged
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="
                            flex
                            flex-col
                            sm:flex-row
                            w-full
                            items-start
                            sm:items-center
                            justify-between
                            gap-1
                            sm:gap-3
                        "
                    >
                        <label className="block text-sm font-semibold text-gray-800 min-w-24">
                            Email :
                        </label>

                        <div
                            className="
                                relative
                                w-full
                            "
                        >
                            <FaEnvelope
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-club-dark/40
                                    pointer-events-none
                                "
                            />

                            <Input
                                icon
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-center">
                        <ButtonPrimary label="Reset Password"
                            onClick={() => { navigate("reset-password") }} />
                    </div>
                </div>

                <div
                    className="
                        bg-white/80
                        rounded-3xl
                        border-2
                        border-black/20
                        shadow-xl

                        p-4
                        sm:p-8

                        space-y-4
                        sm:space-y-8
                    "
                >
                    <h2
                        className="
                            text-lg
                            sm:text-2xl
                            font-extrabold
                            text-center
                            text-club-primary
                        "
                    >
                        Chess.com
                    </h2>

                    <div
                        className="
                            flex
                            flex-col
                            sm:flex-row
                            w-full
                            items-start
                            sm:items-center
                            justify-between
                            gap-1
                            sm:gap-3
                        "
                    >
                        <label className="block text-sm font-semibold text-gray-800 min-w-24">
                            Chess Username :
                        </label>

                        <div
                            className="
                                flex
                                flex-col
                                sm:flex-row
                                w-full
                                sm:items-center
                                gap-1
                                sm:gap-3
                            "
                        >
                            <div className="relative w-full">
                                <FaChessBoard
                                    className="
                                        absolute
                                        left-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-club-dark/40
                                        pointer-events-none
                                    "
                                />

                                <Input
                                    icon
                                    value={chessUsername}
                                    placeholder="Chess.com Username"
                                    onChange={(e) => setChessUsername(e.target.value)}
                                />
                            </div>

                            <div className="w-full sm:w-auto">
                                <ButtonPrimary
                                    label="Fetch Stats"
                                    onClick={async () => {
                                        await checkUser(chessUsername);
                                        console.log("status:", status);

                                        if (status === "success") {
                                            await updateChessStats({
                                                chess_com_name: profile?.username ?? "",
                                                chess_com_player_id: profile?.player_id ?? 0,
                                                chess_com_blitz: stats?.chess_blitz?.last?.rating ?? 1200,
                                                chess_com_bullet: stats?.chess_bullet?.last?.rating ?? 1200,
                                                chess_com_rapid: stats?.chess_rapid?.last?.rating ?? 1200,
                                                chess_com_daily: stats?.chess_daily?.last?.rating ?? 1200,
                                                chess_com_960_daily: stats?.chess960_daily?.last?.rating ?? 1200,
                                                chess_com_title: profile?.title ?? undefined,
                                                fide_rating: stats?.fide ?? 0,
                                            });
                                            console.log("Chess.com stats updated.");
                                            toastSuccess("Chess.com stats updated successfully!");
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <p
                            className="
                                w-full
                                m-0
                                text-[10px]
                                sm:text-base
                                text-gray-800
                                bg-club-light/60
                                p-2
                                sm:p-4
                                rounded-xl
                                sm:rounded-2xl
                                border-2
                                border-black/20
                                leading-relaxed
                            "
                        >
                            Default stats are shown as
                            <span className="font-semibold"> 1200 </span>. If you still
                            see 1200, your Chess.com account is not connected yet.
                            Please verify your username and refresh your stats.
                        </p>
                    </div>

                    <div
                        className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            lg:grid-cols-3

                            gap-2
                            sm:gap-6

                            text-[10px]
                            sm:text-sm
                            text-center
                        "
                    >
                        {[
                            ['Blitz', chessStats.current?.chess_com_blitz],
                            ['Bullet', chessStats.current?.chess_com_bullet],
                            ['Rapid', chessStats.current?.chess_com_rapid],
                            ['Daily', chessStats.current?.chess_com_daily],
                            ['960 Daily', chessStats.current?.chess_com_960_daily],
                            ['Title', chessStats.current?.chess_com_title],
                            ['Fide Rating', chessStats.current?.fide_rating],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="
                                    bg-club-primary/20
                                    border-2
                                    border-black
                                    shadow-xl

                                    p-3
                                    sm:p-5

                                    rounded-2xl
                                    sm:rounded-3xl

                                    flex
                                    flex-col
                                    items-center
                                    text-center

                                    hover:scale-[1.06]
                                    transition-all
                                    duration-300
                                "
                            >
                                <h3 className="text-lg font-medium">{label}</h3>
                                <p>Rating: {value || 'N/A'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Settings;
