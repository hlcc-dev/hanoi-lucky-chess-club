import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { GbFlag, VnFlag } from "./flags";

interface LanguageSwitcherProps {
  variant?: "desktop" | "mobile";
}

const LANGUAGES = [
  { code: "en", labelKey: "language.english", Flag: GbFlag },
  { code: "vi", labelKey: "language.vietnamese", Flag: VnFlag },
] as const;

function LanguageSwitcher({ variant = "desktop" }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentCode = i18n.resolvedLanguage?.toUpperCase() ?? "EN";
  const CurrentFlag = LANGUAGES.find((l) => l.code === currentCode.toLowerCase())?.Flag ?? GbFlag;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t("language.label")}
        className={
          variant === "mobile"
            ? "h-9 w-9 flex items-center justify-center gap-1 rounded-md hover:bg-club-dark/10 transition-colors"
            : "h-9 flex items-center gap-2 px-3 rounded-md hover:bg-club-dark/10 transition-colors"
        }
      >
        <span className="h-6 w-6 rounded-full overflow-hidden shadow-sm shrink-0">
          <CurrentFlag className="h-full w-full" />
        </span>
        {open ? (
          <FaChevronUp className={variant === "mobile" ? "h-[6px] w-[6px]" : "h-[7px] w-[7px]"} />
        ) : (
          <FaChevronDown className={variant === "mobile" ? "h-[6px] w-[6px]" : "h-[7px] w-[7px]"} />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 min-w-[190px] rounded-lg border border-club-dark/15 bg-club-light shadow-lg overflow-hidden z-50 text-sm">
          {LANGUAGES.map(({ code, labelKey, Flag }) => (
            <button
              key={code}
              onClick={() => {
                i18n.changeLanguage(code);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 text-left whitespace-nowrap py-3.5 px-[18px] hover:bg-club-primary/15 ${
                currentCode.toLowerCase() === code ? "font-bold bg-club-primary/10" : ""
              }`}
            >
              <span className="h-8 w-8 rounded-full overflow-hidden shadow-sm shrink-0">
                <Flag className="h-full w-full" />
              </span>
              {t(labelKey)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
