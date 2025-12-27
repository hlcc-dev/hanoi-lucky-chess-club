import heroImage from "../../assets/homePage/chessBackground.jpeg";

function HeroSection() {
    return (
        <section className="relative w-full h-[40vh] md:h-[60vh] lg:h-[80vh] flex items-center justify-center animate-[slideRight_0.6s_ease-out_forwards] overflow-hidden">
            {/* Background Image */}
            <img
                src={heroImage}
                alt="Hero"
                className="absolute inset-0 w-full h-full object-cover brightness-[0.55]"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/60" />

            {/* Content */}
            <div className="relative z-10 text-center text-white px-4 max-w-3xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg animate-[fadeIn_1s_ease-out_both_0.6s]">
                    Welcome to the Hanoi Lucky Chess Club
                </h1>

                <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 leading-relaxed animate-[fadeIn_1s_ease-out_both_1.6s]">
                    A friendly corner of Hanoi where players of all levels meet, laugh, learn, and enjoy great games together.
                </p>

                {/* Bobby Fischer Quote */}
                <p className="italic text-sm sm:text-base md:text-lg opacity-95 animate-[fadeIn_1s_ease-out_both_2.6s]">
                    “Chess is life.” — <span className="font-semibold">Bobby Fischer</span>
                </p>
            </div>
        </section>
    );
}

export default HeroSection;