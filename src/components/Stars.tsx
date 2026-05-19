import { Star } from "lucide-react";

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.round(rating)
              ? "fill-[oklch(0.78_0.16_80)] text-[oklch(0.78_0.16_80)]"
              : "fill-muted text-muted-foreground/40"
          }
        />
      ))}
    </div>
  );
}
