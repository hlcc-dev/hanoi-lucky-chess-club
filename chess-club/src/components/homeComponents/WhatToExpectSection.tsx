
import { useTranslation } from 'react-i18next';
import { useInView } from '../../hooks/useInView';

function WhatToExpectSection() {
    const { t } = useTranslation("home");
    const { ref, inView } = useInView(0.3);
    return (
        <div
            ref={ref}
            className={`w-full flex flex-col items-center my-16 px-4 md:px-8 lg:px-12 transition-all duration-700 ${inView ? 'animate-slideLeft' : 'opacity-0'}`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-center mb-6 font-serif">
                {t("whatToExpect.title")}
            </h2 >

            <div className="max-w-5xl flex flex-col md:flex-row gap-4 md:gap-8 text-gray-800">
                <img
                    src="/banner/banner-1200.webp"
                    srcSet="/banner/banner-400.webp 400w, /banner/banner-800.webp 800w, /banner/banner-1200.webp 1200w, /banner/banner-1920.webp 1920w"
                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, 50vw"
                    alt="Chess banner saying that about chess"
                    className="w-full md:w-1/2 h-56 md:h-full object-contain md:object-cover rounded-2xl shadow-lg"
                    loading="lazy"
                    decoding="async"
                />
                <div className="w-full md:w-1/2 flex flex-col">
                    <p className="mb-4 font-serif text-justify text-sm md:text-base lg:text-lg leading-relaxed">
                        {t("whatToExpect.p1")}
                    </p>

                    <p className="mb-4 font-serif text-justify text-sm md:text-base lg:text-lg leading-relaxed">
                        {t("whatToExpect.p2")}
                    </p>

                    <p className="mb-4 font-serif text-justify text-sm md:text-base lg:text-lg leading-relaxed">
                        {t("whatToExpect.p3")}
                    </p>

                    <p className="mb-4 font-serif text-justify text-sm md:text-base lg:text-lg leading-relaxed">
                        {t("whatToExpect.p4")}
                    </p>
                </div>
            </div>
        </div >
    )
}

export default WhatToExpectSection;