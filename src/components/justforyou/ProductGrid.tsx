import ProductCard from "./ProductCard";
import { RecProduct } from "./mockData";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  products: RecProduct[];
  loading?: boolean;
  skeletonCount?: number;
  onQuickView: (p: RecProduct) => void;
}

const gridClass =
  "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

const CardSkeleton = () => (
  <div>
    <Skeleton className="aspect-[3/4] w-full rounded-[14px]" />
    <Skeleton className="mt-3 h-3 w-1/3" />
    <Skeleton className="mt-2 h-4 w-3/4" />
    <Skeleton className="mt-2 h-4 w-1/2" />
  </div>
);

const ProductGrid = ({ products, loading = false, skeletonCount = 10, onQuickView }: ProductGridProps) => {
  if (loading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: skeletonCount }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className={gridClass}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
      ))}
    </div>
  );
};

export default ProductGrid;