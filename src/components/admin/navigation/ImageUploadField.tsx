import { useRef, useState } from 'react';
import { uploadImage } from '@/lib/upload';
import { toast } from 'sonner';
import { Upload, X, Loader2 } from 'lucide-react';

interface Props {
  label: string;
  value?: string | null;
  onChange: (url: string) => void;
  hint?: string;
}

const ImageUploadField = ({ label, value, onChange, hint }: Props) => {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handle = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, 'navigation');
      onChange(url);
    } catch (e: any) {
      toast.error(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="text-xs text-muted-foreground block mb-1">{label}</label>
      <div className="flex items-center gap-2">
        {value ? (
          <div className="relative">
            <img src={value} alt="" className="h-12 w-12 object-cover rounded border border-border" />
            <button type="button" onClick={() => onChange('')} className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5">
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : null}
        <button type="button" onClick={() => ref.current?.click()} disabled={uploading} className="luxury-button-outline text-[11px] flex items-center gap-1">
          {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />} {value ? 'Replace' : 'Upload'}
        </button>
        <input value={value || ''} onChange={e => onChange(e.target.value)} placeholder="or paste URL" className="luxury-input flex-1 text-[11px]" />
      </div>
      {hint && <p className="text-[10px] text-muted-foreground mt-1">{hint}</p>}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e => handle(e.target.files?.[0])} />
    </div>
  );
};

export default ImageUploadField;