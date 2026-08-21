import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import {
  FaCrown,
  FaChessPawn,
  FaPuzzlePiece,
  FaChessKnight,
  FaEnvelope,
} from "react-icons/fa6";
import { useState, useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import AuthButtons from "./Button/AuthButtons";
import LanguageSwitcher from "./LanguageSwitcher";

function Header() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  // UX: Tắt cuộn trang khi mở menu mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  // Close on the way into the desktop layout: the mobile header and its backdrop
  // both disappear at lg, which would otherwise leave the body scroll-locked
  // with nothing left on screen to close the menu.
  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    if (desktop.matches) {
      setOpen(false);
      return;
    }
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, [open]);

  return (
    <>
      {/* ================= MOBILE HEADER (GIỮ NGUYÊN HOẶC TINH CHỈNH NHẸ) ================= */}
      {/* This header covers both the mobile and tablet tiers, since the desktop
          one only takes over at lg (1024px). */}
      <header className="relative z-50 w-full h-16 px-4 bg-header-bg text-header-fg flex items-center justify-between lg:hidden shadow-sm">
        {/* aria-label on the link, alt="" on the image: below 390px the wordmark
            is display:none, so the image would otherwise be the link's only
            name — and above 390px it would be read twice. */}
        <NavLink to="/" aria-label="Hanoi Lucky Chess Club" className="flex items-center gap-[11px]">
          <img
            src="/logo_smaller-100x100.webp"
            alt=""
            className="h-[54px] w-[54px] rounded-full border-2 border-club-secondary object-cover shrink-0"
          />
          {/* Wordmark from 390px up; below that the logo stands alone. */}
          <span className="hidden min-[390px]:flex flex-col font-brand font-medium leading-[0.95] text-[19px] md:text-[21px]">
            <span>Hanoi Lucky</span>
            <span>Chess Club</span>
          </span>
        </NavLink>

        <div className="flex items-center gap-1 shrink-0">
          <LanguageSwitcher variant="mobile" />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={t("nav.menu", "Menu")}
            aria-expanded={open}
            aria-controls="mobile-nav"
            /* 44px target with the icon still at the spec'd 26px. */
            className="h-11 w-11 flex items-center justify-center text-[26px] hover:opacity-80 transition-opacity"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* MOBILE MENU OVERLAY */}
        <div
          id="mobile-nav"
          className={`
            absolute top-full left-0 w-full bg-header-bg text-header-fg shadow-xl border-t border-black/10
            transition-all duration-300 ease-in-out origin-top
            ${open ? "scale-y-100 opacity-100 visible" : "scale-y-0 opacity-0 invisible"}
          `}
        >
          <nav>
            <ul className="flex flex-col gap-2 px-6 py-4 font-semibold text-sm">
              <MobileNavLink to="/" label={t("nav.home")} icon={<FaCrown />} setOpen={setOpen} />
              <MobileNavLink to="/leaderboard" label={t("nav.leaderboard")} icon={<FaChessPawn />} setOpen={setOpen} />
              <MobileNavLink to="/daily-chess-puzzle" label={t("nav.dailyPuzzles")} icon={<FaPuzzlePiece />} setOpen={setOpen} />
              <MobileNavLink to="/puzzle-marathon" label={t("nav.puzzleMarathon")} icon={<FaChessKnight />} setOpen={setOpen} />
              <MobileNavLink to="/contact" label={t("nav.contact")} icon={<FaEnvelope />} setOpen={setOpen} />
              
              <div className="pt-3 mt-2 border-t border-club-dark/10 flex justify-center">
                 <AuthButtons mobile onAction={() => setOpen(false)} />
              </div>
            </ul>
          </nav>
        </div>
      </header>
      
      {/* BACKDROP */}
      {open && (
        <div 
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)} 
        />
      )}

      {/* ================= DESKTOP HEADER (THIẾT KẾ LẠI) ================= */}
      {/* Thay đổi: h-40 -> h-20, Grid -> Flex */}
      <header className="relative z-50 hidden lg:flex w-full h-16 items-center justify-between bg-header-bg text-header-fg px-4 shadow-md">

        {/* LEFT: LOGO & TITLE */}
        <div className="flex items-center shrink-0">
          <NavLink to="/" aria-label="Hanoi Lucky Chess Club" className="group flex items-center gap-[11px]">
            <img
              src="/logo_smaller-200x200.webp"
              alt=""
              className="h-[54px] w-[54px] rounded-full border-2 border-club-secondary object-cover shadow-sm transition-transform group-hover:scale-105"
            />
            {/* Spans, not an h1: every page already has its own h1, and the
                unlayered `h1 {font-weight:600;line-height:1.25}` in index.css
                outranks Tailwind utilities, which made the two lines mismatch. */}
            <div className="flex flex-col font-brand font-medium leading-[0.95] text-[24px]">
                <span>Hanoi Lucky</span>
                <span>Chess Club</span>
            </div>
          </NavLink>
        </div>

        {/* CENTER: NAV ITEMS */}
        <div className="flex-1 flex justify-center px-4">
          <nav>
            {/* The 16px spec size holds from xl up (the spec sheet targets
                1440px+). Between lg and xl there is only ~515px of centre
                space, so the row steps down instead of crushing itself. */}
            <ul className="flex gap-1 xl:gap-4 font-medium text-sm xl:text-base">
              <NavLinkItem to="/" label={t("nav.home")} icon={<FaCrown />} />
              <NavLinkItem to="/leaderboard" label={t("nav.leaderboard")} icon={<FaChessPawn />} />
              <NavLinkItem to="/daily-chess-puzzle" label={t("nav.puzzles")} icon={<FaPuzzlePiece />} />
              <NavLinkItem to="/puzzle-marathon" label={t("nav.marathon")} icon={<FaChessKnight />} />
              <NavLinkItem to="/contact" label={t("nav.contact")} icon={<FaEnvelope />} />
            </ul>
          </nav>
        </div>

        {/* RIGHT: LANGUAGE + AUTH BUTTONS */}
        <div className="flex items-center justify-end gap-2 shrink-0 min-w-[140px]">
           <LanguageSwitcher variant="desktop" />
           <AuthButtons />
        </div>

        {/* Decorative Bottom Line (Mỏng hơn) */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-club-secondary/50 to-transparent" />
      </header>
    </>
  );
}

