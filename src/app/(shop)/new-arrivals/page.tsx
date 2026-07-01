import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/user/ProductCard";

export default function NewArrivalsPage() {
  const newArrivals = PRODUCTS.filter(p => p.badge === "New").slice(0, 8);
  if (newArrivals.length === 0) {
    // Fallback if no badge="New"
    newArrivals.push(...PRODUCTS.slice(0, 8));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 min-h-[60vh]">
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground mb-4">New Arrivals</h1>
        <p className="text-muted-foreground max-w-2xl">Discover our latest collection of premium Ceylon heritage products, freshly added to our catalog.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {newArrivals.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
