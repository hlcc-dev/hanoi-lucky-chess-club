import { FaMapMarkerAlt, FaClock, FaDirections, FaRegClock, FaMoon, FaSun, FaExternalLinkAlt } from "react-icons/fa"
import { useTranslation } from "react-i18next"
import { useInView } from "../../hooks/useInView"

function ClubInfoSection() {
    const { t } = useTranslation("home");
    const { ref, inView } = useInView(0.3);

    const googleMapsLink = "https://maps.app.goo.gl/aQdHKXbR5KqGRZ9v6"

    const sessions = [
        {
            key: "fri",
            icon: <FaMoon className="text-2xl sm:text-3xl mb-2 text-[#f2c14e]" />,
            badgeClass: "bg-[#2b3a55] text-white",
            day: t("clubInfo.friDay"),
            period: t("clubInfo.friPeriod"),
            title: t("clubInfo.friTitle"),
            time: t("clubInfo.friTime"),
            desc: t("clubInfo.friDesc"),
        },
        {
            key: "sun",
            icon: <FaSun className="text-2xl sm:text-3xl mb-2 text-[#fbc02d]" />,
            badgeClass: "bg-[#9fb97f] text-club-dark",
            day: t("clubInfo.sunDay"),
            period: t("clubInfo.sunPeriod"),
            title: t("clubInfo.sunTitle"),
            time: t("clubInfo.sunTime"),
            desc: t("clubInfo.sunDesc"),
        },
    ]

    return (
        <div id="location" className={`w-full h-full  mt-6 md:mt-16 flex flex-col items-center ${inView ? 'animate-slideLeft' : 'opacity-0'}`}
            ref={ref}>

            <h2 className="text-3xl font-extrabold text-center mb-6 font-serif">
                {t("clubInfo.title")}
            </h2>

            <div className="flex flex-col md:flex-row gap-6 w-full shadow-xl p-4 md:p-6 lg:p-8">

                {/* Time Section */}
                <div className="flex-1 flex flex-col gap-4 bg-[#f3e7c4] border border-black/20 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <FaClock className="text-club-dark text-2xl" />
                        <h3 className="text-xl font-bold">{t("clubInfo.weeklySchedule")}</h3>
                    </div>

                    <div className={`flex flex-col gap-4 mt-2 ${inView ? 'animate-fadeIn' : 'opacity-0'}`}>

                        {sessions.map((session) => (
                            <div key={session.key} className="flex w-full bg-white rounded-xl border border-black/20 shadow overflow-hidden">
                                {/* Date Section */}
                                <div className={`${session.badgeClass} flex flex-col justify-center items-center shrink-0 w-20 sm:w-24 px-3 py-4`}>
                                    {session.icon}
                                    <p className="text-2xl sm:text-3xl font-extrabold leading-none">{session.day}</p>
                                    <p className="text-[10px] sm:text-xs tracking-wide mt-1">{session.period}</p>
                                </div>

                                {/* Details Section */}
                                <div className="flex-1 min-w-0 flex flex-col gap-1.5 px-4 py-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="min-w-0 hyphens-auto break-words text-lg sm:text-xl font-bold text-club-dark">{session.title}</h4>
                                        <span className="shrink-0 inline-flex items-center rounded-full border border-[#D4AF37] bg-gradient-to-b from-[#FBF3DC] to-[#F3E3B3] px-2.5 py-1 text-xs font-semibold text-[#785B12] shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 ease-in-out hover:scale-105 hover:from-[#F3E3B3] hover:to-[#EDD189] hover:shadow-sm">
                                            {t("clubInfo.freeEntry")}
                                        </span>
                                    </div>

                                    <p className="text-base sm:text-lg font-semibold text-club-dark flex items-center gap-1.5 whitespace-nowrap">
                                        <FaRegClock className="text-club-dark shrink-0" /> {session.time}
                                    </p>

                                    <p className="text-gray-700 text-sm sm:text-base">{session.desc}</p>

                                    <ul className="list-disc pl-5 text-gray-700 text-sm sm:text-base space-y-0.5">
                                        <li>{t("clubInfo.noRegistration")}</li>
                                        <li>{t("clubInfo.justWalkIn")}</li>
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Location Section */}
                <div className="flex-1 flex flex-col gap-4 mt-4 lg:mt-0">
                    <div className="bg-[#f3e7c4] border border-black/20 rounded-xl p-6 shadow-sm flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <FaMapMarkerAlt className="text-club-dark text-2xl" />
                            <h3 className="text-xl font-bold">{t("clubInfo.locationTitle")}</h3>
                        </div>

                        <p className="text-gray-700">
                            {t("clubInfo.locationPrefix")} <span className="font-semibold">{t("clubInfo.venueName")}</span>{t("clubInfo.locationSuffix")}
                        </p>

                        {/* Google Map */}
                        <div className="relative w-full h-72 rounded-xl overflow-hidden border border-black/20 shadow">
                            <iframe
                                title="Horizon Coffee - relax & working space "
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.1412136480885!2d105.78998237622996!3d20.986975789210604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ad0068fb4277%3A0x304c1a8711f2fe1a!2sHorizon%20Coffee%20-%20Ph%C3%B9ng%20Khoang!5e0!3m2!1sen!2s!4v1767537636625!5m2!1sen!2s"
                                width="100%"
                                height="100%"
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                            />

                            <a
                                href={googleMapsLink}
                                target="_blank"
                                className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-white/95 text-club-dark text-sm font-semibold rounded-lg px-3 py-1.5 shadow border border-black/10 hover:bg-white transition"
                            >
                                {t("clubInfo.openInMaps")}
                                <FaExternalLinkAlt className="text-xs" />
                            </a>
                        </div>

                        <a
                            href={googleMapsLink}
                            target="_blank"
                            className="mt-2 flex items-center gap-2 justify-center bg-club-dark text-white rounded-xl px-4 py-2 font-semibold shadow hover:scale-105 transition"
                        >
                            <FaDirections />
                            {t("clubInfo.getDirections")}
                        </a>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default ClubInfoSection
