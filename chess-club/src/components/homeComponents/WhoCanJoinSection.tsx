import image from '../../assets/homePage/chessbanner2.jpg';
import { useInView } from '../../hooks/UseInView';
function WhoCanJoinSection() {
    const { ref, inView } = useInView(0.3);
    return (
        <div ref={ref} className={`flex flex-col w-full bg-club-secondary/30 py-10 px-4 shadow-inner-lg ${inView ? 'animate-slideRight' : 'opacity-0'}`}>
            <h2 className="text-3xl font-extrabold text-center mb-6 font-serif">
                Who Can Join?
            </h2>

            <div className="flex flex-col md:flex-row max-w-5xl mx-auto text-gray-800 gap-6 items-start">
                <div className="flex-col w-full md:w-1/2">
                    <img
                        src={image}
                        alt="Chess club banner"
                        className="rounded-xl shadow-lg object-cover"
                    />
                    <p className="text-sm italic text-center mt-2 font-serif">
                        Samuel Reshevsky, the child in this pic, defeating several chess masters at once in France, C. 1920
                    </p>
                </div>
                <div className="flex-col w-full md:w-1/2 items-start flex gap-4">
                    <p className="text-justify font-serif">
                        Our chess club is open to everyone! Whether you're a complete beginner or a seasoned player,
                        we welcome all skill levels. Our members range from young students to retirees, all united by
                        their love for the game.
                    </p>
                    <p className="text-justify font-serif">
                        Newcomers are especially encouraged to join. We believe in fostering a friendly and supportive
                        environment where everyone can learn and improve. Our experienced members are always happy to
                        share tips and strategies with those looking to enhance their skills.
                    </p>
                    <p className="text-justify font-serif">
                        So whether you're looking to play casual games, participate in tournaments, or simply enjoy
                        the camaraderie of fellow chess enthusiasts, the Hanoi Lucky Chess Club is the perfect place
                        for you!
                    </p>
                </div>
            </div>
        </div >
    )
}

export default WhoCanJoinSection;