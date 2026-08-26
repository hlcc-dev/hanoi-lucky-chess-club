import { useTranslation } from 'react-i18next';
import { useInView } from '../../hooks/useInView';

const PARAGRAPHS = ["p1", "p2", "p3", "p4"] as const;

function WhoCanJoinSection() {
    const { t } = useTranslation("home");
    const { ref, inView } = useInView(0.3);
    return (
        <div ref={ref} className={`flex flex-col w-full bg-club-secondary/30 py-10 px-4 shadow-inner-lg ${inView ? 'animate-slideRight' : 'opacity-0'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-5 max-w-6xl mx-auto text-gray-800 gap-4 lg:gap-x-14">
                <h2 className="text-3xl font-extrabold text-center lg:text-left font-serif lg:col-span-3 lg:col-start-3 lg:row-start-1">
                    {t("whoCanJoin.title")}
                </h2>

                <div className="w-full max-w-md mx-auto lg:max-w-none lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:self-center">
                    <img
                        src='/banner/banner2-1200.webp'
                        className="w-full rounded-xl shadow-lg"
                        srcSet={`/banner/banner2-800.webp 800w, /banner/banner2-1200.webp 1200w, /banner/banner2-1920.webp 1920w`}
                        sizes="(min-width: 1024px) 40vw, (min-width: 448px) 448px, 100vw"
                        alt=""
                        loading='lazy' />
                </div>

                <div className="w-full lg:col-span-3 lg:col-start-3 lg:row-start-2 flex flex-col gap-4">
                    {PARAGRAPHS.map((key) => (
                        <p key={key} className="font-serif text-sm md:text-base lg:text-lg leading-relaxed">
                            {t(`whoCanJoin.${key}`)}
                        </p>
                    ))}
                </div>
            </div>
        </div >
    )
}

export default WhoCanJoinSection;