import { FaFacebook } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

function Footer() {
  return (
    <footer className="w-full bg-club-primary text-club-dark mt-4 shadow-inner shadow-club-dark/20  ">
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
        <div>
          <p className="text-xs sm:text-sm md:text-base ">
            &copy; {new Date().getFullYear()} Hanoi Lucky Chess Club
            <span className="hidden sm:inline"> · All rights reserved</span>
          </p>
          <a
            href="https://www.ahmedozdogan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <p className="text-xs sm:text-sm md:text-base  ">
              Designed & Developed by <span className="underline hover:text-white ">Ahmed Ozdogan</span>
            </p>
          </a>
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
            <SiZalo className="h-6 w-6 md:h-9 md:w-9" />
          </a>

          <a
            href="https://www.facebook.com/share/17ovBRMUDA/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-club-secondary transition-transform hover:scale-110"
          >
            <FaFacebook className="h-6 w-6 md:h-9 md:w-9" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;