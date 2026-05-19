"use client";

import { useEffect, useState } from "react";

export function CountdownTimer() {
  const [time, setTime] = useState({ h: 8, m: 24, s: 53 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime((p) => {
        let { h, m, s } = p;
        s -= 1;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) { h = 12; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const Box = ({ v }: { v: number }) => (
    <span className="inline-grid place-items-center rounded-md bg-slate-deep text-background px-2 py-1 text-sm font-bold tabular-nums min-w-[2rem]">
      {String(v).padStart(2, "0")}
    </span>
  );
  return (
    <div className="flex items-center gap-1">
      <Box v={time.h} />
      <span className="font-bold text-slate-deep">:</span>
      <Box v={time.m} />
      <span className="font-bold text-slate-deep">:</span>
      <Box v={time.s} />
    </div>
  );
}
