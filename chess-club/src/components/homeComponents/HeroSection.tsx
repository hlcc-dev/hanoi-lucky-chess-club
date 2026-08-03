import { useTranslation } from "react-i18next";

function HeroSection() {
    const { t } = useTranslation("home");
    return (
        <section className="relative w-full h-[40vh] md:h-[60vh] lg:h-[80vh] overflow-hidden">

            {/* Background */}
            <img
                src="/hero/hero1200.webp"
                srcSet={`/hero/hero800.webp 800w, /hero/hero1200.webp 1200w, /hero/hero1920.webp 1920w`}
                sizes="100vw"
                alt="Hero"
                fetchPriority="high"
                className="absolute inset-0 w-full h-full object-cover brightness-110"
            />

            {/* Light overlay */}
            <div className="absolute inset-0 bg-white/20" />

            {/* Content */}
            <div className="relative z-10 h-full w-full flex flex-col justify-between text-center items-center text-black font-bold px-6 font-serif">

                {/* Top Section */}
                <div className="mt-6">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl leading-tight">
                        {t("hero.welcome")}
                    </h1>

                    <h2 className="text-4xl sm:text-5xl md:text-6xl leading-tight">
                        {t("hero.clubName")}
                    </h2>

                    <p className="text-lg sm:text-xl md:text-2xl mt-5">
                        {t("hero.tagline")}
                    </p>
                </div>

                {/* Bottom Section */}
                <div className="mb-6">
                    <p className="text-xl md:text-5xl italic">
                        {t("hero.quote")} — <span className="font-extrabold">{t("hero.quoteAuthor")}</span>
                    </p>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;