import { useState, useRef, useEffect } from 'react';
import { useHomepageSections, useUpdateHomepageSectionConfig } from '@/hooks/useSupabase';
import { uploadImage } from '@/lib/upload';
import {
  HeroSlide, makeHeroSlide, parseHeroSlides,
} from '@/lib/heroSlides';
import {
  Plus, Trash2, Copy, Save, Loader2, Eye, EyeOff, GripVertical,
  ChevronUp, ChevronDown, Monitor, Smartphone, Info, ImagePlus, X,
} from 'lucide-react';
import { toast } from 'sonner';
import ImageCropDialog from './ImageCropDialog';
import LinkPicker from './LinkPicker';
import { guardLinks } from '@/lib/linkValidation';

const SlideImageUpload = ({ value, onChange, kind }: {
  value: string; onChange: (url: string) => void; kind: 'desktop' | 'mobile';
}) => {
  const [uploading, setUploading] = useState(false);
  const [pending, setPending] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const aspect = kind === 'desktop' ? 16 / 9 : 9 / 16;

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Image file only'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('Max 10MB!'); return; }
    setPending(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleCropped = async (blob: Blob) => {
    setPending(null);
    setUploading(true);
    try {
      const f = new File([blob], `hero-${kind}-${Date.now()}.webp`, { type: 'image/webp' });
      const url = await uploadImage(f, `homepage/hero-${kind}`);
      onChange(url);
      toast.success('Image uploaded ✓');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally { setUploading(false); }
  };

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
      {pending && (
        <ImageCropDialog
          file={pending}
          aspectRatio={aspect}
          safeAreaPct={{ w: 0.6, h: 0.7 }}
          onCancel={() => setPending(null)}
          onConfirm={handleCropped}
        />
      )}
      {value ? (
        <div className="relative inline-block">
          <div className="relative overflow-hidden border border-border" style={{ width: kind === 'desktop' ? 200 : 110, aspectRatio: aspect }}>
            <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <button onClick={() => onChange('')} type="button"
            className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground">
            <X size={11} />
          </button>
          <button onClick={() => inputRef.current?.click()} type="button"
            className="mt-1 block text-[10px] text-muted-foreground underline">Replace</button>
        </div>
      ) : (
        <button onClick={() => inputRef.current?.click()} disabled={uploading} type="button"
          className="flex flex-col items-center justify-center gap-1 border border-dashed border-border text-muted-foreground hover:bg-muted"
          style={{ width: kind === 'desktop' ? 200 : 110, aspectRatio: aspect }}>
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
          <span className="text-[9px] uppercase tracking-wider">{kind === 'desktop' ? '1920×1080' : '1080×1920'}</span>
        </button>
      )}
    </div>
  );
};

const SlidePreview = ({ slide, device }: { slide: HeroSlide; device: 'desktop' | 'mobile' }) => {
  const img = device === 'desktop' ? (slide.desktopImage || slide.mobileImage) : (slide.mobileImage || slide.desktopImage);
  const justify = slide.align === 'center' ? 'items-center text-center' : slide.align === 'right' ? 'items-end text-right' : 'items-start text-left';
  return (
    <div className="relative overflow-hidden border border-border bg-muted"
      style={{ width: device === 'desktop' ? 320 : 120, aspectRatio: device === 'desktop' ? 16 / 9 : 9 / 16 }}>
      {img && <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />}
      <div className="absolute inset-0 bg-black" style={{ opacity: slide.overlay / 100 }} />
      <div className={`absolute inset-0 flex flex-col justify-center gap-1 p-3 ${justify}`} style={{ color: slide.textColor }}>
        {slide.badge && <span className="text-[7px] font-semibold uppercase tracking-widest">{slide.badge}</span>}
        {slide.heading && <span className="text-[11px] font-extrabold leading-tight">{slide.heading}</span>}
        {slide.subheading && <span className="text-[7px] opacity-90 line-clamp-2">{slide.subheading}</span>}
        <div className={`mt-1 flex gap-1 ${slide.align === 'center' ? 'justify-center' : slide.align === 'right' ? 'justify-end' : ''}`}>
          {slide.btn1Text && <span className="rounded-sm bg-white px-2 py-0.5 text-[7px] font-bold text-black">{slide.btn1Text}</span>}
          {slide.btn2Text && <span className="rounded-sm border border-white px-2 py-0.5 text-[7px] font-bold">{slide.btn2Text}</span>}
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1">
    <label className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</label>
    {children}
  </div>
);

const AdminHeroSlider = () => {
  const { data: sections = [], isLoading } = useHomepageSections(true);
  const updateConfig = useUpdateHomepageSectionConfig();

  const heroSection = sections.find((s) => s.section_key === 'hero');
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [dirty, setDirty] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    if (heroSection) { setSlides(parseHeroSlides(heroSection.config)); setDirty(false); }
  }, [JSON.stringify(heroSection?.config)]);

  const update = (id: string, patch: Partial<HeroSlide>) => {
    setSlides((arr) => arr.map((s) => s.id === id ? { ...s, ...patch } : s));
    setDirty(true);
  };
  const add = () => { setSlides((arr) => [...arr, makeHeroSlide()]); setDirty(true); };
  const remove = (id: string) => { setSlides((arr) => arr.filter((s) => s.id !== id)); setDirty(true); };
  const duplicate = (id: string) => {
    setSlides((arr) => {
      const i = arr.findIndex((s) => s.id === id);
      if (i < 0) return arr;
      const copy = { ...arr[i], id: makeHeroSlide().id };
      const next = [...arr];
      next.splice(i + 1, 0, copy);
      return next;
    });
    setDirty(true);
  };
  const move = (from: number, to: number) => {
    if (to < 0 || to >= slides.length) return;
    setSlides((arr) => {
      const next = [...arr];
      const [m] = next.splice(from, 1);
      next.splice(to, 0, m);
      return next;
    });
    setDirty(true);
  };

  const handleSave = async () => {
    try {
      if (!(await guardLinks(slides, (m) => toast.error(m)))) return;
      await updateConfig.mutateAsync({ section_key: 'hero', config: { ...(heroSection?.config || {}), slides } });
      toast.success('Hero slider saved ✓');
      setDirty(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Hero Slider</h2>
          <p className="text-xs text-muted-foreground mt-1">{slides.length} slide{slides.length === 1 ? '' : 's'} • renders live from the database.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={add} className="luxury-button-outline text-xs py-2 px-3 inline-flex items-center gap-1.5"><Plus size={13} /> Add Slide</button>
          <button onClick={handleSave} disabled={updateConfig.isPending || !dirty}
            className="luxury-button-primary text-xs py-2 px-4 inline-flex items-center gap-1.5 disabled:opacity-50">
            {updateConfig.isPending ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {dirty ? 'Save' : 'Saved'}
          </button>
        </div>
      </div>

      <div className="border border-border bg-secondary/20 p-3 flex items-start gap-2">
        <Info size={14} className="text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground">
          Desktop <strong>1920×1080</strong> (16:9) · Mobile <strong>1080×1920</strong> (9:16) · Max <strong>10MB</strong>.
          Drag images while cropping to reposition/zoom. Disabled or out-of-schedule slides are hidden on the homepage.
        </p>
      </div>

      {slides.length === 0 && (
        <p className="text-xs text-muted-foreground py-10 text-center border border-dashed border-border">
          No slides yet. Click “Add Slide” to create your first hero slide.
        </p>
      )}

      <div className="space-y-4">
        {slides.map((slide, i) => (
          <div key={slide.id} draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); if (dragIndex !== null && dragIndex !== i) move(dragIndex, i); setDragIndex(null); }}
            onDragEnd={() => setDragIndex(null)}
            className={`border border-border bg-background p-4 space-y-4 ${dragIndex === i ? 'opacity-50' : ''} ${!slide.enabled ? 'opacity-70' : ''}`}>

            <div className="flex items-center gap-2">
              <GripVertical size={16} className="text-muted-foreground cursor-grab active:cursor-grabbing" />
              <span className="text-sm font-medium">Slide {i + 1}</span>
              <div className="ml-auto flex items-center gap-1">
                <button onClick={() => move(i, i - 1)} disabled={i === 0} className="p-1.5 border border-border text-muted-foreground hover:bg-muted disabled:opacity-30"><ChevronUp size={13} /></button>
                <button onClick={() => move(i, i + 1)} disabled={i === slides.length - 1} className="p-1.5 border border-border text-muted-foreground hover:bg-muted disabled:opacity-30"><ChevronDown size={13} /></button>
                <button onClick={() => update(slide.id, { enabled: !slide.enabled })}
                  className={`p-1.5 border border-border hover:bg-muted ${slide.enabled ? 'text-foreground' : 'text-muted-foreground'}`} title={slide.enabled ? 'Visible' : 'Hidden'}>
                  {slide.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
                <button onClick={() => duplicate(slide.id)} className="p-1.5 border border-border text-muted-foreground hover:bg-muted" title="Duplicate"><Copy size={13} /></button>
                <button onClick={() => remove(slide.id)} className="p-1.5 border border-border text-destructive hover:bg-destructive/10" title="Delete"><Trash2 size={13} /></button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Left: images + preview */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Field label="🖥️ Desktop Image">
                    <SlideImageUpload value={slide.desktopImage} kind="desktop" onChange={(url) => update(slide.id, { desktopImage: url })} />
                  </Field>
                  <Field label="📱 Mobile Image">
                    <SlideImageUpload value={slide.mobileImage} kind="mobile" onChange={(url) => update(slide.id, { mobileImage: url })} />
                  </Field>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Live Preview</span>
                    <div className="flex border border-border">
                      <button onClick={() => setPreviewDevice('desktop')} className={`p-1 ${previewDevice === 'desktop' ? 'bg-muted' : ''}`}><Monitor size={12} /></button>
                      <button onClick={() => setPreviewDevice('mobile')} className={`p-1 ${previewDevice === 'mobile' ? 'bg-muted' : ''}`}><Smartphone size={12} /></button>
                    </div>
                  </div>
                  <SlidePreview slide={slide} device={previewDevice} />
                </div>
              </div>

              {/* Right: text + settings */}
              <div className="space-y-3">
                <Field label="Badge Text"><input value={slide.badge} onChange={(e) => update(slide.id, { badge: e.target.value })} className="luxury-input text-xs" /></Field>
                <Field label="Main Heading"><input value={slide.heading} onChange={(e) => update(slide.id, { heading: e.target.value })} className="luxury-input text-xs" /></Field>
                <Field label="Sub Heading"><textarea value={slide.subheading} onChange={(e) => update(slide.id, { subheading: e.target.value })} className="luxury-input text-xs min-h-[50px]" /></Field>

                <div className="grid grid-cols-2 gap-2">
                  <Field label="Button 1 Text"><input value={slide.btn1Text} onChange={(e) => update(slide.id, { btn1Text: e.target.value })} className="luxury-input text-xs" /></Field>
                  <div className="col-span-2"><LinkPicker label="Button 1 URL" value={slide.btn1Url} onChange={(v) => update(slide.id, { btn1Url: v })} /></div>
                  <Field label="Button 2 Text"><input value={slide.btn2Text} onChange={(e) => update(slide.id, { btn2Text: e.target.value })} className="luxury-input text-xs" /></Field>
                  <div className="col-span-2"><LinkPicker label="Button 2 URL" value={slide.btn2Url} onChange={(v) => update(slide.id, { btn2Url: v })} /></div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Field label="Text Alignment">
                    <select value={slide.align} onChange={(e) => update(slide.id, { align: e.target.value as HeroSlide['align'] })} className="luxury-input text-xs">
                      <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
                    </select>
                  </Field>
                  <Field label="Button Style">
                    <select value={slide.buttonStyle} onChange={(e) => update(slide.id, { buttonStyle: e.target.value as HeroSlide['buttonStyle'] })} className="luxury-input text-xs">
                      <option value="solid">Solid</option><option value="outline">Outline</option><option value="soft">Soft</option>
                    </select>
                  </Field>
                  <Field label={`Overlay (${slide.overlay}%)`}>
                    <input type="range" min={0} max={90} value={slide.overlay} onChange={(e) => update(slide.id, { overlay: Number(e.target.value) })} className="w-full accent-primary" />
                  </Field>
                  <Field label="Text Color">
                    <input type="color" value={slide.textColor} onChange={(e) => update(slide.id, { textColor: e.target.value })} className="h-9 w-full border border-border bg-background" />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Field label="Publish Date"><input type="datetime-local" value={slide.publishAt} onChange={(e) => update(slide.id, { publishAt: e.target.value })} className="luxury-input text-xs" /></Field>
                  <Field label="Expiry Date"><input type="datetime-local" value={slide.expireAt} onChange={(e) => update(slide.id, { expireAt: e.target.value })} className="luxury-input text-xs" /></Field>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHeroSlider;