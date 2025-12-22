import { FaFacebook } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

function Footer() {
  return (
    <footer className="bg-club-primary text-club-dark">
      <div
        className="
          mx-auto w-full
          px-4 py-4
          flex flex-col gap-3
          items-center text-center
          sm:flex-row sm:items-center sm:justify-between sm:text-left
        "
      >
        {/* Left side */}
        <p className="text-xs sm:text-sm md:text-base">
          &copy; {new Date().getFullYear()} Hanoi Lucky Chess Club
          <span className="hidden sm:inline"> · All rights reserved</span>
        </p>

        {/* Right side */}
        <div className="flex items-center gap-5">
          <a
            href="#"
            aria-label="Zalo"
            className="hover:text-club-secondary transition-transform hover:scale-110"
          >
            <SiZalo className="h-5 w-5 md:h-6 md:w-6" />
          </a>

          <a
            href="#"
            aria-label="Facebook"
            className="hover:text-club-secondary transition-transform hover:scale-110"
          >
            <FaFacebook className="h-5 w-5 md:h-6 md:w-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;