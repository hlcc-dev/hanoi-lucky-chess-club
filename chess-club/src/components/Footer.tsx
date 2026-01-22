import { FaFacebook } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

function Footer() {
  return (
    <footer className="w-full bg-club-primary text-club-dark shadow-inner shadow-club-dark/20 py-6 ">
      <div
        className="
          mx-auto w-full
          px-4 py-4
          flex flex-col gap-3
          items-center text-center
        "
      >
        {/* Left side */}
        <div>
          <p className="text-xs sm:text-sm md:text-base ">
            &copy; {new Date().getFullYear()} Hanoi Lucky Chess Club
            <span className="hidden sm:inline"> · All rights reserved</span>
          </p>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-5">
          <a
            href="https://zalo.me/g/owpzpk136"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Zalo"
            className="hover:text-club-secondary transition-transform hover:scale-110 pr-5"
          >
            <SiZalo className="h-8 w-8" />
          </a>

          <a
            href="https://www.facebook.com/share/g/1C1m9d7TmJ/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-club-secondary transition-transform hover:scale-110"
          >
            <FaFacebook className="h-8 w-8" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;