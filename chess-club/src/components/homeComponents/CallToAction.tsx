import ButtonDark from "../Button/ButtonDark";
import ButtonWhite from "../Button/ButtonWhite";
import ButtonSecondary from "../Button/ButtonSecondary";
import { useNavigate } from "react-router-dom";
import { useInView } from "../../hooks/UseInView";
function CallToAction() {
    const navigate = useNavigate();
    const { ref, inView } = useInView(0.3);
    return (
        <div
            ref={ref}
            className={`w-full bg-club-primary text-white py-12 px-6 shadow-lg flex flex-col items-center ${inView ? 'animate-slideLeft' : 'opacity-0'}`}>
            <h2 className="text-3xl font-extrabold mb-4 text-center font-serif">
                Ready to Join the Fun?
            </h2>
            <p className="text-lg mb-6 text-center max-w-2xl">
                Whether you're a seasoned player or just starting out, the Hanoi Lucky Chess Club welcomes you. Come for the games, stay for the community!
            </p>
            <div className="flex flex-row gap-4 flex-wrap justify-center">
                <ButtonWhite
                    label="Join Our Zalo Group"
                    onClick={() => {
                        window.open("https://zalo.me/g/owpzpk136", "_blank", "noopener,noreferrer");
                    }}
                    size="lg"
                />
                <ButtonDark
                    label="Join Our Facebook Group"
                    onClick={() => {
                        window.open("https://www.facebook.com/share/17ovBRMUDA/?mibextid=wwXIfr", "_blank", "noopener,noreferrer");
                    }}
                    size="lg"
                />
                <ButtonSecondary
                    label="Checkout Upcoming Events"
                    onClick={() => {
                        navigate("/events");
                    }}
                    size="lg"
                />
            </div>
        </div>
    )
}
export default CallToAction;