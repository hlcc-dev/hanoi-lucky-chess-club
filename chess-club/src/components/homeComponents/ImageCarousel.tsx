import { useEffect, useRef, useState } from "react";

import image1 from '../../assets/homePage/chess-together1.jpg';
import image2 from '../../assets/homePage/chess-together2.jpg';
import image3 from '../../assets/homePage/chess-together3.jpg';
import image4 from '../../assets/homePage/chess-together4.jpg';
import image5 from '../../assets/homePage/chess-together5.jpg';
import image6 from '../../assets/homePage/chess-together6.jpg';
import image7 from '../../assets/homePage/chess-together7.jpg';
import image8 from '../../assets/homePage/chess-together8.jpg';

import { useInView } from "../../hooks/UseInView"

const images = [image1, image2, image3, image4, image5, image6, image7, image8];
const extendedImages = [...images, images[0]]; // smooth looping

function ImageCarousel() {

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
                That’s us every Friday & Sunday here in Hanoi
            </h2>

            {/* Carousel Container */}
            <div
                className={`relative w-280 h-180 overflow-hidden rounded-xl shadow-xl bg-white
                ${inView ? 'animate-fadeIn' : 'opacity-0'}`}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >

                {/* Sliding Image Track */}
                <div
                    ref={trackRef}
                    className="flex h-full w-full transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${index * 100}%)` }}
                    onTransitionEnd={() => {
                        if (index === images.length) {
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
                    {extendedImages.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            className="w-full h-180 object-center shrink-0 bg-transparent"
                            loading="lazy"
                        />
                    ))}
                </div>

                {/* Dark Overlay for better contrast */}
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            </div>

            {/* Dots */}
            <div className="flex gap-2 justify-center">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`
                            w-8 h-8 md:w-6 md:h-6 lg:w-4 lg:h-4 rounded-full transition-all duration-300
                            ${i === index % images.length ? "bg-club-dark scale-110" : "bg-gray-400"}
                        `}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;