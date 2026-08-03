import ButtonDark from "../Button/ButtonDark";
import ButtonWhite from "../Button/ButtonWhite";
import ButtonSecondary from "../Button/ButtonSecondary";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useInView } from "../../hooks/useInView";
function CallToAction() {
    const { t } = useTranslation("home");
    const navigate = useNavigate();
    const { ref, inView } = useInView(0.3);
    return (
        <div
            ref={ref}
            className={`w-full bg-club-primary text-white py-12 px-6 shadow-lg flex flex-col items-center ${inView ? 'animate-slideLeft' : 'opacity-0'}`}>
            <h2 className="text-3xl font-extrabold mb-4 text-center font-serif">
                {t("cta.title")}
            </h2>
            <p className="text-lg mb-6 text-center max-w-2xl">
                {t("cta.desc")}
            </p>
            <div className="flex flex-row gap-4 flex-wrap justify-center">
                <ButtonWhite
                    label={t("cta.joinZalo")}
                    onClick={() => {
                        window.open("https://zalo.me/g/owpzpk136", "_blank", "noopener,noreferrer");
                    }}
                    size="lg"
                />
                <ButtonDark
                    label={t("cta.joinFacebook")}
                    onClick={() => {
                        window.open("https://www.facebook.com/share/17ovBRMUDA/?mibextid=wwXIfr", "_blank", "noopener,noreferrer");
                    }}
                    size="lg"
                />
                <ButtonSecondary
                    label={t("cta.upcomingEvents")}
                    onClick={() => {
                        navigate("/events");
                    }}
                    size="lg"
                />
            </div>
        </div>
    )
}
export default CallToAction;