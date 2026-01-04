import { useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import ButtonPrimary from "../components/Button/ButtonPrimary";
import ButtonDark from "../components/Button/ButtonDark";
import { toastSuccess } from "../utils/toastUtils";
import Checkbox from "../components/Checkbox";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import login from "../utils/login";
import { useCaptchaGuard } from "../hooks/useCaptchaGuard";

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loginProcessing, setLoginProcessing] = useState<"idle" | "loading" | "error" | "success">("idle");
    const [loggedIn, setLoggedIn] = useState(true);
    const { Captcha, runWithCaptcha } = useCaptchaGuard();

    async function handleLogin() {
        setLoginProcessing("loading");
        try {
            await runWithCaptcha(async () => {
                const success = await login({
                    email,
                    password,
                    rememberMe: loggedIn,
                });

                if (success) {
                    toastSuccess("Login successful!");
                    navigate("/");
                    setLoginProcessing("success");
                } else if (success === false) {
                    setLoginProcessing("error");
                }
            });
        } catch (err) {
            console.error("Captcha or login failed:", err);
            setLoginProcessing("error");
        }
    }

    return (
        <div className="flex flex-1 items-center justify-center bg-club-light px-4 mx-auto my-12">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                {/* Header */}
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-club-dark">
                        Welcome Back
                    </h1>
                    <p className="mt-1 text-sm text-club-dark/60">
                        Log in to your account
                    </p>
                </div>

                {/* Form */}
                <form
                    className="flex flex-col gap-5"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                >
                    {/* Email */}
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-3.5 text-club-dark/40" />
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            icon
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <TbLockPassword className="absolute left-3 top-3.5 text-club-dark/40" />
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            icon
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-3.5 text-club-dark/50 hover:text-club-dark"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {/* Options */}
                    <div className="flex items-center justify-between text-sm">
                        <Checkbox
                            label="Keep me logged in"
                            checked={loggedIn}
                            onChange={() => setLoggedIn(!loggedIn)}
                        />
                        <button
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="text-club-secondary hover:underline"
                        >
                            Forgot password?
                        </button>
                    </div>

                    {Captcha}

                    {/* Primary action */}
                    <ButtonPrimary label={loginProcessing === "loading" ? "Logging in..." : "Login"} size="lg" onClick={handleLogin} disabled={loginProcessing === "loading"} />

                    {/* Divider */}
                    <div className="flex items-center my-2">
                        <span className="flex-1 h-px bg-club-dark/10" />
                        <span className="text-xs text-club-dark/50">OR</span>
                        <span className="flex-1 h-px bg-club-dark/10" />
                    </div>

                    {/* Secondary action */}
                    <ButtonDark
                        label="Join Now"
                        size="md"
                        onClick={() => navigate("/signup")}
                    />
                </form>
            </div>
        </div>
    );
}

export default LoginPage;