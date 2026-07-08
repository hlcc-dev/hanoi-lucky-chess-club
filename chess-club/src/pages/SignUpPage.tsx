import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { useSearchParams } from "react-router-dom";

function SignUpPage() {
    const { t } = useTranslation("auth-pages");
    const [searchParams] = useSearchParams();
    const urlStep = Number(searchParams.get("step")) || 1;

    const [step, setStep] = useState(urlStep);
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [signedUser, setSignedUser] = useState("");

    const [showPassword, setShowPassword] = useState(false);


    const { status, validateEmail, reset } = useEmailValidation();

    useEffect(() => {
        if (step !== 3) return;
        const checkSignedUser = async () => {
            const {
                data: { user },
            } = await supabasePersistent.auth.getUser();
            setSignedUser(user?.id || "");
        };
        checkSignedUser();
    }, [step]);

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
            toastError(t("signup.invalidEmail"));
            return;
        }

        try {
            const usernameAvailable = await checkUsernameAvailable(username);
            if (!usernameAvailable) {
                toastError(t("signup.usernameTaken"));
                return;
            }

            const success = await signUp({ email, password, username });

            if (success) {
                setStep(2)
                toastSuccess(t("signup.signupSuccess"));
            } else {
                // Sửa lại thông báo lỗi cho đúng ngữ cảnh
                toastError(t("signup.signupFailed"));
            }

        } catch (err) {
            console.error("Signup error:", err);
            toastError(t("signup.signupError"));
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
            toastError(t("signup.verifyBeforeContinue"));
            return;
        }

        toastSuccess(t("signup.emailVerifiedLoggedIn"));
        setStep(3);
    }

    async function handleCheckChessUser() {
        // allow retry flow
        setChessSaveState("idle");

        resetChessUser();
        await checkUser(chessUsername);
        console.log("Checked chess user");
    }

    const [chessSaveState, setChessSaveState] = useState<
        "idle" | "saving" | "failed" | "success"
    >("idle");
    useEffect(() => {
        if (
            chessStatus !== "success" ||
            !profile ||
            !stats ||
            chessSaveState === "saving"
        ) {
            return;
        }

        async function saveChessStats() {
            setChessSaveState("saving");

            const success = await updateChessStats({
                user_id: signedUser || "",
                chess_com_name: profile?.username || "",
                chess_com_player_id: profile?.player_id || 0,
                chess_com_blitz: stats?.chess_blitz?.last.rating || 0,
                chess_com_bullet: stats?.chess_bullet?.last.rating || 0,
                chess_com_rapid: stats?.chess_rapid?.last.rating || 0,
                chess_com_daily: stats?.chess_daily?.last.rating || 0,
                chess_com_960_daily: stats?.chess960_daily?.last.rating || 0,
                chess_com_title: profile?.title || undefined,
                fide_rating: stats?.fide || undefined,
            });

            if (!success) {
                toastError(t("signup.failedSaveStats"));
                setChessSaveState("failed"); // stop looping
                return;
            }

            setChessSaveState("success");
            navigate("/");
        }

        saveChessStats();
    }, [chessStatus, profile, stats, chessSaveState]);

    return (
        <div className="flex flex-1 items-center justify-center bg-club-light px-2 mx-auto my-12">
            <div className="w-full max-w-md bg-white border border-club-dark/20 rounded-2xl shadow-lg p-8 mx-2 md:mx-0">
                <StepCounter step={step} />

                {step === 1 && (
                    <>
                        <h1 className="text-2xl font-bold text-center mb-6">
                            {t("signup.createAccount")}
                        </h1>

                        <div className="flex flex-col gap-4">
                            <div className="relative">
                                <FaUser className="absolute left-3 top-3.5 opacity-50" />
                                <Input
                                    type="text"
                                    placeholder={t("signup.usernamePlaceholder")}
                                    icon
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="relative">
                                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
                                <Input
                                    type="email"
                                    placeholder={t("signup.emailPlaceholder")}
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

                            <div className="relative group">
                                <TbLockPassword className="absolute left-3.5 top-3.5 opacity-50" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t("signup.passwordPlaceholder")}
                                    icon
                                    password_check={!passwordValid && password !== ""}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <p className="mt-2 px-1 text-sm text-club-dark opacity-75 hidden group-focus-within:block">
                                    {t("signup.passwordHintPrefix")} <span className="font-semibold">{t("signup.passwordHintStrong")}</span>.
                                </p>
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
                                    placeholder={t("signup.passwordAgainPlaceholder")}
                                    icon
                                    password_check={!passwordsMatch && passwordAgain !== ""}
                                    value={passwordAgain}
                                    onChange={(e) => setPasswordAgain(e.target.value)}
                                />
                            </div>
                            <ButtonPrimary
                                label={status === 'idle' ? t("signup.verifyEmailAndContinue") : status === 'loading' ? t("signup.validating") : status === 'error' ? t("signup.errorValidating") : t("signup.successPleaseWait")}
                                size="lg"
                                disabled={!canContinueStep1}
                                onClick={handleStep1Continue}
                            />
                        </div>
                    </>
                )}

                {/* Phần step 2 và 3 giữ nguyên như cũ, không cần thay đổi */}
                {step === 2 && (
                    <>
                        <h1 className="text-2xl font-bold text-center mb-4">
                            {t("signup.verifyYourEmail")}
                        </h1>

                        <p className="text-center text-club-dark text-lg mb-6">
                            {t("signup.verificationSentPrefix")} <b>{email}</b> {t("signup.verificationSentMiddle")} <span className="font-extrabold text-2xl">{t("signup.spamOrJunk")}</span> {t("signup.verificationSentSuffix")}
                        </p>


                        <div className="flex flex-col gap-3">
                            <ButtonPrimary
                                label={t("signup.iHaveVerified")}
                                size="lg"
                                onClick={handleEmailVerifiedContinue}
                            />

                            <ButtonPrimary
                                label={
                                    emailTimer > 0
                                        ? t("signup.resendIn", { seconds: emailTimer })
                                        : t("signup.resendEmail")
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
                            {t("signup.chessProfile")}
                        </h1>
                        <p className="text-center opacity-70 mb-6">
                            {t("signup.linkChessProfile")}
                        </p>

                        <div className="flex flex-col gap-4">
                            <div className="relative">
                                <FaChess className="absolute left-3 top-3 opacity-50" />
                                <Input
                                    type="text"
                                    placeholder={t("signup.chessUsernamePlaceholder")}
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
                                    label={t("signup.skipForNow")}
                                    size="sm"
                                    onClick={() => navigate("/")}
                                />

                                <ButtonPrimary
                                    label={
                                        chessStatus === "success"
                                            ? t("signup.saveAndFinish")
                                            : chessStatus === "loading"
                                                ? t("signup.checking")
                                                : t("signup.check")
                                    }
                                    size="sm"
                                    onClick={handleCheckChessUser}
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