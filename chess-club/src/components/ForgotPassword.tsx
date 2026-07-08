import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEnvelope } from "react-icons/fa";
import Input from "./Input";
import ButtonPrimary from "./Button/ButtonPrimary";
import ButtonSecondary from "./Button/ButtonSecondary";
import { getActiveClient } from "../utils/getActiveClient";
import { toastSuccess, toastError } from "../utils/toastUtils";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const { t } = useTranslation("auth-pages");
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);



    async function handleReset() {
        const supabaseClient = await getActiveClient();

        if (!email) {
            toastError(t("forgotPassword.enterEmailError"));
            return;
        }

        try {
            setLoading(true);

            const { error } = await supabaseClient.auth.resetPasswordForEmail(
                email,
                {
                    redirectTo: `${window.location.origin}/settings/reset-password`,
                }
            );

            if (error) {
                toastError(t("forgotPassword.sendFailed"));
                return;
            }

            toastSuccess(t("forgotPassword.sentSuccess"));
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
                        {t("forgotPassword.title")}
                    </h1>
                    <p className="mt-2 text-sm text-club-dark/60">
                        {t("forgotPassword.subtitle")}
                    </p>
                </div>

                {/* Form */}
                <div className="flex flex-col gap-5">
                    {/* Email */}
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-3.5 text-club-dark/40" />
                        <Input
                            type="email"
                            placeholder={t("forgotPassword.emailPlaceholder")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon
                        />
                    </div>

                    {/* Actions */}
                    <ButtonPrimary
                        label={loading ? t("forgotPassword.sending") : t("forgotPassword.sendResetLink")}
                        size="lg"
                        disabled={loading}
                        onClick={handleReset}
                    />

                    <ButtonSecondary
                        label={t("forgotPassword.backToLogin")}
                        size="md"
                        onClick={() => navigate("/login")}
                    />
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;