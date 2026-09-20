import type { GalleryProduct } from "./types";

// Mock product data — frontend only, no API/backend.
// Premium fashion imagery from Unsplash (free to use).
export const mockProduct: GalleryProduct = {
  id: "prod-001",
  name: "Tailored Wool Overcoat",
  badges: ["NEW", "BESTSELLER"],
  images: [
    {
      id: "img-1",
      url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=80",
      alt: "Tailored wool overcoat — front view",
      label: "Front View",
    },
    {
      id: "img-2",
      url: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1000&q=80",
      alt: "Tailored wool overcoat — back view",
      label: "Back View",
    },
    {
      id: "img-3",
      url: "https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=1000&q=80",
      alt: "Tailored wool overcoat — side view",
      label: "Side View",
    },
    {
      id: "img-4",
      url: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=1000&q=80",
      alt: "Tailored wool overcoat — fabric close-up",
      label: "Close-up",
    },
    {
      id: "img-5",
      url: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=80",
      alt: "Tailored wool overcoat — lifestyle shot",
      label: "Lifestyle",
    },
    {
      id: "img-6",
      url: "https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?auto=format&fit=crop&w=1000&q=80",
      alt: "Tailored wool overcoat — model wearing",
      label: "Model",
    },
    {
      id: "img-7",
      url: "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1000&q=80",
      alt: "Tailored wool overcoat — detail",
      label: "Detail",
    },
    {
      id: "img-8",
      url: "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?auto=format&fit=crop&w=1000&q=80",
      alt: "Tailored wool overcoat — styling",
      label: "Styling",
    },
  ],
};