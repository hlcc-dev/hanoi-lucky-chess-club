import { FaFacebook } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

function Footer() {
  return (
    <footer className="w-full bg-club-primary text-club-dark">
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
            href="https://zalo.me/g/owpzpk136"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Zalo"
            className="hover:text-club-secondary transition-transform hover:scale-110"
          >
            <SiZalo className="h-5 w-5 md:h-6 md:w-6" />
          </a>

          <a
            href="https://www.facebook.com/share/17ovBRMUDA/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
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