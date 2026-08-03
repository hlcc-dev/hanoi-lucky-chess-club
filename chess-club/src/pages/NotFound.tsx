import { FaChessKing } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center bg-club-light text-club-dark px-6 py-16">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-3 text-6xl md:text-8xl">
          <span className="font-bold">4</span>
          <FaChessKing className="text-club-secondary animate-bounce" />
          <span className="font-bold">4</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold">
          {t("notFound.title")}
        </h1>

        <p className="text-sm md:text-base text-club-dark max-w-lg mx-auto">
          {t("notFound.message")}
        </p>

        <Link
          to="/"
          className="inline-block mt-4 px-6 py-3 rounded-lg bg-club-secondary text-black font-semibold hover:scale-105 transition-transform"
        >
          {t("notFound.returnHome")}
        </Link>
      </div>
    </div>
  );
}

export default NotFound;