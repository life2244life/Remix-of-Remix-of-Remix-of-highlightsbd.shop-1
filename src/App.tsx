import { Component, lazy, Suspense, type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Index from "./pages/Index";
import ScrollToTop from "./components/ScrollToTop";
import AddToCartPopup from "./components/AddToCartPopup";
import ThemeApplier from "./components/ThemeApplier";
import GlobalSEO from "./components/GlobalSEO";

// Lazy load non-critical UI (off-screen / interactive popups)
const TrackingScripts = lazy(() => import("./components/TrackingScripts"));
const PageViewTracker = lazy(() => import("./components/PageViewTracker"));
const FloatingActions = lazy(() => import("./components/FloatingActions"));
const PromoPopup = lazy(() => import("./components/PromoPopup"));
const SpinWheelPopup = lazy(() => import("./components/SpinWheelPopup"));

// Lazy load non-critical pages
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CheckoutComplete = lazy(() => import("./pages/CheckoutComplete"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Admin = lazy(() => import("./pages/Admin"));
const Profile = lazy(() => import("./pages/Profile"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CustomPage = lazy(() => import("./pages/CustomPage"));
const DbOrFallbackPage = lazy(() => import("./components/DbOrFallbackPage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Collection = lazy(() => import("./pages/Collection"));
const GalleryDemo = lazy(() => import("./pages/GalleryDemo"));
const PurchaseDemo = lazy(() => import("./pages/PurchaseDemo"));
const ReviewsDemo = lazy(() => import("./pages/ReviewsDemo"));
const CrossSellDemo = lazy(() => import("./pages/CrossSellDemo"));
const RecentlyViewedDemo = lazy(() => import("./pages/RecentlyViewedDemo"));
const ShopTheLookDemo = lazy(() => import("./pages/ShopTheLookDemo"));
const FlashSaleDemo = lazy(() => import("./pages/FlashSaleDemo"));
const JustForYouDemo = lazy(() => import("./pages/JustForYouDemo"));
const TestimonialsDemo = lazy(() => import("./pages/TestimonialsDemo"));
const CatalogDemo = lazy(() => import("./pages/CatalogDemo"));
const FashionProductsDemo = lazy(() => import("./pages/FashionProductsDemo"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes cache
      refetchOnWindowFocus: false,
    },
  },
});

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
  </div>
);

class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('App render failed:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 text-center">
          <div className="max-w-sm border border-border bg-card p-6 space-y-4">
            <h1 className="text-lg font-medium tracking-wide">Page load problem</h1>
            <p className="text-sm text-muted-foreground">A data issue stopped this page from opening. Please reload and try again.</p>
            <button onClick={() => window.location.assign('/')} className="luxury-button-primary w-full text-xs">Back to Store</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <ThemeApplier />
              <GlobalSEO />
              <Suspense fallback={null}>
                <AddToCartPopup />
                <TrackingScripts />
                <PageViewTracker />
                <FloatingActions />
                <PromoPopup />
                <SpinWheelPopup />
              </Suspense>
              <AppErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/products/:slug" element={<ProductDetail />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/collections/:slug" element={<Collection />} />
                    <Route path="/gallery-demo" element={<GalleryDemo />} />
                    <Route path="/purchase-demo" element={<PurchaseDemo />} />
                    <Route path="/reviews-demo" element={<ReviewsDemo />} />
                    <Route path="/crosssell-demo" element={<CrossSellDemo />} />
                    <Route path="/recently-viewed-demo" element={<RecentlyViewedDemo />} />
                    <Route path="/shop-the-look-demo" element={<ShopTheLookDemo />} />
                    <Route path="/flash-sale-demo" element={<FlashSaleDemo />} />
                    <Route path="/just-for-you-demo" element={<JustForYouDemo />} />
                    <Route path="/testimonials-demo" element={<TestimonialsDemo />} />
                    <Route path="/catalog-demo" element={<CatalogDemo />} />
                    <Route path="/fashion-products-demo" element={<FashionProductsDemo />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/checkout/complete" element={<CheckoutComplete />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/:tab" element={<Admin />} />
                    <Route path="/about" element={<DbOrFallbackPage slug="about" fallback={<About />} />} />
                    <Route path="/contact" element={<DbOrFallbackPage slug="contact" fallback={<Contact />} />} />
                    <Route path="/privacy-policy" element={<DbOrFallbackPage slug="privacy-policy" fallback={<PrivacyPolicy />} />} />
                    <Route path="/terms" element={<DbOrFallbackPage slug="terms" fallback={<Terms />} />} />
                    <Route path="/refund-policy" element={<DbOrFallbackPage slug="refund-policy" fallback={<RefundPolicy />} />} />
                    <Route path="/shipping-policy" element={<DbOrFallbackPage slug="shipping-policy" fallback={<ShippingPolicy />} />} />
                    <Route path="/return-policy" element={<DbOrFallbackPage slug="return-policy" fallback={<NotFound />} />} />
                    <Route path="/faq" element={<DbOrFallbackPage slug="faq" fallback={<NotFound />} />} />
                    <Route path="/size-guide" element={<DbOrFallbackPage slug="size-guide" fallback={<NotFound />} />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/page/:slug" element={<CustomPage />} />
                    <Route path="/lp/:slug" element={<LandingPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </AppErrorBoundary>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
