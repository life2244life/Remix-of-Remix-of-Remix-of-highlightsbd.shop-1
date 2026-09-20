import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface StockStatusProps {
  stock: number;
  lowStockThreshold: number;
}

const StockStatus = ({ stock, lowStockThreshold }: StockStatusProps) => {
  if (stock <= 0) {
    return (
      <div className="inline-flex items-center gap-2 rounded-[11px] bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground">
        <XCircle className="h-4 w-4" />
        Out of stock
      </div>
    );
  }

  const low = stock <= lowStockThreshold;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-[11px] px-3 py-1.5 text-sm font-medium ${
        low ? "bg-destructive/10 text-destructive" : "bg-foreground/5 text-foreground"
      }`}
    >
      {low ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
      {low ? (
        <span>
          Low stock — only <strong>{stock}</strong> left
        </span>
      ) : (
        <span>In stock</span>
      )}
    </div>
  );
};

export default StockStatus;