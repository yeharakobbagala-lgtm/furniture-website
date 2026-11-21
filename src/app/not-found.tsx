import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sage-light flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full bg-ivory-warm rounded-3xl border border-borderSage p-8 sm:p-12 text-center space-y-4 shadow-soft">
        <span className="text-xs uppercase tracking-widest font-bold text-terracotta">
          404 — PAGE NOT FOUND
        </span>
        <h1 className="text-3xl font-heading font-extrabold text-forest-deep">
          This piece cannot be located
        </h1>
        <p className="text-sm text-forest-muted leading-relaxed">
          The requested furniture piece, room layout, or editorial story may have been relocated.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-dark hover:bg-forest-deep text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-soft"
          >
            <Home className="w-4 h-4" /> Return to Digital Showroom
          </Link>
        </div>
      </div>
    </div>
  );
}
