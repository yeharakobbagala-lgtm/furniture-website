"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ExploreButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export default function ExploreButton({
  href,
  label = "Explore more",
  className = "",
}: ExploreButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#F8F7F0] text-[#183323] text-sm font-semibold tracking-wide shadow-sm hover:bg-white hover:scale-105 active:scale-95 transition-all duration-200 group/btn ${className}`}
    >
      <span>{label}</span>
      <ArrowRight className="w-4 h-4 text-[#183323] group-hover/btn:translate-x-1 transition-transform" />
    </Link>
  );
}
