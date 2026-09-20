import { HeaderCat, Sub, badgeClasses } from './navTypes';
import { Smartphone, Monitor } from 'lucide-react';

interface Props {
  cat: HeaderCat;
  subs: Sub[];
}

const Badge = ({ badge }: { badge?: string | null }) =>
  badge ? (
    <span className={`ml-1 text-[8px] px-1 rounded border ${badgeClasses[badge] || 'bg-muted'}`}>{badge}</span>
  ) : null;

const MegaMenuPreview = ({ cat, subs }: Props) => {
  const cols = cat.menu_type === 'mega' ? (cat.mega_columns || 3) : 1;
  const visibleSubs = subs.filter(s => s.status !== 'hidden');

  return (
    <div className="space-y-4">
      {/* Desktop */}
      <div>
        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1"><Monitor className="h-3 w-3" /> Desktop</p>
        <div className="border border-border rounded bg-background p-3">
          <p className="text-xs font-medium mb-2 flex items-center">{cat.name}<Badge badge={cat.badge} /></p>
          {cat.menu_type === 'mega' ? (
            <div className="flex gap-3">
              <div className={`grid gap-x-4 gap-y-1 flex-1`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
                {visibleSubs.length === 0 && <span className="text-[10px] text-muted-foreground">No sub-categories</span>}
                {visibleSubs.map(s => (
                  <span key={s.id} className="text-[10px] text-muted-foreground truncate flex items-center">{s.name}<Badge badge={s.badge} /></span>
                ))}
              </div>
              {cat.banner_desktop && (
                <div className="w-28 shrink-0">
                  <img src={cat.banner_desktop} alt="" className="w-full h-16 object-cover rounded" />
                  {cat.cta_text && <span className="block mt-1 text-center text-[9px] border border-border rounded px-1 py-0.5">{cat.cta_text}</span>}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {visibleSubs.length === 0 && <span className="text-[10px] text-muted-foreground">No sub-categories</span>}
              {visibleSubs.map(s => (
                <span key={s.id} className="text-[10px] text-muted-foreground flex items-center">{s.name}<Badge badge={s.badge} /></span>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Mobile */}
      <div>
        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1"><Smartphone className="h-3 w-3" /> Mobile</p>
        <div className="border border-border rounded bg-background p-3 max-w-[220px]">
          {cat.banner_mobile && <img src={cat.banner_mobile} alt="" className="w-full h-16 object-cover rounded mb-2" />}
          <p className="text-xs font-medium mb-1 flex items-center">{cat.name}<Badge badge={cat.badge} /></p>
          <div className="pl-3 border-l border-border flex flex-col gap-1">
            {visibleSubs.length === 0 && <span className="text-[10px] text-muted-foreground">No sub-categories</span>}
            {visibleSubs.map(s => (
              <span key={s.id} className="text-[10px] text-muted-foreground flex items-center">{s.name}<Badge badge={s.badge} /></span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenuPreview;