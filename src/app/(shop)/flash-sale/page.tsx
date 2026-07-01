import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/user/ProductCard";
import { CountdownTimer } from "@/components/user/CountdownTimer";

export default function FlashSalePage() {
  const flashSaleProducts = PRODUCTS.filter(p => p.flashSale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 min-h-[60vh]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-serif font-bold tracking-tight text-brand">Flash Sale</h1>
        <div className="flex items-center gap-3 bg-brand/5 px-4 py-2 rounded-xl">
          <span className="text-sm font-semibold text-brand">Ends in</span>
          <CountdownTimer />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {flashSaleProducts.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
