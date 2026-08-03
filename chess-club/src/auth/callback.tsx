import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { handleAuthCallback } from "./handleAuthCallback";

export default function AuthCallbackPage() {
    const { t } = useTranslation();
    useEffect(() => {
        handleAuthCallback();
    }, []);

    return <p>{t("verifyingEmail")}</p>;
}