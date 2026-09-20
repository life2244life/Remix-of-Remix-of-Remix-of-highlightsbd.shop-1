import { useRef, useState } from "react";
import { Check, ImagePlus, Star, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MockReview } from "./mockReviews";

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (review: MockReview) => void;
}

const ReviewModal = ({ open, onOpenChange, onSubmit }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setRating(0); setHover(0); setTitle(""); setBody(""); setPhotos([]); setSubmitting(false); setDone(false);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files).slice(0, 4 - photos.length).map((f) => URL.createObjectURL(f));
    setPhotos((p) => [...p, ...urls]);
  };

  const submit = () => {
    if (rating === 0 || !title.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      onSubmit({
        id: `local-${Date.now()}`,
        name: "You",
        verified: true,
        rating,
        date: new Date().toISOString(),
        title: title.trim(),
        body: body.trim() || "(No description provided)",
        images: photos,
        helpful: 0,
        notHelpful: 0,
      });
      setSubmitting(false);
      setDone(true);
      setTimeout(() => { onOpenChange(false); setTimeout(reset, 300); }, 1400);
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setTimeout(reset, 300); }}>
      <DialogContent className="rounded-[18px] sm:max-w-lg">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 py-8 text-center"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <Check className="h-8 w-8" />
              </span>
              <h3 className="text-lg font-semibold text-foreground">Thank you for your review!</h3>
              <p className="text-sm text-muted-foreground">Your feedback helps other shoppers decide.</p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DialogHeader>
                <DialogTitle className="text-lg">Write a Review</DialogTitle>
                <DialogDescription>Share your experience with this product.</DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        type="button"
                        onMouseEnter={() => setHover(i)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(i)}
                      >
                        <Star
                          className={`h-7 w-7 transition-colors ${
                            i <= (hover || rating) ? "fill-destructive text-destructive" : "fill-muted text-muted"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Review Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Sum it up in a few words"
                    className="w-full rounded-[12px] border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Review Description</label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={4}
                    placeholder="What did you like or dislike?"
                    className="w-full resize-none rounded-[12px] border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Add Photos (optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {photos.map((src, i) => (
                      <div key={src} className="relative h-16 w-16 overflow-hidden rounded-[12px] border border-border">
                        <img src={src} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))}
                          className="absolute right-0.5 top-0.5 rounded-full bg-foreground/80 p-0.5 text-background"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {photos.length < 4 && (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-[12px] border border-dashed border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                      >
                        <ImagePlus className="h-5 w-5" />
                      </button>
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFiles(e.target.files)}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={submit}
                  disabled={rating === 0 || !title.trim() || submitting}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-foreground text-sm font-semibold text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Submitting…" : "Submit Review"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;