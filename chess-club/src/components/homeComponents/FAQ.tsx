import { useState } from "react";
//import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useInView } from "../../hooks/useInView";

function FAQ() {
    //const navigate = useNavigate();
    const { t } = useTranslation("home");
    const { ref, inView } = useInView(0.3);

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };

    const faqs = [
        {
            q: t("faq.items.q1"),
            a: t("faq.items.a1")
        },
        {
            q: t("faq.items.q2"),
            a: t("faq.items.a2"),
            link: "location"
        },
        {
            q: t("faq.items.q5"),
            a: t("faq.items.a5")
        },
        {
            q: t("faq.items.q8"),
            a: t("faq.items.a8")
        },
        {
            q: t("faq.items.q9"),
            a: t("faq.items.a9")
        },
        {
            q: t("faq.items.q10"),
            a: t("faq.items.a10")
        },
        {
            q: t("faq.items.q11"),
            a: t("faq.items.a11")
        },
        {
            q: t("faq.items.q12"),
            a: t("faq.items.a12")
        },
        {
            q: t("faq.items.q14"),
            a: t("faq.items.a14")
        }
        // {
        //     q: "How can I make a financial contribution to the Hanoi Lucky Chess Club?",
        //     a: "We appreciate financial contributions to help cover our operating costs. Please contact Francis Lloyd Holland.",
        //     navigate: "Contact"
        // },
        // {
        //     q: "Does the chess club accept sponsors?",
        //     a: "Anyone can help sponsor the chess club by purchasing an advertisement on the club website or by donating. Francis Lloyd Holland can provide more information.",
        //     navigate: "Contact"
        // }
        // Tax reasons adjust later
    ];

    return (
        <div
            ref={ref}
            className={`w-full max-w-4xl mx-auto my-16 px-4 ${inView ? 'animate-slideRight' : 'opacity-0'}`}>
            <h2 className="text-3xl font-extrabold text-center mb-8 font-serif">
                {t("faq.title")}
            </h2>

            <div className="space-y-3 ">
                {faqs.map((item, index) => (
                    <div
                        key={index}
                        className="border border-black/20 rounded-xl bg-white shadow"
                    >
                        {/* Question Row */}
                        <button
                            onClick={() => toggle(index)}
                            className="w-full flex justify-between items-center px-5 py-4 text-left font-semibold text-lg"
                        >
                            <span>{item.q}</span>
                            <FaChevronDown
                                className={`transition-transform duration-300 ${openIndex === index ? "rotate-180" : "rotate-0"
                                    }`}
                            />
                        </button>

                        {/* Answer */}
                        <div
                            className={`overflow-hidden transition-all duration-500 ${openIndex === index
                                ? "max-h-40 px-5 pb-4"
                                : "max-h-0 px-5"
                                }`}
                        >
                            <p className="text-gray-700 min-w-full">
                                {item.a}
                            </p>

                            {item.link && (
                                <a href={`#${item.link}`} className="text-club-primary font-bold hover:underline mt-2 inline-block">{t("faq.checkLocation")}</a>
                            )}
                            {/*{item.navigate && (
                                <button
                                    onClick={() => navigate(`/${item.navigate.toLowerCase()}`)}
                                    className="text-club-primary font-bold hover:underline mt-2 inline-block"
                                >
                                    Go to {item.navigate}
                                </button>
                            )}*/}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FAQ;