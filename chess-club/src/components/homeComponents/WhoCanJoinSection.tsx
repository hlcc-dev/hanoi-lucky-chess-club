import { useTranslation } from 'react-i18next';
import { useInView } from '../../hooks/useInView';

const PARAGRAPHS = ["p1", "p2", "p3", "p4"] as const;

function WhoCanJoinSection() {
    const { t } = useTranslation("home");
    const { ref, inView } = useInView(0.3);
    return (
        <div ref={ref} className={`flex flex-col w-full bg-club-secondary/30 py-10 px-4 shadow-inner-lg ${inView ? 'animate-slideRight' : 'opacity-0'}`}>
            <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] max-w-6xl mx-auto text-gray-800 gap-2 md:gap-x-10 lg:gap-x-14 md:gap-y-4">
                <h2 className="text-3xl font-extrabold text-center md:text-left font-serif md:col-start-2 md:row-start-1">
                    {t("whoCanJoin.title")}
                </h2>

                <div className="w-full md:col-start-1 md:row-start-2 self-center">
                    <img
                        src='/banner/banner2-1200.webp'
                        className="w-full rounded-xl shadow-lg"
                        srcSet={`/banner/banner2-800.webp 800w, /banner/banner2-1200.webp 1200w, /banner/banner2-1920.webp 1920w`}
                        sizes="(max-width: 768px) 100vw, 40vw"
                        alt=""
                        loading='lazy' />
                </div>

                <div className="w-full md:col-start-2 md:row-start-2 flex flex-col gap-4">
                    {PARAGRAPHS.map((key) => (
                        <p key={key} className="text-justify font-serif text-sm md:text-base lg:text-lg leading-relaxed">
                            {t(`whoCanJoin.${key}`)}
                        </p>
                    ))}
                </div>
            </div>
        </div >
    )
}

export default WhoCanJoinSection;