/* ================= NAV ITEMS ================= */

function NavLinkItem({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          [
            "inline-flex items-center justify-center",
            "px-2 xl:px-3 py-2 rounded-md transition-all duration-200",
            "border border-transparent",
            // Active and hover share the same green per the spec; weight is
            // what tells them apart.
            isActive
              ? "bg-header-active font-semibold"
              : "hover:bg-header-active font-medium",
          ].join(" ")
        }
      >
        <span className="flex items-center gap-2">
          {/* shrink-0 so a tight row can never squash the icon to 0px wide, and
              hidden below xl where there genuinely isn't room for it. The label
              carries the meaning, so dropping the icon there costs nothing. */}
          <span className="hidden xl:block shrink-0 text-[17px] leading-none">{icon}</span>
          <span className="whitespace-nowrap">{label}</span>
        </span>
      </NavLink>
    </li>
  );
}

function MobileNavLink({
  to,
  label,
  icon,
  setOpen,
}: {
  to: string;
  label: string;
  icon: ReactNode;
  setOpen: (open: boolean) => void;
}) {
  return (
    <li>
        <NavLink
        to={to}
        onClick={() => setOpen(false)}
        className={({ isActive }) => `
            flex items-center gap-3 py-2 px-3 rounded-md transition-colors
            ${isActive ? 'bg-header-active font-semibold' : 'hover:bg-header-active'}
        `}
        >
        <span className="text-[17px] leading-none">{icon}</span>
        {label}
        </NavLink>
    </li>
  );
}

export default Header;