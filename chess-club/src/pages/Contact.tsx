import francis from '../assets/contact/francis.jpg';
import hai from '../assets/contact/hai.jpg';

import { FaFacebook, FaWhatsapp } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import { IoCall } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
function Contact() {
    return (
        <section className="grow flex flex-col items-center px-4 py-10">
            <h1 className="text-4xl font-extrabold mb-6 font-serif">Contact Us</h1>
            <p className="text-lg text-center max-w-2xl mb-5">
                We’d love to hear from you! Feel free to reach out for any inquiries, feedback, or to learn more about our chess club and events.
                You can contact us via email or phone, and join our community on Zalo and Facebook.
            </p>
            <div className="flex items-center gap-5 mb-5">
                <a
                    href="https://zalo.me/g/owpzpk136"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Zalo"
                    className="hover:text-club-secondary transition-transform hover:scale-110 pr-5"
                >
                    <SiZalo className="h-10 w-10 md:h-15 md:w-15" />
                </a>

                <a
                    href="https://www.facebook.com/share/g/1C1m9d7TmJ/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="hover:text-club-secondary transition-transform hover:scale-110"
                >
                    <FaFacebook className="h-10 w-10 md:h-15 md:w-15" />
                </a>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-center justify-center w-full max-w-6xl">

                {/* Card 1 */}
                <div className="bg-club-secondary rounded-xl shadow-xl p-10 w-full max-w-2xl text-center border min-h-140">
                    <h2 className="text-xl font-semibold mb-4">Francis Lloyd Holland</h2>
                    <h3 className="text-lg italic mb-6">Co-Founder</h3>

                    <img src={francis} alt="Francis' Profile Picture" className="w-64 h-64 mx-auto mb-4 rounded-full" loading='lazy' />
                    <p className="text-club-dark text-xl mb-2">
                        <div className="flex flex-row items-center justify-center">
                            <MdOutlineMailOutline className="inline-block mx-2" />
                            <strong>Email:</strong>
                        </div>
                        <a
                            href="mailto:francislholland@gmail.com"
                            className="underline hover:text-club-light"
                        >
                            francislholland@gmail.com
                        </a>
                    </p>

                    <div className="text-club-dark text-xl mb-4">
                        <strong>Phone & Chat:</strong>

                        <div className="flex items-center justify-center gap-6 mt-2">

                            <a
                                href="tel:+84333009587"
                                className="transition-transform hover:scale-110"
                                aria-label="Call"
                            >
                                <IoCall className="text-black text-4xl" />
                            </a>

                            <a
                                href="https://wa.me/84333009587"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-transform hover:scale-110 text-black"
                                aria-label="WhatsApp"
                            >
                                <FaWhatsapp className="text-black text-4xl" />
                            </a>

                            <a
                                href="https://zalo.me/84333009587"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-transform hover:scale-110 text-black"
                                aria-label="Zalo"
                            >
                                <SiZalo className="text-black text-4xl" />
                            </a>

                        </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-club-secondary rounded-xl shadow-xl p-10 w-full max-w-2xl text-center border min-h-140">
                    <h2 className="text-xl font-semibold mb-4">Duong Hai</h2>
                    <h3 className="text-lg italic mb-6">Co-Founder</h3>
                    <img src={hai} alt="Hanoi Lucky Chess Club" className="w-64 h-64 mx-auto mb-4 rounded-full" loading='lazy' />
                    <p className="text-club-dark text-xl mb-2">
                        <div className="flex flex-row items-center justify-center">
                            <MdOutlineMailOutline className="inline-block mx-2" />
                            <strong>Email:</strong>
                        </div>
                        <a href="mailto:siegfried.duong@gmail.com" className="ml-1 underline hover:text-club-light">
                            siegfried.duong@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Contact;
