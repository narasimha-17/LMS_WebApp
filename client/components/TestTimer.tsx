"use client";

import { useEffect, useState } from "react";

export default function TestTimer({ minutes = 120, onTimeUp }: any) {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((sec) => sec - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="w-full text-center py-3 mb-6 bg-black text-white rounded-lg shadow-lg font-bold text-xl tracking-wide">
      Time Left: {formatTime(secondsLeft)}
    </div>
  );
}
