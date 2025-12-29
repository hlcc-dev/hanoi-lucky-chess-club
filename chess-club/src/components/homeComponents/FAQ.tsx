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
            a: "Not at all! We welcome everyone, including absolute beginners, casual players, and experienced competitors. Members are happy to help newcomers learn and improve."
        },
        {
            q: "How often does the club meet?",
            a: "We meet twice a week: every Friday evening from 19:00 to 23:00 and every Sunday afternoon from 14:00 to 18:00."
        },
        {
            q: "Where do you play?",
            a: "We play at Horizon Coffee in Phung Khoang, Ha Dong, Hanoi, a cozy, friendly venue with plenty of space, good lighting, and great drinks."
        },
        {
            q: "Is there a membership fee?",
            a: "There are no dues or fees at all for participation and membership. Chess should be accessible. You pay only for your own drinks or snacks at the cafe."
        },
        {
            q: "Can I bring my own chess set or clock?",
            a: "We have enough boards and clocks for everyone to play and you are welcome to bring your own as well."
        },
        {
            q: "Are beginners welcome?",
            a: "Yes! Many members are beginners here. You will always find friendly players willing to help you learn."
        },
        {
            q: "Do I need to register before coming?",
            a: "No registration is needed. Just come, say \"Hello\", take a seat, and enjoy some chess!"
        },
        {
            q: "Do you play casual or competitive chess?",
            a: "Both! Some players enjoy relaxed friendly games, laughing, joking and talking smack, while others challenge each other in more serious matches and blitz sessions."
        },
        {
            q: "Can kids or younger players join?",
            a: "Younger players are welcome as we believe chess is a great way for kids to develop critical thinking and social skills."
        },
        {
            q: "Do girls and women play chess with you?",
            a: "Among our best chess players are girls and women. We often offer a prize for the best female player at our chess tournaments."
        },
        {
            q: "How do I stay updated about the club?",
            a: "Join our Facebook / Zalo / community channels for updates, events, and announcements."
        },
        {
            q: "How can I get more information about the chess club and its meetings?",
            a: "You can call Francis Lloyd Holland by Zalo and WhatsApp at 333 009 587 or email us at francislholland@gmail.com"
        },
        {
            q: "Who started the Hanoi Lucky Chess Club (HLCC) and when?",
            a: "Two friends, Francis Lloyd Holland (from America) and Duong Hai (Vietnamese), started HLCC on December 10, 2023, by taking a chess set to a Hanoi pizzeria and playing with members of the public."
        },
        {
            q: "How many languages do club participants speak?",
            a: "We speak many languages, including Vietnamese, English, French, Spanish, Portuguese, Turkish, German."
        },
        {
            q: "Is joining the chess club a good way to learn English?",
            a: "During chess meetings, we talk about chess, laugh and joke in Vietnamese, English and several other languages."
        },
        {
            q: "Can I practice English and make new friends by playing chess with you?",
            a: "Our chess club members often gather for lunch before the meetings and/or dinner afterward and practice our English while making new English-speaking friends from the USA, England, Australia, France, Germany, and African, Asian and Latin American countries."
        },
        {
            q: "How can I make a financial contribution to the Hanoi Lucky Chess Club?",
            a: "You can donate to HLCC using the following QR code:"
        },
        {
            q: "Does the chess club accept sponsors?",
            a: "Anyone can help sponsor the chess club by purchasing an advertisement on the club website or by donating at the above QR code."
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