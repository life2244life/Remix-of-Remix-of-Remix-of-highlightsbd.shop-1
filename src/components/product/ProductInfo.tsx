import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getProductInfo } from "@/data/productInfo";
import ProductReviews from "@/components/ProductReviews";
import { useProductReviews } from "@/hooks/useSupabase";

interface ProductInfoProps {
  product: any;
  className?: string;
}

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="space-y-2">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2">
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const parseSizeChart = (sc: any): any[] => {
  if (Array.isArray(sc)) return sc;
  if (typeof sc === "string") {
    try {
      const p = JSON.parse(sc);
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }
  return [];
};

const ProductInfo = ({ product, className }: ProductInfoProps) => {
  const info = getProductInfo(product?.product_info);
  const { data: reviews } = useProductReviews(product?.id);
  const reviewCount = reviews?.length ?? 0;

  const specColumns = info.specification.columns.filter((c) => c.trim());
  const specRows = info.specification.rows.filter((r) =>
    r && typeof r === "object" && specColumns.some((c) => String(r[c] ?? "").trim())
  );
  const features = info.features.items.filter((s) => s.trim());
  const material = info.material.items.filter((s) => s.trim());
  const usage = info.usage.items.filter((s) => s.trim());
  const shipping = info.shipping.items.filter((s) => s.trim());
  const returnPolicy = info.returnPolicy.items.filter((s) => s.trim());
  const faq = info.faq.items.filter((f) => f.question.trim() || f.answer.trim());
  const sizeChartRows = parseSizeChart(product?.size_chart).filter(
    (r) => r && typeof r === "object" && Object.values(r).some((v) => String(v ?? "").trim())
  );
  const sizeChartCols = sizeChartRows.length > 0 ? Object.keys(sizeChartRows[0]) : [];

  const showSpec = info.specification.enabled && specRows.length > 0;
  const showFeatures = info.features.enabled && features.length > 0;
  const showMaterial = info.material.enabled && material.length > 0;
  const showUsage = info.usage.enabled && usage.length > 0;
  const showShipping = info.shipping.enabled && shipping.length > 0;
  const showReturnPolicy = info.returnPolicy.enabled && returnPolicy.length > 0;
  const showFaq = info.faq.enabled && faq.length > 0;
  const showSizeChart = info.sizeChart.enabled && sizeChartRows.length > 0;
  const showDescription = info.description.enabled && !!product?.description;

  const dataTable = (cols: string[], rows: any[]) => (
    <div className="overflow-x-auto">
      <table className="w-full text-xs sm:text-sm border border-border">
        <thead>
          <tr className="bg-muted/30">
            {cols.map((c) => (
              <th key={c} className="px-3 py-2 text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/10">
              {cols.map((c) => (
                <td key={c} className="px-3 py-2 text-foreground">{row[c]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const tabs: { id: string; label: string; content: React.ReactNode }[] = [];

  if (showDescription) tabs.push({
    id: "description",
    label: "Description",
    content: (
      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
    ),
  });
  if (showSpec) tabs.push({ id: "specification", label: "Specification", content: dataTable(specColumns, specRows) });
  if (showSizeChart) tabs.push({ id: "size-chart", label: "Size Chart", content: dataTable(sizeChartCols, sizeChartRows) });
  const reviewsTab = { id: "reviews", label: `Reviews (${reviewCount})`, content: <ProductReviews productId={product.id} /> };
  if (showSizeChart) tabs.push(reviewsTab);
  if (showMaterial) tabs.push({ id: "material", label: "Fabric & Materials", content: <div className="text-sm text-muted-foreground"><BulletList items={material} /></div> });
  if (showFeatures) tabs.push({ id: "features", label: "Features", content: <div className="text-sm text-muted-foreground"><BulletList items={features} /></div> });
  if (showUsage) tabs.push({ id: "care", label: "Care Instructions", content: <div className="text-sm text-muted-foreground"><BulletList items={usage} /></div> });
  if (showShipping) tabs.push({ id: "shipping", label: "Shipping", content: <div className="text-sm text-muted-foreground"><BulletList items={shipping} /></div> });
  if (showReturnPolicy) tabs.push({ id: "return-policy", label: "Return Policy", content: <div className="text-sm text-muted-foreground"><BulletList items={returnPolicy} /></div> });
  if (showFaq) tabs.push({
    id: "faq",
    label: "FAQ",
    content: (
      <Accordion type="single" collapsible>
        {faq.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-sm text-foreground text-left">{item.question}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground whitespace-pre-line">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    ),
  });
  if (!showSizeChart) tabs.push(reviewsTab);

  const [active, setActive] = useState(tabs[0]?.id);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent).detail as string;
      if (tabs.some((t) => t.id === id)) {
        setActive(id);
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    window.addEventListener("open-product-tab", handler as EventListener);
    return () => window.removeEventListener("open-product-tab", handler as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (tabs.length <= 1) return null;

  return (
    <section ref={sectionRef} id="reviews" className={cn("w-full", className)}>
      <div className="border-b border-border overflow-x-auto lg:overflow-visible no-scrollbar">
        <div className="flex min-w-max gap-1 lg:w-full lg:min-w-0 lg:justify-between lg:gap-0" role="tablist" aria-label="Product information">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={active === t.id}
              onClick={() => setActive(t.id)}
              className={cn(
                "relative shrink-0 whitespace-nowrap px-3 sm:px-4 lg:px-2 xl:px-3 py-3 text-[11px] sm:text-xs lg:text-[11px] xl:text-xs uppercase tracking-[0.12em] lg:tracking-[0.08em] xl:tracking-[0.12em] font-medium transition-colors border-b-2 -mb-px",
                active === t.id
                  ? "text-foreground border-foreground"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-6">
        {tabs.map((t) => (
          <div
            key={t.id}
            role="tabpanel"
            hidden={active !== t.id}
            className={cn(
              "transition-opacity duration-300",
              active === t.id ? "opacity-100 animate-in fade-in-0" : "opacity-0"
            )}
          >
            {active === t.id && t.content}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductInfo;
