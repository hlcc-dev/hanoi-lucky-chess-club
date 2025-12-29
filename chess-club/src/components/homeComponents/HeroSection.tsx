import heroImage from "../../assets/homePage/chessBackground.jpeg";

function HeroSection() {
    return (
        <section className="relative w-full h-[40vh] md:h-[60vh] lg:h-[80vh] overflow-hidden">

            {/* Background */}
            <img
                src={heroImage}
                alt="Hero"
                className="absolute inset-0 w-full h-full object-cover brightness-110"
            />

            {/* Light overlay */}
            <div className="absolute inset-0 bg-white/20" />

            {/* Content */}
            <div className="relative z-10 h-full w-full flex flex-col justify-between text-center items-center text-black font-bold px-6 font-serif">

                {/* Top Section */}
                <div className="mt-6">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl leading-tight">
                        Welcome to
                    </h1>

                    <h2 className="text-4xl sm:text-5xl md:text-6xl leading-tight">
                        Hanoi Lucky Chess Club
                    </h2>

                    <p className="text-lg sm:text-xl md:text-2xl mt-5">
                        A friendly corner of Hanoi where players of all levels meet,
                        laugh, learn, and enjoy great games together.
                    </p>
                </div>

                {/* Bottom Section */}
                <div className="mb-6">
                    <p className="text-xl md:text-5xl italic">
                        “Chess is life.” — <span className="font-extrabold">Bobby Fischer</span>
                    </p>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;