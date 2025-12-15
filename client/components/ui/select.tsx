"use client";

import React, { useState } from "react";

export function Select({ value, onValueChange, children }: any) {
  return (
    <div className="relative w-full">
      {React.cloneElement(children, { value, onValueChange })}
    </div>
  );
}

export function SelectTrigger({ className = "", value, placeholder, onClick }: any) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`border border-gray-300 w-full text-left px-3 py-2 rounded-md bg-white ${className}`}
    >
      {value ? value : <span className="text-gray-500">{placeholder}</span>}
    </button>
  );
}

export function SelectContent({ options, onSelect }: any) {
  return (
    <div className="absolute mt-1 w-full bg-white shadow-md border rounded-md z-50">
      {options.map((opt: any) => (
        <div
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
        >
          {opt.label}
        </div>
      ))}
    </div>
  );
}

export function SelectItem({ value, children }: any) {
  return <>{children}</>;
}

export function SelectValue({ placeholder, value }: any) {
  return <>{value || placeholder}</>;
}
