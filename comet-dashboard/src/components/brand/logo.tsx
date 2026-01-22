import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function Logo({ className, size = "md" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeClasses[size], className)}
      aria-label="ContextFort Logo"
    >
      {/* Shield outline */}
      <path
        d="M12 2L4 6V11C4 15.55 7.16 19.74 12 21C16.84 19.74 20 15.55 20 11V6L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Inner shield fill with neon green */}
      <path
        d="M12 3.5L5.5 6.75V11C5.5 14.95 8.2 18.6 12 19.75C15.8 18.6 18.5 14.95 18.5 11V6.75L12 3.5Z"
        className="fill-primary"
      />
      {/* Lock symbol in center */}
      <rect
        x="10"
        y="10"
        width="4"
        height="5"
        rx="0.5"
        className="fill-background"
      />
      <path
        d="M10.5 10V9C10.5 8.17 11.17 7.5 12 7.5C12.83 7.5 13.5 8.17 13.5 9V10"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        className="stroke-background"
      />
    </svg>
  );
}

export function LogoText({ className }: { className?: string }) {
  return (
    <span className={cn("font-space-grotesk font-bold text-xl tracking-tighter", className)}>
      ContextFort
    </span>
  );
}
