import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useInView } from "../../hooks/useInView"

const imagesBase = [1, 2, 3, 4, 5, 6, 7, 8];

const images800 = imagesBase.map(n => `/chessTogether/chess-together${n}-800.webp`);
const images1200 = imagesBase.map(n => `/chessTogether/chess-together${n}-1200.webp`);
const images1920 = imagesBase.map(n => `/chessTogether/chess-together${n}-1920.webp`);

const extendedImages800 = [...images800, images800[0]];
const extendedImages1200 = [...images1200, images1200[0]];
const extendedImages1920 = [...images1920, images1920[0]];

function ImageCarousel() {
    const { t } = useTranslation("home");
    const { ref, inView } = useInView(0.3);

    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const trackRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (paused) return;

        const interval = setInterval(() => {
            setIndex(prev => prev + 1);
        }, 2500);

        return () => clearInterval(interval);
    }, [paused]);

    return (
        <div
            ref={ref}
            className={`w-full flex flex-col items-center gap-y-4 bg-linear-to-b from-club-primary/40 via-[#a9c783]/70 to-[#efdcb4] py-6 px-4 shadow-lg
            ${inView ? 'animate-slideRight' : 'opacity-0'}`}>

            {/* Header Text */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center animate-[fadeIn_1s_ease-out_both] font-serif my-4">
                {t("imageCarousel.caption")}
            </h2>

            {/* Carousel Container */}
            <div
                className={`relative w-full max-w-5xl h-64 md:h-96 lg:h-[32rem] overflow-hidden rounded-xl shadow-xl bg-white mx-auto`}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >

                {/* Sliding Image Track */}
                <div
                    ref={trackRef}
                    className="flex h-full w-full transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${index * 100}%)` }}
                    onTransitionEnd={() => {
                        if (index === images1200.length) {
                            const track = trackRef.current;
                            if (!track) return;

                            // Disable animation, snap back, then restore animation
                            track.style.transition = "none";
                            setIndex(0);

                            requestAnimationFrame(() => {
                                requestAnimationFrame(() => {
                                    track.style.transition = "transform 700ms ease-out";
                                });
                            });
                        }
                    }}
                >
                    {extendedImages1200.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            srcSet={`${extendedImages800[i]} 800w, ${extendedImages1200[i]} 1200w, ${extendedImages1920[i]} 1920w`}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="w-full h-64 md:h-96 lg:h-[32rem] object-cover shrink-0 bg-transparent"
                            loading="lazy"
                            alt="Hanoi Lucky Chess Club members playing chess together"
                        />
                    ))}
                </div>

                {/* Dark Overlay for better contrast */}
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            </div>

            {/* Dots */}
            <div className="flex gap-2 justify-center">
                {images1200.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        aria-label={t("imageCarousel.goToPicture", { n: i + 1 })}
                        onClick={() => setIndex(i)}
                        className={`
                            w-8 h-8 md:w-6 md:h-6 lg:w-4 lg:h-4 rounded-full transition-all duration-300
                            ${i === index % images1200.length ? "bg-club-dark scale-110" : "bg-gray-400"}
                        `}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;