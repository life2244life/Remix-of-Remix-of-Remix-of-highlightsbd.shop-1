import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Check, ZoomIn, ZoomOut, RotateCcw, Move, Loader2 } from 'lucide-react';

type Props = {
  file: File;
  aspectRatio: number; // width / height (e.g. 16/9, 9/16, 4/5, 3/4)
  safeAreaPct?: { w: number; h: number }; // 0–1, defaults 0.7 × 0.75
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
};

const ImageCropDialog = ({ file, aspectRatio, safeAreaPct = { w: 0.7, h: 0.75 }, onCancel, onConfirm }: Props) => {
  const [imgUrl, setImgUrl] = useState<string>('');
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [frameSize, setFrameSize] = useState({ w: 0, h: 0 });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const frameRef = useRef<HTMLDivElement>(null);

  const measureFrame = useCallback(() => {
    if (!frameRef.current) return;
    setFrameSize({ w: frameRef.current.clientWidth, h: frameRef.current.clientHeight });
  }, []);

  useEffect(() => {
    measureFrame();
    window.addEventListener('resize', measureFrame);
    return () => window.removeEventListener('resize', measureFrame);
  }, [measureFrame, aspectRatio]);

  // Load file
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImgUrl(url);
    const img = new Image();
    img.onload = () => {
      setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
      measureFrame();
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file, measureFrame]);

  useEffect(() => {
    if (!imgSize.w || !frameSize.w) return;
    setScale(Math.max(frameSize.w / imgSize.w, frameSize.h / imgSize.h));
    setOffset({ x: 0, y: 0 });
  }, [imgSize.w, imgSize.h, frameSize.w, frameSize.h]);

  const onMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const point = 'touches' in e ? e.touches[0] : e;
    setDragging(true);
    dragStart.current = { x: point.clientX, y: point.clientY, ox: offset.x, oy: offset.y };
  };

  const onMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragging) return;
    if (e.cancelable) e.preventDefault();
    const point = 'touches' in e ? e.touches[0] : e;
    setOffset({
      x: dragStart.current.ox + (point.clientX - dragStart.current.x),
      y: dragStart.current.oy + (point.clientY - dragStart.current.y),
    });
  }, [dragging]);

  const onMouseUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    if (!dragging) return;
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onMouseMove, { passive: false });
    window.addEventListener('touchend', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [dragging, onMouseMove, onMouseUp]);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.06 : 0.94;
    setScale((s) => Math.max(0.02, Math.min(10, s * delta)));
  };

  const reset = () => {
    if (!frameSize.w || !imgSize.w) return;
    setScale(Math.max(frameSize.w / imgSize.w, frameSize.h / imgSize.h));
    setOffset({ x: 0, y: 0 });
  };

  const getImageBox = (fw = frameSize.w, fh = frameSize.h) => {
    const w = imgSize.w * scale;
    const h = imgSize.h * scale;
    return {
      w,
      h,
      left: (fw - w) / 2 + offset.x,
      top: (fh - h) / 2 + offset.y,
    };
  };

  const handleSave = async () => {
    if (!frameSize.w || !imgSize.w) return;
    setSaving(true);
    try {
      const fw = frameSize.w;
      const fh = frameSize.h;

      // Output canvas: high-res based on source pixels
      const outW = Math.round(Math.min(imgSize.w, 2560));
      const outH = Math.round(outW / aspectRatio);

      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, outW, outH);

      const box = getImageBox(fw, fh);

      // Scale frame -> output canvas
      const k = outW / fw;
      ctx.drawImage(
        await loadImg(imgUrl),
        box.left * k,
        box.top * k,
        box.w * k,
        box.h * k,
      );

      canvas.toBlob((blob) => {
        if (blob) onConfirm(blob);
        setSaving(false);
      }, 'image/webp', 0.95);
    } catch (e) {
      setSaving(false);
    }
  };

  // Preview frame size (responsive)
  const frameMaxW = 520;
  const frameW = frameMaxW;
  const frameH = frameMaxW / aspectRatio;
  const imageBox = getImageBox();
  const safeW = frameSize.w * safeAreaPct.w;
  const safeH = frameSize.h * safeAreaPct.h;
  const safeLeft = (frameSize.w - safeW) / 2;
  const safeTop = (frameSize.h - safeH) / 2;
  const coversSafeArea =
    !imgSize.w ||
    !frameSize.w ||
    (imageBox.left <= safeLeft &&
      imageBox.top <= safeTop &&
      imageBox.left + imageBox.w >= safeLeft + safeW &&
      imageBox.top + imageBox.h >= safeTop + safeH);

  return (
    <div className="fixed inset-0 z-[100] bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-background border border-border max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background z-10">
          <h3 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
            <Move size={14} /> Crop & Position
          </h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            🖐️ <strong>Drag</strong> kore image move korun · 🔍 <strong>Scroll/Slider</strong> diye zoom korun · Green dashed <strong>Safe Area</strong> er moddhe important content rakhun.
          </p>

          <div
            ref={frameRef}
            onMouseDown={onMouseDown}
            onTouchStart={onMouseDown}
            onWheel={onWheel}
            className="relative mx-auto overflow-hidden bg-checker border border-border select-none"
            style={{
              width: frameW,
              maxWidth: '100%',
              aspectRatio: `${aspectRatio}`,
              cursor: dragging ? 'grabbing' : 'grab',
              backgroundImage:
                'linear-gradient(45deg, hsl(var(--muted)) 25%, transparent 25%), linear-gradient(-45deg, hsl(var(--muted)) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, hsl(var(--muted)) 75%), linear-gradient(-45deg, transparent 75%, hsl(var(--muted)) 75%)',
              backgroundSize: '16px 16px',
              backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
            }}
          >
            {imgUrl && (
              <img
                src={imgUrl}
                alt=""
                draggable={false}
                className="absolute top-1/2 left-1/2 pointer-events-none"
                style={{
                  width: imgSize.w,
                  height: imgSize.h,
                  transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                  transformOrigin: 'center center',
                  maxWidth: 'none',
                }}
              />
            )}
            {/* Safe area overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className={`relative border-2 border-dashed ${coversSafeArea ? 'border-message' : 'border-destructive'}`}
                style={{ width: `${safeAreaPct.w * 100}%`, height: `${safeAreaPct.h * 100}%` }}
              >
                <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] px-1.5 py-0.5 uppercase tracking-wider font-semibold ${coversSafeArea ? 'bg-message text-message-foreground' : 'bg-destructive text-destructive-foreground'}`}>
                  {coversSafeArea ? 'Safe Area' : 'Image choto'}
                </span>
              </div>
            </div>
            {/* Frame border (= final crop boundary) */}
            <div className="pointer-events-none absolute inset-0 border-2 border-primary/60" />
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setScale((s) => Math.max(0.02, s * 0.9))}
              className="p-2 border border-border hover:bg-muted"
              type="button"
            ><ZoomOut size={14} /></button>
            <input
              type="range"
              min={0.02}
              max={10}
              step={0.01}
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="flex-1 accent-primary"
            />
            <button
              onClick={() => setScale((s) => Math.min(10, s * 1.1))}
              className="p-2 border border-border hover:bg-muted"
              type="button"
            ><ZoomIn size={14} /></button>
            <button
              onClick={reset}
              className="p-2 border border-border hover:bg-muted text-muted-foreground"
              type="button"
              title="Reset"
            ><RotateCcw size={14} /></button>
            <span className="text-[10px] text-muted-foreground w-12 text-right tabular-nums">{Math.round(scale * 100)}%</span>
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-border">
            {!coversSafeArea && (
              <p className="mr-auto text-[10px] text-destructive leading-tight max-w-[260px]">
                Image Safe Area cover korche na — zoom in korun ba move kore green box er niche image rakhun.
              </p>
            )}
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-[11px] uppercase tracking-widest border border-border hover:bg-muted"
            >Cancel</button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !imgSize.w || !coversSafeArea}
              className="px-4 py-2 text-[11px] uppercase tracking-widest bg-foreground text-background hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
              {saving ? 'Saving…' : 'Apply Crop'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const loadImg = (src: string): Promise<HTMLImageElement> =>
  new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });

export default ImageCropDialog;
