import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useInView } from "../../hooks/useInView";

function FAQ() {
    const { ref, inView } = useInView(0.3);

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };

    const faqs = [
        {
            q: "Do I need to be an experienced chess player to join?",
            a: "Not at all! We welcome everyone, absolute beginners, casual players, and experienced competitors. Many members are happy to help newcomers learn and improve."
        },
        {
            q: "How often does the club meet?",
            a: "We meet twice a week: every Friday evening from 19:00 to 23:00 and every Sunday afternoon from 14:00 to 18:00."
        },
        {
            q: "Where do you play?",
            a: "We play at Horizon Coffee in Hanoi, a cozy, friendly venue with plenty of space, good lighting, and great drinks."
        },
        {
            q: "Is there a membership fee?",
            a: "No membership fee at all! Chess should be accessible. You only pay for your own drinks or snacks at the cafe."
        },
        {
            q: "Can I bring my own chess set or clock?",
            a: "Yes, absolutely! We have boards and clocks available, but bringing your own is totally welcome."
        },
        {
            q: "Are beginners welcome?",
            a: "Yes! Many members started as beginners here. You will always find friendly players willing to help you learn."
        },
        {
            q: "Do I need to register before coming?",
            a: "No registration needed. Just come, say hello, take a seat, and enjoy some chess!"
        },
        {
            q: "Do you play casual or competitive chess?",
            a: "Both! Some players enjoy relaxed friendly games, while others challenge each other in more serious matches or blitz sessions."
        },
        {
            q: "Can kids or younger players join?",
            a: "Yes, younger players are welcome as long as they behave well in the cafe environment."
        },
        {
            q: "How do I stay updated about the club?",
            a: "Follow our Facebook / Zalo / community channels for updates, events, and announcements."
        }
    ];

    return (
        <div
            ref={ref}
            className={`w-full max-w-4xl mx-auto my-16 px-4 ${inView ? 'animate-slideRight' : 'opacity-0'}`}>
            <h2 className="text-3xl font-extrabold text-center mb-8 font-serif">
                Frequently Asked Questions
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
                            <p className="text-gray-700">
                                {item.a}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FAQ;