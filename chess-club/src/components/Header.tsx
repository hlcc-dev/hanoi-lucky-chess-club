import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { FaChessPawn, FaChessQueen } from "react-icons/fa6";
import { useState, useEffect } from "react";
import AuthButtons from "./Button/AuthButtons";

function Header() {
  const [open, setOpen] = useState(false);

  // UX: Tắt cuộn trang khi mở menu mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  return (
    <>
      {/* ================= MOBILE HEADER (GIỮ NGUYÊN HOẶC TINH CHỈNH NHẸ) ================= */}
      <header className="relative z-50 w-full h-16 px-4 bg-club-primary text-club-dark flex items-center justify-between lg:hidden shadow-sm">
        {/* Logo Mobile nhỏ hơn một chút */}
        <NavLink to="/" className="flex items-center gap-2">
          <img
            src="/logo_smaller-100x100.webp"
            alt="Club Logo"
            className="h-10 w-10 rounded-full border border-club-secondary object-cover"
          />
          <span className="font-bold text-lg leading-tight">HLCC</span>
        </NavLink>

        <button
          onClick={() => setOpen((v) => !v)}
          className="text-2xl p-2 focus:outline-none hover:text-club-secondary transition-colors"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>

        {/* MOBILE MENU OVERLAY */}
        <div
          className={`
            absolute top-full left-0 w-full bg-club-primary shadow-xl border-t border-club-dark/10
            transition-all duration-300 ease-in-out origin-top
            ${open ? "scale-y-100 opacity-100 visible" : "scale-y-0 opacity-0 invisible"}
          `}
        >
          <nav>
            <ul className="flex flex-col gap-2 px-6 py-4 font-semibold text-sm">
              <MobileNavLink to="/" label="Home" setOpen={setOpen} />
              <MobileNavLink to="/leaderboard" label="Leaderboard" setOpen={setOpen} />
              <MobileNavLink to="/daily-chess-puzzle" label="Daily Puzzles" setOpen={setOpen} />
              <MobileNavLink to="/puzzle-marathon" label="Puzzle Marathon" setOpen={setOpen} />
              <MobileNavLink to="/contact" label="Contact" setOpen={setOpen} />
              
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
      <header className="relative z-50 hidden lg:flex w-full h-20 items-center justify-between bg-club-primary text-club-dark px-6 shadow-md">
        
        {/* LEFT: LOGO & TITLE */}
        <div className="flex items-center gap-3 shrink-0">
          <NavLink to="/" className="group flex items-center gap-3">
            <div className="relative">
              <img
                src="/logo_smaller-200x200.webp"
                alt="Club Logo"
                // Thay đổi: h-24 -> h-12 (nhỏ đi 1 nửa)
                className="h-16 w-16 rounded-full border-2 border-club-secondary object-cover shadow-sm transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold tracking-wide leading-none text-club-dark">
                    Hanoi Lucky
                </h1>
                <span className="text-xl font-semibold tracking-wider opacity-80">Chess Club</span>
            </div>
          </NavLink>
        </div>

        {/* CENTER: NAV ITEMS */}
        <div className="flex-1 flex justify-center px-4">
          <nav>
            <ul className="flex gap-1 xl:gap-4 font-semibold text-sm xl:text-base">
              <NavLinkItem to="/" label="Home" />
              <NavLinkItem to="/leaderboard" label="Leaderboard" />
              <NavLinkItem to="/daily-chess-puzzle" label="Puzzles" />
              <NavLinkItem to="/puzzle-marathon" label="Marathon" />
              <NavLinkItem to="/contact" label="Contact" />
            </ul>
          </nav>
        </div>

        {/* RIGHT: AUTH BUTTONS */}
        <div className="flex items-center justify-end shrink-0 min-w-[140px]">
           <AuthButtons />
        </div>

        {/* Decorative Bottom Line (Mỏng hơn) */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-club-secondary/50 to-transparent" />
      </header>
    </>
  );
}

/* ================= NAV ITEMS ================= */

function NavLinkItem({ to, label }: { to: string; label: string }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          [
            "inline-flex items-center justify-center",
            "px-3 py-2 rounded-md transition-all duration-200",
            "border border-transparent", 
            isActive
              ? "bg-club-dark/10 text-club-dark font-bold shadow-inner"
              : "hover:bg-club-secondary/10 hover:text-club-secondary font-medium",
          ].join(" ")
        }
      >
        {({ isActive }) => (
          <div className="flex items-center gap-2">
            {isActive ? (
              // Icon nhỏ hơn text-sm
              <FaChessQueen className="text-sm -rotate-12 text-club-secondary" />
            ) : (
              <FaChessPawn className="text-sm opacity-60 group-hover:opacity-100" />
            )}
            <span>{label}</span>
          </div>
        )}
      </NavLink>
    </li>
  );
}

function MobileNavLink({
  to,
  label,
  setOpen,
}: {
  to: string;
  label: string;
  setOpen: (open: boolean) => void;
}) {
  return (
    <li>
        <NavLink
        to={to}
        onClick={() => setOpen(false)}
        className={({ isActive }) => `
            flex items-center py-2 px-3 rounded-md transition-colors
            ${isActive ? 'bg-club-secondary/20 text-club-dark font-bold' : 'hover:bg-black/5'}
        `}
        >
        <FaChessPawn className="mr-3 text-sm text-club-secondary" />
        {label}
        </NavLink>
    </li>
  );
}

export default Header;