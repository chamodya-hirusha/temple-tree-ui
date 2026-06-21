"use client";

import { useStore } from "@/context/StoreContext";

export function CountdownTimer() {
  const { flashSaleTime } = useStore();

  const Box = ({ v }: { v: number }) => (
    <span className="inline-grid place-items-center rounded-md bg-slate-deep text-background px-2 py-1 text-sm font-bold tabular-nums min-w-[2rem]">
      {String(v).padStart(2, "0")}
    </span>
  );

  return (
    <div className="flex items-center gap-1">
      <Box v={flashSaleTime.h} />
      <span className="font-bold text-slate-deep">:</span>
      <Box v={flashSaleTime.m} />
      <span className="font-bold text-slate-deep">:</span>
      <Box v={flashSaleTime.s} />
    </div>
  );
}
