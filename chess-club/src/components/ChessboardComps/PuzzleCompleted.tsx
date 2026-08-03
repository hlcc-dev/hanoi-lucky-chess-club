import { FaTimes, FaTrophy } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import ButtonDark from "../../components/Button/ButtonDark"
import ButtonPrimary from "../../components/Button/ButtonPrimary"
import { useNavigate } from "react-router-dom";

interface PuzzleCompletedProps {
    time: string | number;
    attempts: number;
    onClose?: () => void;
}

function PuzzleCompleted({ time, attempts, onClose }: PuzzleCompletedProps) {
    const { t } = useTranslation(["puzzles", "common"]);
    const navigate = useNavigate();
    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 animate-fadeIn">
            <div className="relative bg-club-primary text-club-dark rounded-2xl shadow-2xl w-[95%] max-w-md p-0 overflow-hidden border border-black/20">
                <div className="bg-linear-to-r from-club-secondary to-club-light px-6 py-4 flex items-center justify-center relative">
                    <FaTrophy className="text-yellow-400 text-3xl mr-2" />
                    <h2 className="text-2xl font-extrabold tracking-wide">{t("completed.title")}</h2>

                    <button
                        onClick={onClose}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-black/70 hover:text-black"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>
                <div className="p-6 flex flex-col">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-center py-5 bg-white rounded-xl mb-6 shadow-inner">
                        <div>
                            <p className="text-2xl font-extrabold text-club-dark">{time} {t("completed.seconds")}</p>
                            <p className="text-sm text-gray-600">{t("completed.time")}</p>
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold text-club-dark">{attempts}</p>
                            <p className="text-sm text-gray-600">{t("completed.attempts")}</p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 mt-2 justify-center items-center">
                        <ButtonPrimary
                            label={t("completed.continue")}
                            onClick={onClose}
                            size="md"
                        />
                        <ButtonDark
                            label={t("nav.home", { ns: "common" })}
                            size="md"
                            onClick={() => navigate("/")} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PuzzleCompleted;