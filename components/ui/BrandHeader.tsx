import Link from "next/link";
import Logo from "@/components/Logo";

interface BrandHeaderProps {
  /** URL to navigate to (default: "/") */
  href?: string;
  className?: string;
}

export default function BrandHeader({ href = "/", className = "" }: BrandHeaderProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 hover:opacity-80 transition-opacity ${className}`}
    >
      <Logo className="w-8 h-8 md:w-10 md:h-10 text-white" />
      <span className="text-xl md:text-2xl font-bold tracking-tighter font-headline text-white">
        C O L D C R A F T
      </span>
    </Link>
  );
}
