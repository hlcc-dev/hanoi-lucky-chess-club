import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import Input from "./Input";
import ButtonPrimary from "./Button/ButtonPrimary";
import ButtonSecondary from "./Button/ButtonSecondary";
import { supabasePersistent } from "../utils/supabaseClient";
import { toastSuccess, toastError } from "../utils/toastUtils";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleReset() {
        if (!email) {
            toastError("Please enter your email address.");
            return;
        }

        try {
            setLoading(true);

            const { error } = await supabasePersistent.auth.resetPasswordForEmail(
                email,
                {
                    redirectTo: `${window.location.origin}/reset-password`,
                }
            );

            if (error) {
                toastError("Failed to send reset email. Please try again.");
                return;
            }

            toastSuccess("Password reset email sent. Check your inbox.");
            navigate("/login");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-1 items-center justify-center bg-club-light px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                {/* Header */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-club-dark">
                        Forgot your password?
                    </h1>
                    <p className="mt-2 text-sm text-club-dark/60">
                        Enter your email and we’ll send you a reset link.
                    </p>
                </div>

                {/* Form */}
                <div className="flex flex-col gap-5">
                    {/* Email */}
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-3.5 text-club-dark/40" />
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon
                        />
                    </div>

                    {/* Actions */}
                    <ButtonPrimary
                        label={loading ? "Sending..." : "Send reset link"}
                        size="lg"
                        disabled={loading}
                        onClick={handleReset}
                    />

                    <ButtonSecondary
                        label="Back to login"
                        size="md"
                        onClick={() => navigate("/login")}
                    />
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;