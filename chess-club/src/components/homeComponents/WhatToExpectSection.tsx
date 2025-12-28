import image from '../../assets/homePage/chessbanner1.jpeg';
import { useInView } from '../../hooks/useInView';

function WhatToExpectSection() {
    const { ref, inView } = useInView(0.3);
    return (
        <div
            ref={ref}
            className={`w-full flex flex-col items-center my-16 px-4 md:px-8 lg:px-12 transition-all duration-700 ${inView ? 'animate-slideLeft' : 'opacity-0'}`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-center mb-6 font-serif">
                What to Expect at Hanoi Lucky Chess Club
            </h2 >

            <div className="max-w-5xl flex flex-col md:flex-row gap-4 md:gap-8 text-gray-800">
                <img src={image} alt="Chess banner" className="w-full md:w-1/2 h-56 md:h-full object-contain md:object-cover rounded-2xl shadow-lg" />
                <div className="w-full md:w-1/2 flex flex-col">
                    <p className="mb-4 font-serif text-justify text-sm md:text-base lg:text-lg leading-relaxed">
                        At Hanoi Lucky Chess Club, we welcome players of all skill levels, from absolute beginners to seasoned
                        competitors. Our friendly community is here to help you improve your game, make new friends, and enjoy the
                        timeless joy of chess.
                    </p>

                    <p className="mb-4 font-serif text-justify text-sm md:text-base lg:text-lg leading-relaxed">
                        Whether you're looking for casual games, serious matches, or just a place to hang out with fellow chess
                        enthusiasts, you'll find it here. We host regular events, tournaments, and training sessions to keep things
                        exciting and engaging.
                    </p>

                    <p className="mb-4 font-serif text-justify text-sm md:text-base lg:text-lg leading-relaxed">
                        Our venue, Horizon Cafe, offers a comfortable and inviting atmosphere with plenty of space to play, relax,
                        and socialize. Enjoy great coffee, snacks, and drinks while you immerse yourself in the world of chess.
                    </p>

                    <p className="mb-4 font-serif text-justify text-sm md:text-base lg:text-lg leading-relaxed">
                        Join us every Friday evening and Sunday afternoon for a memorable chess experience in the heart of Hanoi!
                    </p>
                </div>
            </div>
        </div >
    )
}

export default WhatToExpectSection;