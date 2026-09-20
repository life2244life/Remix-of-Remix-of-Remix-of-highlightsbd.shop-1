import { useState } from "react";
import FrequentlyBoughtTogether from "@/components/crosssell/FrequentlyBoughtTogether";
import CustomersAlsoBought from "@/components/crosssell/CustomersAlsoBought";

const CrossSellDemo = () => {
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
        <button
          onClick={() => setLoading((v) => !v)}
          className="rounded-[11px] border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted"
        >
          Toggle carousel loading
        </button>
      </div>
      <FrequentlyBoughtTogether />
      <CustomersAlsoBought loading={loading} />
    </div>
  );
};

export default CrossSellDemo;