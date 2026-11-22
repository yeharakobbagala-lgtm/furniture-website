"use client";

import React, { useRef, useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface LiquidGlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: "dark" | "light" | "warm";
  interactive?: boolean;
  className?: string;
  glow?: boolean;
  glowColor?: "warm" | "forest";
}

export default function LiquidGlassCard({
  children,
  variant = "dark",
  interactive = true,
  className = "",
  glow = true,
  glowColor = "warm",
  ...props
}: LiquidGlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const variantClass =
    variant === "dark"
      ? "liquid-glass-dark text-white"
      : variant === "warm"
      ? "bg-[#251E1A]/80 backdrop-blur-2xl border border-white/15 text-[#F8F7F0] shadow-floating"
      : "liquid-glass text-forest-deep";

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={interactive ? { y: -4, transition: { duration: 0.3 } } : undefined}
      className={`relative overflow-hidden rounded-[28px] sm:rounded-[34px] transition-all duration-500 ${variantClass} ${className}`}
      {...props}
    >
      {/* Ambient background light bleed */}
      {glow && (
        <div
          className={`absolute -inset-10 pointer-events-none opacity-40 transition-opacity duration-700 ${
            isHovered ? "opacity-75" : "opacity-40"
          } ${glowColor === "warm" ? "ambient-glow-warm" : "ambient-glow-forest"}`}
        />
      )}

      {/* Dynamic Specular Reflection (Moves with cursor like VisionOS glass) */}
      {interactive && isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 260px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.12), transparent 70%)`,
          }}
        />
      )}

      {/* Top rim specular edge highlight line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

      {/* Card Content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </motion.div>
  );
}
