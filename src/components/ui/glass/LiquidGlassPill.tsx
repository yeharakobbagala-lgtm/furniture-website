"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface LiquidGlassPillProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  active?: boolean;
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function LiquidGlassPill({
  children,
  active = false,
  variant = "dark",
  size = "md",
  icon,
  className = "",
  onClick,
  ...props
}: LiquidGlassPillProps) {
  const sizeClasses = {
    sm: "px-3 py-1 text-xs gap-1.5",
    md: "px-4 py-1.5 text-xs sm:text-sm gap-2",
    lg: "px-6 py-2.5 text-sm sm:text-base gap-2.5",
  };

  const activeClasses = active
    ? "bg-[#B85232] text-white border-white/40 shadow-card font-semibold"
    : variant === "dark"
    ? "liquid-glass-pill-dark text-white/85 hover:text-white hover:bg-white/15"
    : "liquid-glass-pill text-forest-deep hover:text-forest-deep hover:bg-white/90";

  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full font-heading font-medium tracking-wide transition-all duration-300 ${sizeClasses[size]} ${activeClasses} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
}
