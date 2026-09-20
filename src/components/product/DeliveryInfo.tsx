import { Truck, PackageCheck, RotateCcw, ShieldCheck, CalendarClock } from 'lucide-react';
import type { DeliveryInfoData } from '@/data/productInfo';

/** Returns a human "DD–DD Mon" estimated delivery window from today. */
const estimatedWindow = (minDays: number, maxDays: number) => {
  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const start = new Date(); start.setDate(start.getDate() + minDays);
  const end = new Date(); end.setDate(end.getDate() + maxDays);
  return `${fmt(start)} – ${fmt(end)}`;
};

const DeliveryInfo = ({ delivery }: { delivery: DeliveryInfoData }) => {
  if (!delivery.enabled) return null;

  const rows = [
    delivery.codAvailable && { icon: Truck, label: 'Cash on Delivery available' },
    (delivery.dhakaTime || delivery.outsideTime) && {
      icon: PackageCheck,
      label: [
        delivery.dhakaTime && `Dhaka ${delivery.dhakaTime}`,
        delivery.outsideTime && `Outside ${delivery.outsideTime}`,
      ].filter(Boolean).join(' · '),
    },
    delivery.returnText && { icon: RotateCcw, label: delivery.returnText },
    delivery.securePayment && { icon: ShieldCheck, label: '100% secure payment' },
  ].filter(Boolean) as { icon: typeof Truck; label: string }[];

  return (
    <div className="mb-4 sm:mb-6 rounded-sm border border-border bg-muted/20 p-3 sm:p-4 space-y-2.5">
      <div className="flex items-center gap-2 pb-2.5 border-b border-border">
        <CalendarClock size={15} className="shrink-0 text-foreground" />
        <p className="text-[11px] sm:text-xs text-muted-foreground">
          Order today, receive between{' '}
          <span className="font-medium text-foreground">{estimatedWindow(delivery.estMinDays, delivery.estMaxDays)}</span>
        </p>
      </div>
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-2">
          <r.icon size={14} className="shrink-0 text-foreground" />
          <span className="text-[11px] sm:text-xs text-muted-foreground">{r.label}</span>
        </div>
      ))}
    </div>
  );
};

export default DeliveryInfo;
