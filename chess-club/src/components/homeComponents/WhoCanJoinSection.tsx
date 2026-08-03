import { useTranslation } from 'react-i18next';
import { useInView } from '../../hooks/useInView';
function WhoCanJoinSection() {
    const { t } = useTranslation("home");
    const { ref, inView } = useInView(0.3);
    return (
        <div ref={ref} className={`flex flex-col w-full bg-club-secondary/30 py-10 px-4 shadow-inner-lg ${inView ? 'animate-slideRight' : 'opacity-0'}`}>
            <h2 className="text-3xl font-extrabold text-center mb-6 font-serif">
                {t("whoCanJoin.title")}
            </h2>

            <div className="flex flex-col md:flex-row max-w-5xl mx-auto text-gray-800 gap-2 md:gap-6 items-center md:items-start ">
                <div className="flex-col w-full md:w-1/2">
                    <img
                        src='/banner/banner2-1200.webp'
                        className="rounded-xl shadow-lg object-cover"
                        srcSet={`/banner/banner2-800.webp 800w, /banner/banner2-1200.webp 1200w, /banner/banner2-1920.webp 1920w`}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        alt="Chess banner with Samuel Reshevsky playing against 20 grandmasters simultaneously in 1920"
                        loading='lazy' />
                </div>
                <div className="flex-col w-full md:w-1/2 items-center md:items-start flex gap-4">
                    <p className="text-justify font-serif text-sm md:text-base lg:text-lg leading-relaxed">
                        {t("whoCanJoin.p1")}
                    </p>
                    <p className="text-justify font-serif text-sm md:text-base lg:text-lg leading-relaxed">
                        {t("whoCanJoin.p2")}
                    </p>
                    <p className="text-justify font-serif text-sm md:text-base lg:text-lg leading-relaxed">
                        {t("whoCanJoin.p3")}
                    </p>
                </div>
            </div>
        </div >
    )
}

export default WhoCanJoinSection;