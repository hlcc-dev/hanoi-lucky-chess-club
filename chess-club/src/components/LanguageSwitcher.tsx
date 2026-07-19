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
        <CurrentFlag
          className={
            variant === "mobile"
              ? "h-5 w-[30px] rounded-sm shadow-sm"
              : "h-6 w-9 rounded-sm shadow-sm"
          }
        />
        {open ? (
          <FaChevronUp className={variant === "mobile" ? "h-[6px] w-[6px]" : "h-[7px] w-[7px]"} />
        ) : (
          <FaChevronDown className={variant === "mobile" ? "h-[6px] w-[6px]" : "h-[7px] w-[7px]"} />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 min-w-[150px] rounded-lg border border-club-dark/15 bg-club-light shadow-lg overflow-hidden z-50 text-sm">
          {LANGUAGES.map(({ code, labelKey, Flag }) => (
            <button
              key={code}
              onClick={() => {
                i18n.changeLanguage(code);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 text-left px-3.5 py-2.5 hover:bg-club-primary/15 ${
                currentCode.toLowerCase() === code ? "font-bold bg-club-primary/10" : ""
              }`}
            >
              <Flag className="h-4 w-6 rounded-sm shadow-sm shrink-0" />
              {t(labelKey)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
