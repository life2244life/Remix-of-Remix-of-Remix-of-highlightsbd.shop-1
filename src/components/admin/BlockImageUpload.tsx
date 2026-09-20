import { useState, useRef } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { uploadImage } from '@/lib/upload';
import ImageCropDialog from './ImageCropDialog';

const BlockImageUpload = ({ value, onChange, aspectRatio = 16 / 9, folder = 'homepage/blocks', maxMB = 10, width = 200, label }: {
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: number;
  folder?: string;
  maxMB?: number;
  width?: number;
  label?: string;
}) => {
  const [uploading, setUploading] = useState(false);
  const [pending, setPending] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Image file only'); return; }
    if (file.size > maxMB * 1024 * 1024) { toast.error(`Max ${maxMB}MB!`); return; }
    setPending(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleCropped = async (blob: Blob) => {
    setPending(null);
    setUploading(true);
    try {
      const f = new File([blob], `block-${Date.now()}.webp`, { type: 'image/webp' });
      const url = await uploadImage(f, folder);
      onChange(url);
      toast.success('Image uploaded ✓');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally { setUploading(false); }
  };

  return (
    <div>
      {label && <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">{label}</label>}
      <input ref={inputRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
      {pending && (
        <ImageCropDialog file={pending} aspectRatio={aspectRatio} safeAreaPct={{ w: 0.7, h: 0.75 }}
          onCancel={() => setPending(null)} onConfirm={handleCropped} />
      )}
      {value ? (
        <div className="relative inline-block">
          <div className="relative overflow-hidden border border-border" style={{ width, aspectRatio: String(aspectRatio) }}>
            <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <button onClick={() => onChange('')} className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-destructive text-white"><X size={12} /></button>
        </div>
      ) : (
        <button onClick={() => inputRef.current?.click()} disabled={uploading}
          className="flex flex-col items-center justify-center gap-1 border border-dashed border-border bg-muted/30 text-muted-foreground hover:bg-muted transition-colors" style={{ width, aspectRatio: String(aspectRatio) }}>
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <><ImagePlus size={18} /><span className="text-[10px]">Upload</span></>}
        </button>
      )}
    </div>
  );
};

export default BlockImageUpload;