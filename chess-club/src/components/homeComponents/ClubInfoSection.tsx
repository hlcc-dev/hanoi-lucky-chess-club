import { FaMapMarkerAlt, FaClock, FaDirections, FaRegClock } from "react-icons/fa"
import { useInView } from "../../hooks/useInView"

function ClubInfoSection() {
    const { ref, inView } = useInView(0.3);

    const googleMapsLink = "https://maps.app.goo.gl/aQdHKXbR5KqGRZ9v6"

    return (
        <div id="location" className={`w-full h-full  mt-6 md:mt-16 flex flex-col items-center ${inView ? 'animate-slideLeft' : 'opacity-0'}`}
            ref={ref}>

            <h2 className="text-3xl font-extrabold text-center mb-6 font-serif">
                Where & When We Play
            </h2>

            <div className="flex flex-col md:flex-row gap-6 w-full shadow-xl p-4 md:p-6 lg:p-8">

                {/* Time Section */}
                <div className="flex-1 flex flex-col gap-4 bg-[#f3e7c4] border border-black/20 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <FaClock className="text-club-dark text-2xl" />
                        <h3 className="text-xl font-bold">Weekly Schedule</h3>
                    </div>

                    <div className={`flex flex-col lg:flex-row gap-4 mt-2 items-stretch ${inView ? 'animate-fadeIn' : 'opacity-0'}`}>

                        {/* Friday Card */}
                        <div className="flex w-full md:flex-1 bg-white rounded-xl border border-black/20 shadow overflow-hidden">
                            {/* Date Section */}
                            <div className="bg-club-primary text-white flex flex-col justify-center items-center px-6 py-4">
                                <p className="text-4xl font-extrabold leading-none">FRI</p>
                                <p className="text-sm tracking-wide mt-1">EVENING</p>
                            </div>

                            {/* Details Section */}
                            <div className="flex flex-col justify-center px-6 py-4">
                                <p className="font-bold text-lg text-club-dark">Friday Evening Chess</p>
                                <p className="text-gray-700 flex items-center gap-2">
                                    <FaRegClock className="text-club-dark" /> 19:00 — 23:00
                                </p>
                                <p className="text-sm italic text-gray-600">
                                    Casual games, friendly matches, laughs & great company.
                                </p>
                            </div>
                        </div>

                        {/* Sunday Card */}
                        <div className="flex w-full md:flex-1 bg-white rounded-xl border border-black/20 shadow overflow-hidden">
                            {/* Date Section */}
                            <div className="bg-[#9fb97f] text-black flex flex-col justify-center items-center px-6 py-4">
                                <p className="text-4xl font-extrabold leading-none">SUN</p>
                                <p className="text-sm tracking-wide mt-1">AFTERNOON</p>
                            </div>

                            {/* Details Section */}
                            <div className="flex flex-col justify-center px-6 py-4">
                                <p className="font-bold text-lg text-club-dark">Sunday Afternoon Chess</p>
                                <p className="text-gray-700 flex items-center gap-2">
                                    <FaRegClock className="text-club-dark" /> 14:00 — 18:00
                                </p>
                                <p className="text-sm italic text-gray-600">
                                    Relaxed weekend chess with players of all levels.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location Section */}
                <div className="flex-1 flex flex-col gap-4 mt-4 lg:mt-0">
                    <div className="bg-[#f3e7c4] border border-black/20 rounded-xl p-6 shadow-sm flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <FaMapMarkerAlt className="text-club-dark text-2xl" />
                            <h3 className="text-xl font-bold">Our Home in Hanoi</h3>
                        </div>

                        <p className="text-gray-700">
                            We meet at <span className="font-semibold">Horizon Cafe</span>, a cozy, friendly place,
                            loved by locals and travelers. Great atmosphere, drinks, and plenty of space for chess.
                        </p>

                        {/* Google Map */}
                        <div className="w-full h-72 rounded-xl overflow-hidden border border-black/20 shadow">
                            <iframe
                                title="Horizon Coffee - relax & working space "
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.1412136480885!2d105.78998237622996!3d20.986975789210604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ad0068fb4277%3A0x304c1a8711f2fe1a!2sHorizon%20Coffee%20-%20Ph%C3%B9ng%20Khoang!5e0!3m2!1sen!2s!4v1767537636625!5m2!1sen!2s"
                                width="100%"
                                height="100%"
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>

                        <a
                            href={googleMapsLink}
                            target="_blank"
                            className="mt-2 flex items-center gap-2 justify-center bg-club-dark text-white rounded-xl px-4 py-2 font-semibold shadow hover:scale-105 transition"
                        >
                            <FaDirections />
                            Get Directions
                        </a>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default ClubInfoSection