import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaChess } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";

import ButtonPrimary from "../components/Button/ButtonPrimary";
import ButtonSecondary from "../components/Button/ButtonSecondary";
import Loading from "../components/Loading";
import Input from "../components/Input";
import StepCounter from "../components/StepCounter";

import { useEmailValidation } from "../hooks/useEmailValidation";
import { useChessUser } from "../hooks/useChessUser";
import validatePassword from "../utils/validatePassword";
import signUp from "../utils/signUp";
import login from "../utils/login";
import updateChessStats from "../utils/UpdateChessStats";
import { supabasePersistent } from "../utils/supabaseClient";
import { toastSuccess, toastError } from "../utils/toastUtils";
import { checkUsernameAvailable } from "../utils/checkUsernameAvailable";

import { useNavigate } from "react-router-dom";

function SignUpPage() {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [signingUp, setSigningUp] = useState(false);


    const { status, validateEmail, reset } = useEmailValidation();

    const {
        status: chessStatus,
        checkUser,
        reset: resetChessUser,
        profile,
        stats
    } = useChessUser();

    const [chessUsername, setChessUsername] = useState("");

    const passwordValid = validatePassword(password);
    const passwordsMatch = password === passwordAgain;

    const formValid =
        username.trim() !== "" &&
        email.trim() !== "" &&
        passwordValid &&
        passwordsMatch;

    const canContinueStep1 =
        status === "idle" && formValid;

    async function handleStep1Continue() {
        const ok = await validateEmail(email);
        if (!ok) {
            toastError("Please provide a valid email address.");
            return;
        }

        try {
            setSigningUp(true);
            const usernameAvailable = await checkUsernameAvailable(username);
            if (!usernameAvailable) {
                toastError("Username is already taken. Please choose another.");
                return;
            }
            const success = await signUp({ email, password, username });
            if (success) {
                setStep(2)
                toastSuccess("Sign up successful! Please check your inbox to verify your email.");
            } else if (!success) {
                toastError("Sign up failed. Email may already be in use. Please try again!");
            }
        } finally {
            setSigningUp(false);
        }
    }

    const [emailTimer, setEmailTimer] = useState(0); // 0 = can resend

    async function handleResendEmail() {
        if (emailTimer > 0) return;

        await supabasePersistent.auth.resend({
            type: "signup",
            email,
        });

        setEmailTimer(60);
    }

    // Timer for resend email button
    useEffect(() => {
        if (emailTimer === 0) return;

        const interval = setInterval(() => {
            setEmailTimer((t) => t - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [emailTimer]);

    async function handleEmailVerifiedContinue() {
        const success = await login({
            email,
            password,
            rememberMe: true,
        });

        if (!success) {
            toastError("Please verify your email before continuing.");
            return;
        }

        toastSuccess("Email verified and logged in!");
        setStep(3);
    }

    async function handleCheckChessUser() {
        resetChessUser();
        checkUser(chessUsername);
    }

    const [chessSaveState, setChessSaveState] = useState<
        "idle" | "saving" | "failed" | "success"
    >("idle");
    useEffect(() => {
        if (
            chessStatus !== "success" ||
            !profile ||
            !stats ||
            chessSaveState !== "idle"
        ) {
            return;
        }

        async function saveChessStats() {
            setChessSaveState("saving");

            const success = await updateChessStats({
                chess_com_name: profile.username,
                chess_com_player_id: profile.player_id,
                chess_com_blitz: stats.chess_blitz.last.rating,
                chess_com_bullet: stats.chess_bullet.last.rating,
                chess_com_rapid: stats.chess_rapid.last.rating,
                chess_com_daily: stats.chess_daily.last.rating,
                chess_com_960_daily: stats.chess960_daily.last.rating,
                chess_com_title: profile.title,
                fide_rating: stats.fide?.rating,
            });

            if (!success) {
                toastError("Failed to save chess stats. Please try again.");
                setChessSaveState("failed"); // stop looping
                return;
            }

            setChessSaveState("success");
            navigate("/");
        }

        saveChessStats();
    }, [chessStatus, profile, stats, chessSaveState]);

    return (
        <div className="flex flex-1 items-center justify-center bg-club-light px-2">
            <div className="w-full max-w-md bg-white border border-club-dark/20 rounded-2xl shadow-lg p-8 mx-2 md:mx-0">
                <StepCounter step={step} />

                {step === 1 && (
                    <>
                        <h1 className="text-2xl font-bold text-center mb-6">
                            Create Account
                        </h1>

                        <div className="flex flex-col gap-4">
                            <div className="relative">
                                <FaUser className="absolute left-3 top-3.5 opacity-50" />
                                <Input
                                    type="text"
                                    placeholder="Username"
                                    icon
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="relative">
                                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    icon
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        reset();
                                    }}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <Loading state={status} size="sm" />
                                </div>
                            </div>

                            <div className="relative">
                                <TbLockPassword className="absolute left-3.5 top-3.5 opacity-50" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    icon
                                    password_check={!passwordValid && password !== ""}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-3.5 opacity-60"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            <div className="relative">
                                <TbLockPassword className="absolute left-3.5 top-3.5 opacity-50" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password again"
                                    icon
                                    password_check={!passwordsMatch && passwordAgain !== ""}
                                    value={passwordAgain}
                                    onChange={(e) => setPasswordAgain(e.target.value)}
                                />
                            </div>

                            <ButtonPrimary
                                label={status === 'idle' ? "Verify Email and Continue" : status === 'loading' ? "Validating..." : status === 'error' ? "Error Validating" : "Success! Please wait..."}
                                size="lg"
                                disabled={!canContinueStep1}
                                onClick={handleStep1Continue}
                            />
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h1 className="text-2xl font-bold text-center mb-4">
                            Verify Your Email
                        </h1>

                        <p className="text-center opacity-70 mb-6">
                            We sent a verification link to <b>{email}</b>.
                        </p>

                        <div className="flex flex-col gap-3">
                            <ButtonPrimary
                                label="I have verified my email"
                                size="lg"
                                onClick={handleEmailVerifiedContinue}
                            />

                            <ButtonPrimary
                                label={
                                    emailTimer > 0
                                        ? `Resend in ${emailTimer}s`
                                        : "Resend Email"
                                }
                                disabled={emailTimer > 0}
                                onClick={handleResendEmail}
                            />
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h1 className="text-2xl font-bold text-center mb-6">
                            Chess Profile
                        </h1>

                        <div className="flex flex-col gap-4">
                            <div className="relative">
                                <FaChess className="absolute left-3 top-3 opacity-50" />
                                <Input
                                    type="text"
                                    placeholder="Chess.com username"
                                    icon
                                    value={chessUsername}
                                    onChange={(e) => setChessUsername(e.target.value)}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <Loading state={chessStatus} size="sm" />
                                </div>
                            </div>

                            <div className="flex justify-between gap-2">
                                <ButtonSecondary
                                    label="Back"
                                    size="sm"
                                    onClick={() => setStep(2)}
                                />

                                <ButtonPrimary
                                    label={
                                        chessStatus === "success"
                                            ? "Finish"
                                            : chessStatus === "loading"
                                                ? "Checking..."
                                                : "Check"
                                    }
                                    size="sm"
                                    onClick={
                                        chessStatus === "success"
                                            ? () => navigate("/")
                                            : handleCheckChessUser
                                    }
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default SignUpPage;