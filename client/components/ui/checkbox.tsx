import React from "react";

export function Checkbox({ checked, onCheckedChange, disabled }: any) {
  return (
    <input
      type="checkbox"
      disabled={disabled}
      checked={checked}
      onChange={() => onCheckedChange(!checked)}
      className={`h-4 w-4 rounded border-gray-400 focus:ring-blue-500 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    />
  );
}
