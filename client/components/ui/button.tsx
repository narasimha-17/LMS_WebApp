import React from "react";

export function Button({ className = "", children, variant = "primary", ...props }: any) {
  const base =
    "px-4 py-2 rounded-md text-sm font-medium transition-all active:scale-95";

  const variants: any = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      {...props}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
