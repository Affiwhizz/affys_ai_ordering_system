import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

/**
 * Logo — brand image only.
 *
 * The "A taste of home" tagline is now baked into the logo PNG itself,
 * so the component just renders the image — no separate text.
 *
 * Expects the logo at /logo.png (i.e. frontend/public/logo.png).
 * alt is intentionally empty; the parent Link's aria-label carries the
 * accessible name.
 */
export default function Logo({ className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Affy's — home"
      className={`group inline-flex items-center ${className}`}
    >
      <Image
        src="/logo.png"
        alt=""
        width={240}
        height={240}
        priority
        className="h-[60px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04] md:h-[72px]"
      />
    </Link>
  );
}
