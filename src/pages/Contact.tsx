import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SEO from "@/components/SEO";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useStoreSettings } from "@/hooks/useSupabase";
import { getBusinessInfo, getActiveSocials } from "@/lib/siteSettings";
import { useSEOSettings } from "@/hooks/useSEOSettings";

const Contact = () => {
  const { data: s } = useStoreSettings();
  const { data: seo } = useSEOSettings();
  const biz = getBusinessInfo(s);
  const sameAs = getActiveSocials(s).map((l) => l.url);
  const waDigits = (biz.whatsapp || biz.phone || "").replace(/[^0-9]/g, "");

  // Distinct ContactPage schema (Organization is injected once globally via GlobalSEO).
  // Respect the global Organization structured-data toggle.
  const jsonLd =
    seo?.sd_organization === 'false'
      ? undefined
      : {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Us",
          about: {
            "@type": "Organization",
            name: biz.storeName,
            ...(biz.email ? { email: biz.email } : {}),
            ...(biz.phone ? { telephone: biz.phone } : {}),
            ...(biz.address ? { address: { "@type": "PostalAddress", streetAddress: biz.address } } : {}),
            ...(sameAs.length ? { sameAs } : {}),
          },
        };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Contact Us"
        description="Get in touch with EIDLIP — premium men's fashion in Bangladesh. Questions, orders, support: we'd love to hear from you."
        path="/contact"
        jsonLd={jsonLd}
      />
      <Header />
      <CartDrawer />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 sm:pt-40 pb-20">
        <h1 className="luxury-heading text-3xl sm:text-4xl tracking-[0.15em] text-center mb-4">Contact Us</h1>
        <div className="w-12 h-px bg-foreground mx-auto mb-10" />

        <div className="space-y-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
          <p>
            We'd love to hear from you! Whether you have a question about our products, need help with an order, or just
            want to say hello — feel free to reach out.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            {biz.address && (
              <div className="border border-border p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-foreground shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-foreground font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">{biz.address}</p>
                  </div>
                </div>
              </div>
            )}

            {biz.phone && (
              <div className="border border-border p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-foreground shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-foreground font-medium">Phone</p>
                    <a href={`tel:${biz.phone}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{biz.phone}</a>
                  </div>
                </div>
              </div>
            )}

            {biz.email && (
              <div className="border border-border p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-foreground shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-foreground font-medium">Email</p>
                    <a href={`mailto:${biz.email}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{biz.email}</a>
                  </div>
                </div>
              </div>
            )}

            {biz.workingHours && (
              <div className="border border-border p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-foreground shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-foreground font-medium">Business Hours</p>
                    <p className="text-sm text-muted-foreground">{biz.workingHours}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {waDigits && (
            <>
              <p className="mt-6">
                You can also reach us via our Facebook page or send a message on WhatsApp for quick support.
              </p>
              <a
                href={`https://wa.me/${waDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 mt-2 rounded-md bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                Chat on WhatsApp
              </a>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
