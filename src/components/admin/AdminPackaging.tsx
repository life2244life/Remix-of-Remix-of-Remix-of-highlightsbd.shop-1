import { useMemo, useState } from 'react';
import { useOrders } from '@/hooks/useSupabase';
import { Package } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const AdminPackaging = () => {
  const { data: orders = [] } = useOrders();
  const [selected, setSelected] = useState<{ product: string; size: string } | null>(null);

  const processingOrders = useMemo(
    () => orders.filter((o: any) => o.status === 'Processing'),
    [orders]
  );

  const processingSummary = useMemo(() => {
    const summary: Record<string, Record<string, number>> = {};
    processingOrders.forEach((o: any) => {
      const items = Array.isArray(o.items) ? o.items : [];
      items.forEach((item: any) => {
        const name = item.name || 'Unknown';
        const size = item.size || 'N/A';
        const qty = item.quantity || 1;
        if (!summary[name]) summary[name] = {};
        summary[name][size] = (summary[name][size] || 0) + qty;
      });
    });
    return summary;
  }, [processingOrders]);

  const matchingOrders = useMemo(() => {
    if (!selected) return [];
    return processingOrders
      .map((o: any) => {
        const items = Array.isArray(o.items) ? o.items : [];
        const matched = items.filter(
          (it: any) =>
            (it.name || 'Unknown') === selected.product &&
            (it.size || 'N/A') === selected.size
        );
        return matched.length ? { order: o, matched } : null;
      })
      .filter(Boolean) as { order: any; matched: any[] }[];
  }, [selected, processingOrders]);

  const processingOrderCount = processingOrders.length;
  const totalPcs = Object.values(processingSummary).reduce(
    (s, sizes) => s + Object.values(sizes).reduce((a, b) => a + b, 0),
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-light tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
          Packaging Summary
        </h1>
        <p className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">
          Processing orders — products & sizes to pack
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-border rounded-xl p-4 bg-gradient-to-br from-primary/5 to-transparent">
          <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-semibold">Processing Orders</p>
          <p className="text-2xl font-bold tracking-tight mt-1">{processingOrderCount}</p>
        </div>
        <div className="border border-border rounded-xl p-4 bg-gradient-to-br from-[#22C5A0]/5 to-transparent">
          <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-semibold">Total Pieces to Pack</p>
          <p className="text-2xl font-bold tracking-tight mt-1">{totalPcs} <span className="text-xs font-normal text-muted-foreground">pcs</span></p>
        </div>
      </div>

      {/* Products grid */}
      <div className="border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Package size={16} className="text-primary" />
          <span className="text-sm font-medium">📦 Products to Pack</span>
        </div>
        {Object.keys(processingSummary).length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">কোনো processing order নেই 🎉</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(processingSummary).map(([productName, sizes]) => {
              const totalQty = Object.values(sizes).reduce((s, q) => s + q, 0);
              return (
                <div key={productName} className="border border-border rounded-lg p-3 bg-gradient-to-br from-primary/5 to-transparent">
                  <h4 className="text-sm font-semibold truncate mb-2" title={productName}>{productName}</h4>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {Object.entries(sizes).sort(([a], [b]) => {
                      const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];
                      return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
                    }).map(([size, qty]) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelected({ product: productName, size })}
                        className="inline-flex items-center gap-1 bg-primary/10 hover:bg-primary/25 transition-colors text-primary text-xs font-bold px-2 py-1 rounded cursor-pointer"
                        title="Click to view customers"
                      >
                        {size}: <span className="text-foreground">{qty}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground">Total: {totalQty} pcs</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base">
              {selected?.product} — Size <span className="text-primary">{selected?.size}</span>
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              {matchingOrders.length} processing order{matchingOrders.length !== 1 ? 's' : ''} •{' '}
              {matchingOrders.reduce((s, m) => s + m.matched.reduce((a, b) => a + (b.quantity || 1), 0), 0)} pcs
            </p>
          </DialogHeader>

          <div className="space-y-3 mt-2">
            {matchingOrders.map(({ order, matched }) => {
              const qty = matched.reduce((a, b) => a + (b.quantity || 1), 0);
              const color = matched.map((m) => m.color).filter(Boolean).join(', ');
              return (
                <div key={order.id} className="border border-border rounded-lg p-3 text-sm space-y-1">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-semibold">{order.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{order.customer_phone}</p>
                      {(order as any).customer_email && <p className="text-xs text-muted-foreground">{(order as any).customer_email}</p>}
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded">
                        Qty: {qty}
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    📍 {order.customer_address}, {order.customer_city}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                    <span>Order: <span className="font-mono text-foreground">#{String(order.id).slice(0, 8)}</span></span>
                    <span>Total: <span className="text-foreground font-semibold">৳{order.total}</span></span>
                    <span>Payment: {order.payment_method}</span>
                    {color && <span>Color: {color}</span>}
                    {order.tracking_code && <span>Tracking: {order.tracking_code}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPackaging;
