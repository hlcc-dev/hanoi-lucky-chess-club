import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TbLockPassword } from "react-icons/tb";
import Input from "../components/Input";
import ButtonPrimary from "../components/Button/ButtonPrimary";
import { supabasePersistent } from "../utils/supabaseClient";
import { toastSuccess, toastError } from "../utils/toastUtils";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
    const { t } = useTranslation("auth-pages");
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [loading, setLoading] = useState(true);

    // Make sure recovery session exists
    useEffect(() => {
        supabasePersistent.auth.getSession().then(({ data }) => {
            if (!data.session) {
                toastError(t("resetPassword.invalidLink"));
                navigate("/login", { replace: true });
                return;
            } else {
                setLoading(false);
            }
        });
    }, [navigate]);

    async function handleResetPassword() {
        if (!password || !passwordAgain) {
            toastError(t("resetPassword.fillBothFields"));
            return;
        }

        if (password !== passwordAgain) {
            toastError(t("resetPassword.passwordsNoMatch"));
            return;
        }

        try {
            const { error } = await supabasePersistent.auth.updateUser({
                password,
            });

            if (error) {
                toastError(t("resetPassword.resetFailed"));
                return;
            }

            toastSuccess(t("resetPassword.updatedSuccess"));
            navigate("/login", { replace: true });
        } catch {
            toastError(t("resetPassword.unexpectedError"));
        }
    }

    if (loading) return null;

    return (
        <div className="flex flex-1 items-center justify-center bg-club-light px-4 mt-10 mx-auto mb-12">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                {/* Header */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-club-dark">
                        {t("resetPassword.title")}
                    </h1>
                    <p className="mt-2 text-sm text-club-dark/60">
                        {t("resetPassword.subtitle")}
                    </p>
                </div>

                {/* Form */}
                <div className="flex flex-col gap-5">
                    {/* New password */}
                    <div className="relative group">
                        <TbLockPassword className="absolute left-3 top-3.5 text-club-dark/40" />
                        <Input
                            type="password"
                            placeholder={t("resetPassword.newPasswordPlaceholder")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon
                        />

                        <p className="text-lg md:text-md mt-2 px-1 text-club-dark hidden group-focus-within:block">
                            {t("resetPassword.passwordHintPrefix")} <span className="font-bold">{t("resetPassword.passwordHintStrong")}</span>.
                        </p>
                    </div>

                    {/* Confirm password */}
                    <div className="relative">
                        <TbLockPassword className="absolute left-3 top-3.5 text-club-dark/40" />
                        <Input
                            type="password"
                            placeholder={t("resetPassword.confirmPasswordPlaceholder")}
                            value={passwordAgain}
                            onChange={(e) => setPasswordAgain(e.target.value)}
                            icon
                        />
                    </div>

                    {/* Action */}
                    <ButtonPrimary
                        label={t("resetPassword.updatePassword")}
                        size="lg"
                        onClick={handleResetPassword}
                    />
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;