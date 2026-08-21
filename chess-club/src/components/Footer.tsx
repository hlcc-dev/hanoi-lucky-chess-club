import { FaFacebook } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
  return (
    /* Same tokens as the header, so the two chrome bars read as one system. */
    <footer className="w-full bg-header-bg text-header-fg shadow-inner shadow-black/10 py-7">
      <div className="mx-auto flex w-full flex-col items-center gap-4 px-4 text-center">
        <p className="font-serif text-sm sm:text-base">
          &copy; {new Date().getFullYear()} Hanoi Lucky Chess Club
          <span className="hidden sm:inline"> · {t("footer.rights")}</span>
        </p>

        <div className="flex items-center gap-5">
          <a
            href="https://zalo.me/g/owpzpk136"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Zalo"
            className="text-brand-gold hover:text-brand-gold-hover transition-transform hover:scale-110"
          >
            {/* w-auto, not a square box, which would letterbox the wordmark.
                Taller than the Facebook mark on purpose: a wordmark reads
                lighter than a solid circle at matching height. */}
            <SiZalo className="h-10 w-auto" />
          </a>

          <span aria-hidden="true" className="h-6 w-px bg-header-fg/30" />

          <a
            href="https://www.facebook.com/share/g/1C1m9d7TmJ/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-brand-gold hover:text-brand-gold-hover transition-transform hover:scale-110"
          >
            <FaFacebook className="h-7 w-7" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;