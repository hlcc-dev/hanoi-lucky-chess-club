import { useTranslation } from "react-i18next";
import { FaChessQueen } from "react-icons/fa";

function HeroSection() {
    const { t } = useTranslation("home");
    return (
        // min-h, not a fixed h: with five languages the copy length varies a
        // lot, and a fixed height would clip it instead of growing.
        <section className="relative flex w-full min-h-[52vh] md:min-h-[60vh] lg:min-h-[80vh] overflow-hidden">

            {/* Background */}
            <img
                src="/hero/hero1200.webp"
                srcSet={`/hero/hero800.webp 800w, /hero/hero1200.webp 1200w, /hero/hero1920.webp 1920w`}
                sizes="100vw"
                alt="Hero"
                fetchPriority="high"
                className="absolute inset-0 w-full h-full object-cover brightness-[1.34] contrast-[0.82] saturate-[0.92]"
            />

            {/* Light overlay — cream rather than pure white, so the wash keeps
                the warm tone of the club palette instead of going grey. */}
            <div className="absolute inset-0 bg-[#f8ecc4]/30 pointer-events-none" />

            {/* Soft light pools behind the copy — brightens where the text sits
                without flattening the whole photo. */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: [
                        "radial-gradient(62% 44% at 50% 21%, rgba(255,255,255,0.80) 0%, rgba(255,255,255,0.38) 44%, rgba(255,255,255,0) 76%)",
                        "radial-gradient(54% 26% at 50% 88%, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.24) 48%, rgba(255,255,255,0) 80%)",
                    ].join(", "),
                }}
            />

            {/* Content — gap keeps the two blocks apart on narrow screens where
                the section has grown and justify-between has no slack left. */}
            <div className="relative z-10 grow w-full flex flex-col justify-between items-center gap-8 text-center text-black font-bold px-6 py-8 md:py-10 font-serif">

                {/* Top Section */}
                <div className="[text-shadow:0_0_28px_rgba(255,255,255,0.9)]">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl leading-tight">
                        {t("hero.welcome")}
                    </h1>

                    <h2 className="text-2xl sm:text-4xl md:text-5xl leading-tight">
                        {t("hero.clubName")}
                    </h2>

                    {/* Crown divider */}
                    <div className="flex items-center justify-center gap-3 mt-3 sm:mt-4 text-[#c19a5b]">
                        <span className="h-px w-12 sm:w-20 bg-current opacity-70" />
                        <FaChessQueen className="text-sm sm:text-lg shrink-0" />
                        <span className="h-px w-12 sm:w-20 bg-current opacity-70" />
                    </div>

                    <p className="text-base sm:text-xl md:text-2xl mt-3 sm:mt-4 font-normal text-[#4a3728]">
                        {t("hero.tagline")}
                    </p>
                </div>

                {/* Bottom Section */}
                <div className="[text-shadow:0_0_22px_rgba(255,255,255,0.85)]">
                    <p className="text-base md:text-[2.7rem] italic leading-tight">
                        {t("hero.quote")} — <span className="font-extrabold">{t("hero.quoteAuthor")}</span>
                    </p>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;