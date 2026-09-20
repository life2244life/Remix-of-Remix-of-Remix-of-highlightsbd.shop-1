import { Check, Loader2, Layout } from 'lucide-react';
import { toast } from 'sonner';
import { useStoreSettings, useUpdateStoreSetting } from '@/hooks/useSupabase';
import { TEMPLATES } from '@/lib/templates';
import { resolveTemplateKey } from '@/lib/activeTemplate';

const LAYOUT_LABEL: Record<string, string> = {
  classic: 'Editorial slider hero + full sections',
  modern: 'Split minimal hero + slider-first',
  noir: 'Dark full-bleed hero + editorial blocks',
  boutique: 'Magazine hero + 2-column collections',
  street: 'Oversized type + asymmetric grid',
};

const AdminTemplates = () => {
  const { data: settings } = useStoreSettings();
  const updateSetting = useUpdateStoreSetting();
  const activeKey = resolveTemplateKey(settings);

  const handleSelect = async (key: string) => {
    if (key === activeKey || updateSetting.isPending) return;
    try {
      await updateSetting.mutateAsync({ key: 'active_template', value: key });
      toast.success('Template updated — your store now uses this look.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update template');
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight">Store Templates</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose a design template for your customer-facing store. Changes apply instantly to all visitors.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {TEMPLATES.map((preset) => {
          const isActive = preset.key === activeKey;
          return (
            <button
              key={preset.key}
              onClick={() => handleSelect(preset.key)}
              disabled={updateSetting.isPending}
              className={`group relative text-left rounded-xl border-2 p-4 transition-all ${
                isActive
                  ? 'border-foreground shadow-md'
                  : 'border-border hover:border-foreground/40'
              }`}
            >
              {isActive && (
                <span className="absolute top-3 right-3 inline-flex items-center justify-center w-6 h-6 rounded-full bg-foreground text-background">
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </span>
              )}

              {/* Swatch preview */}
              <div className="flex gap-1.5 mb-4 h-16 rounded-lg overflow-hidden">
                {preset.swatch.map((c, i) => (
                  <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm tracking-tight">{preset.name}</h3>
                {isActive && (
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{preset.description}</p>
              <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <Layout className="w-3 h-3" /> {LAYOUT_LABEL[preset.homeLayout]}
              </p>
            </button>
          );
        })}
      </div>

      {updateSetting.isPending && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…
        </p>
      )}
    </div>
  );
};

export default AdminTemplates;
