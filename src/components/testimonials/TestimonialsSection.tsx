import { motion } from "framer-motion";
import Stars from "./Stars";
import RatingSummary from "./RatingSummary";
import FeaturedTestimonials from "./FeaturedTestimonials";
import VideoTestimonials from "./VideoTestimonials";
import PhotoGallery from "./PhotoGallery";
import ReviewCarousel from "./ReviewCarousel";
import TrustMetrics from "./TrustMetrics";
import CustomerStory from "./CustomerStory";
import SocialBadges from "./SocialBadges";
import TestimonialsSkeleton from "./TestimonialsSkeleton";
import {
  customerStory,
  galleryPhotos,
  ratingSummary,
  socialBadges,
  testimonials,
  trustMetrics,
  videoTestimonials,
} from "./mockData";

const Heading = ({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="text-center"
  >
    {eyebrow && (
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-destructive">{eyebrow}</span>
    )}
    <h2 className="mt-2 text-3xl font-light tracking-tight text-foreground sm:text-4xl">{title}</h2>
    {subtitle && <p className="mt-3 text-base text-muted-foreground">{subtitle}</p>}
  </motion.div>
);

const TestimonialsSection = ({ loading = false }: { loading?: boolean }) => {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <TestimonialsSkeleton />
        ) : (
          <div className="space-y-16 sm:space-y-20">
            {/* Section header */}
            <div className="text-center">
              <Heading
                eyebrow="Testimonials"
                title="What Our Customers Say"
                subtitle="Trusted by thousands of fashion lovers"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-5 inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5 shadow-sm"
              >
                <Stars value={ratingSummary.average} size={18} />
                <span className="text-sm font-semibold text-foreground">
                  {ratingSummary.average.toFixed(1)} Average Rating
                </span>
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  · Based on 10,000+ Reviews
                </span>
              </motion.div>
            </div>

            {/* Overall summary */}
            <RatingSummary summary={ratingSummary} />

            {/* Featured testimonials */}
            <div className="space-y-8">
              <Heading title="Featured Reviews" subtitle="Real words from verified buyers" />
              <FeaturedTestimonials items={testimonials.slice(0, 3)} />
            </div>

            {/* Review carousel */}
            <div className="space-y-8">
              <Heading title="More Happy Customers" subtitle="Swipe through our latest reviews" />
              <ReviewCarousel reviews={testimonials} />
            </div>

            {/* Video testimonials */}
            <div className="space-y-8">
              <Heading title="Video Reviews" subtitle="See our community in their favourite fits" />
              <VideoTestimonials videos={videoTestimonials} />
            </div>

            {/* Photo gallery */}
            <div className="space-y-8">
              <Heading title="From Our Community" subtitle="Photos shared by real customers" />
              <PhotoGallery images={galleryPhotos} />
            </div>

            {/* Trust metrics */}
            <TrustMetrics metrics={trustMetrics} />

            {/* Customer story */}
            <div className="space-y-8">
              <Heading title="A Story Worth Sharing" subtitle="How style becomes a lifelong relationship" />
              <CustomerStory story={customerStory} />
            </div>

            {/* Social proof badges */}
            <SocialBadges badges={socialBadges} />
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;