import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface LanguageSwitcherProps {
  variant?: "desktop" | "mobile";
}

const LANGUAGES = [
  { code: "en", labelKey: "language.english" },
  { code: "vi", labelKey: "language.vietnamese" },
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

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t("language.label")}
        className={
          variant === "mobile"
            ? "h-9 w-9 flex items-center justify-center gap-[2px] rounded-md text-[11px] font-semibold leading-none hover:bg-club-dark/10 transition-colors"
            : "h-9 flex items-center gap-1 px-3 rounded-md text-sm font-semibold leading-none hover:bg-club-dark/10 transition-colors"
        }
      >
        <span className={variant === "mobile" ? "text-[15px] leading-none" : "text-base leading-none"}>
          🌐
        </span>
        <span className="leading-none">{currentCode}</span>
        {variant !== "mobile" && <span className="text-[10px] opacity-70">▾</span>}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 min-w-[150px] rounded-lg border border-club-dark/15 bg-club-light shadow-lg overflow-hidden z-50 text-sm">
          {LANGUAGES.map(({ code, labelKey }) => (
            <button
              key={code}
              onClick={() => {
                i18n.changeLanguage(code);
                setOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 hover:bg-club-primary/15 ${
                currentCode.toLowerCase() === code ? "font-bold bg-club-primary/10" : ""
              }`}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
