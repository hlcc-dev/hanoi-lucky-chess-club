import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { FaChessPawn, FaChessQueen } from "react-icons/fa6";
import { useState } from "react";
import AuthButtons from "./Button/AuthButtons";

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}
      <header className="relative z-50 w-full h-20 px-4 bg-club-primary text-club-dark flex items-center justify-between md:hidden">
        <img
          src="/logo.png"
          alt="Club Logo"
          className="h-14 w-14 rounded-full border-2 border-club-secondary"
        />

        <button
          onClick={() => setOpen((v) => !v)}
          className="text-3xl"
          aria-label="Toggle menu"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`
          relative w-full bg-club-primary
          transition-all duration-300 ease-in-out
          ${open ? "max-h-125 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}
        `}
      >
        <ol className="flex flex-col gap-4 px-6 py-6 font-semibold">
          <MobileNavLink to="/" label="Home" setOpen={setOpen} />
          <MobileNavLink to="/leaderboard" label="Leaderboard" setOpen={setOpen} />
          <MobileNavLink to="/chess-puzzles" label="Daily Puzzles" setOpen={setOpen} />
          <MobileNavLink to="/members" label="Members" setOpen={setOpen} />
          <MobileNavLink to="/contact" label="Contact" setOpen={setOpen} />

          <AuthButtons mobile onAction={() => setOpen(false)} />
        </ol>
      </div>

      {/* ================= DESKTOP HEADER ================= */}
      <header className="relative z-50 hidden md:grid h-40 grid-cols-[260px_1fr_260px] grid-rows-2 items-center bg-club-primary text-club-dark px-6">
        {/* LEFT — LOGO */}
        <div className="row-span-2 flex items-center gap-4">
          <div className="relative">
            <img
              src="/logo.png"
              alt="Club Logo"
              className="h-24 w-24 rounded-full border-4 border-club-secondary"
            />
            <FaChessPawn className="absolute -bottom-2 -right-2 text-2xl text-club-secondary" />
          </div>
        </div>

        {/* CENTER — TITLE */}
        <div className="col-start-2 row-start-1 flex justify-center items-center">
          <h1 className="text-4xl font-bold tracking-wide whitespace-nowrap">
            Hanoi Lucky Chess Club
          </h1>
        </div>

        {/* CENTER — NAV */}
        <div className="col-start-2 row-start-2 flex justify-center">
          <ol className="flex gap-6 font-semibold">
            <NavLinkItem to="/" label="Home" />
            <NavLinkItem to="/leaderboard" label="Leaderboard" />
            <NavLinkItem to="/chess-puzzles" label="Daily Puzzles" />
            <NavLinkItem to="/members" label="Members" />
            <NavLinkItem to="/contact" label="Contact" />
          </ol>
        </div>

        {/* RIGHT — AUTH */}
        <div className="row-span-2 flex justify-end items-center">
          <div className="w-55 flex justify-end">
            <AuthButtons />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-club-secondary to-transparent" />
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
            "px-4 py-2 rounded-md text-base font-medium",
            "border border-club-secondary",
            "transition-colors duration-200",
            isActive
              ? "bg-club-dark/20 text-club-dark"
              : "hover:bg-club-secondary/10 hover:text-club-secondary",
          ].join(" ")
        }
      >
        {({ isActive }) => (
          <>
            {isActive ? (
              <FaChessQueen className="mr-2 -rotate-45 transition-transform duration-200" />
            ) : (
              <FaChessPawn className="mr-2 transition-transform" />
            )}
            {label}
          </>
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
    <NavLink
      to={to}
      onClick={() => setOpen(false)}
      className="flex items-center py-2 text-lg border-b border-club-secondary"
    >
      <FaChessPawn className="mr-2" />
      {label}
    </NavLink>
  );
}

export default Header;