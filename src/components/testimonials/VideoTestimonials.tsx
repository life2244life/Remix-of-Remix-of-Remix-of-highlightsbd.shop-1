import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VideoTestimonial } from "./mockData";

const VideoTestimonials = ({ videos }: { videos: VideoTestimonial[] }) => {
  const [active, setActive] = useState<VideoTestimonial | null>(null);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v, i) => (
          <motion.button
            key={v.id}
            type="button"
            onClick={() => setActive(v)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="group relative aspect-video overflow-hidden rounded-3xl border border-border shadow-sm"
          >
            <img
              src={v.thumbnail}
              alt={v.caption}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg transition-transform group-hover:scale-110">
                <Play className="ml-1 h-7 w-7 fill-current" />
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
              <p className="text-sm font-semibold text-background">{v.name}</p>
              <p className="text-xs text-background/80">{v.caption}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-3xl overflow-hidden p-0">
          {active && (
            <video
              src={active.videoUrl}
              controls
              autoPlay
              className="aspect-video w-full bg-black"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoTestimonials;