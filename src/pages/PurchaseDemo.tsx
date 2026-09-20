import { useState } from "react";
import PurchaseActions from "@/components/purchase/PurchaseActions";
import { mockPurchaseProduct } from "@/components/purchase/mockData";

const PurchaseDemo = () => {
  const [loading, setLoading] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);

  const product = outOfStock ? { ...mockPurchaseProduct, stock: 0 } : mockPurchaseProduct;

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-0">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Purchase Actions Demo</p>
        <h1 className="mt-1 text-3xl font-medium text-foreground lg:text-4xl" style={{ fontFamily: "'Playfair Display', serif" }}>
          {mockPurchaseProduct.name}
        </h1>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setLoading((v) => !v)}
            className="rounded-[11px] border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted"
          >
            Toggle loading
          </button>
          <button
            onClick={() => setOutOfStock((v) => !v)}
            className="rounded-[11px] border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted"
          >
            Toggle out of stock
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="aspect-[3/4] rounded-[14px] bg-muted" />
          <PurchaseActions product={product} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default PurchaseDemo;