import { useMemo, useState } from "react";
import { MessageSquarePlus, PenLine } from "lucide-react";
import { motion } from "framer-motion";
import StarRating from "./StarRating";
import RatingSummary from "./RatingSummary";
import ReviewCard from "./ReviewCard";
import ReviewModal from "./ReviewModal";
import { Lightbox, PhotoStrip } from "./PhotoGallery";
import { MockReview, mockReviews, mockSummary } from "./mockReviews";

type FilterKey = "all" | "5" | "4" | "3" | "2" | "1" | "photos";
type SortKey = "recent" | "highest" | "lowest" | "helpful";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Reviews" },
  { key: "5", label: "5 Star" },
  { key: "4", label: "4 Star" },
  { key: "3", label: "3 Star" },
  { key: "2", label: "2 Star" },
  { key: "1", label: "1 Star" },
  { key: "photos", label: "With Photos" },
];

const sorts: { key: SortKey; label: string }[] = [
  { key: "recent", label: "Most Recent" },
  { key: "highest", label: "Highest Rating" },
  { key: "lowest", label: "Lowest Rating" },
  { key: "helpful", label: "Most Helpful" },
];

const ProductReviewsSection = () => {
  const [reviews, setReviews] = useState<MockReview[]>(mockReviews);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<SortKey>("recent");
  const [modalOpen, setModalOpen] = useState(false);
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  const allPhotos = useMemo(() => reviews.flatMap((r) => r.images), [reviews]);

  const visible = useMemo(() => {
    let list = [...reviews];
    if (filter === "photos") list = list.filter((r) => r.images.length > 0);
    else if (filter !== "all") list = list.filter((r) => r.rating === Number(filter));

    switch (sort) {
      case "highest": list.sort((a, b) => b.rating - a.rating); break;
      case "lowest": list.sort((a, b) => a.rating - b.rating); break;
      case "helpful": list.sort((a, b) => b.helpful - a.helpful); break;
      default: list.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    }
    return list;
  }, [reviews, filter, sort]);

  const openLightbox = (images: string[], index: number) => setLightbox({ images, index });

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-light text-foreground sm:text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            Customer Reviews
          </h2>
          <div className="mt-2 flex items-center gap-2">
            <StarRating value={mockSummary.average} size={18} />
            <span className="text-sm font-medium text-foreground">{mockSummary.average.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">· Based on {mockSummary.total.toLocaleString()} Reviews</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-foreground px-5 text-sm font-semibold text-background shadow-lg shadow-foreground/20 transition-transform hover:scale-[1.02]"
        >
          <PenLine className="h-4 w-4" /> Write a Review
        </button>
      </div>

      {/* Summary */}
      <div className="mt-8">
        <RatingSummary summary={mockSummary} />
      </div>

      {/* Photo gallery */}
      {allPhotos.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-foreground">Customer Photos</h3>
          <PhotoStrip images={allPhotos} onOpen={openLightbox} />
        </div>
      )}

      {/* Filters + sort */}
      <div className="mt-10 flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                filter === f.key ? "border-foreground bg-foreground text-background" : "border-border text-foreground hover:bg-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-[12px] border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
          >
            {sorts.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Review list / empty state */}
      {visible.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 py-16 text-center"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <MessageSquarePlus className="h-9 w-9" />
          </span>
          <div>
            <p className="text-lg font-medium text-foreground">No reviews yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Be the first customer to review this product.</p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex h-11 items-center gap-2 rounded-[14px] bg-foreground px-5 text-sm font-semibold text-background"
          >
            <PenLine className="h-4 w-4" /> Write a Review
          </button>
        </motion.div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {visible.map((r) => (
            <ReviewCard key={r.id} review={r} onImageClick={openLightbox} />
          ))}
        </div>
      )}

      <ReviewModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={(r) => setReviews((prev) => [r, ...prev])}
      />

      <Lightbox
        images={lightbox?.images ?? null}
        index={lightbox?.index ?? 0}
        onClose={() => setLightbox(null)}
        onNavigate={(i) => setLightbox((lb) => (lb ? { ...lb, index: i } : lb))}
      />
    </section>
  );
};

export default ProductReviewsSection;