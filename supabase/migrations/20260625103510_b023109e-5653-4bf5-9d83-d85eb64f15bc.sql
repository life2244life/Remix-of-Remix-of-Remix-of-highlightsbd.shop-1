ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'General',
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS author text NOT NULL DEFAULT 'EIDLIP Editorial';

INSERT INTO public.blog_posts (slug, title, excerpt, content, cover_image, cover_alt, category, tags, author, seo_title, seo_description, is_published, sort_order)
VALUES
(
  'eidlip-summer-2026-lookbook',
  'EIDLIP Summer 2026 Lookbook: Effortless Everyday Style',
  'Discover the EIDLIP Summer 2026 collection — breathable fabrics, relaxed silhouettes, and unisex staples made for the Bangladeshi summer.',
  E'Summer in Bangladesh calls for clothing that breathes, moves, and lasts. The EIDLIP Summer 2026 collection was designed around three ideas: comfort, versatility, and quiet confidence.\n\nWe started with fabric. Every piece in the lookbook uses combed cotton or cotton-linen blends that stay cool through Dhaka''s humid afternoons. The result is clothing you forget you are wearing — until someone asks where you got it.\n\nThe silhouettes are relaxed but intentional. Oversized tees pair with tapered trousers; soft overshirts layer over everyday tanks. Because the collection is unisex, every item is built to be shared, restyled, and worn your way.\n\nColour stays calm: sand, off-white, deep olive, and washed black. These tones move easily between work, weekend, and everything in between.\n\nShop the full collection and build a wardrobe that works as hard as you do — with cash on delivery across Bangladesh.',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
  'Models wearing the EIDLIP summer collection',
  'Lookbook',
  ARRAY['summer','collection','style','unisex'],
  'EIDLIP Editorial',
  'EIDLIP Summer 2026 Lookbook — Effortless Everyday Style',
  'Explore the EIDLIP Summer 2026 collection: breathable fabrics, relaxed unisex silhouettes, and everyday staples made for Bangladesh.',
  true, 60
),
(
  'how-to-care-for-premium-cotton',
  'How to Care for Premium Cotton So It Lasts for Years',
  'Simple, proven steps to keep your EIDLIP cotton looking new — washing, drying, and storage tips that protect colour and shape.',
  E'Premium cotton rewards a little care with years of wear. Here is the routine we recommend for every EIDLIP cotton piece.\n\nWash cold, wash inside out. Cold water (30°C or below) protects colour and prevents shrinkage, while turning garments inside out shields prints and the outer surface from friction.\n\nSkip the harsh detergent. A mild, dye-free detergent keeps fibres soft. Avoid bleach entirely — it weakens cotton over time.\n\nDry smart. Air drying in shade is best. If you use a machine, choose low heat and remove items while slightly damp to reduce wrinkles and wear.\n\nStore folded. Heavy knits and tees keep their shape better folded than hung. Give them room to breathe in your wardrobe.\n\nFollow these steps and your EIDLIP staples will stay soft, structured, and rich in colour season after season.',
  'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1600&q=80',
  'Neatly folded cotton clothing',
  'Care Guide',
  ARRAY['care','cotton','tips','longevity'],
  'EIDLIP Studio',
  'How to Care for Premium Cotton — EIDLIP Care Guide',
  'Keep your EIDLIP cotton looking new with these washing, drying, and storage tips that protect colour, softness, and shape.',
  true, 50
),
(
  'building-a-capsule-wardrobe',
  'Building a Capsule Wardrobe with EIDLIP Essentials',
  'Fewer pieces, more outfits. Learn how to build a versatile capsule wardrobe using a handful of EIDLIP unisex essentials.',
  E'A capsule wardrobe is a small, carefully chosen set of pieces that mix and match effortlessly. It saves time, money, and closet space — and it always looks intentional.\n\nStart with a neutral base. Two tees (white and black), one overshirt, a pair of tapered trousers, and a versatile pair of denim cover most occasions.\n\nLayer for range. An EIDLIP overshirt worn open over a tee reads casual; buttoned and tucked, it reads sharp. One piece, two moods.\n\nKeep colours in conversation. When every item shares a calm palette, any combination works. That is the secret behind a wardrobe that feels effortless.\n\nInvest in quality over quantity. Five well-made unisex staples will outlast and out-style a closet full of fast fashion.\n\nBuild your capsule with EIDLIP essentials and get dressed in seconds, every day.',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
  'A minimal capsule wardrobe rail',
  'Style Guide',
  ARRAY['capsule','wardrobe','essentials','minimal'],
  'EIDLIP Editorial',
  'Building a Capsule Wardrobe with EIDLIP Essentials',
  'Build a versatile capsule wardrobe with a handful of EIDLIP unisex essentials — fewer pieces, more outfits, effortless style.',
  true, 40
),
(
  'the-eidlip-story',
  'The EIDLIP Story: Premium Unisex Clothing, Made for Everyone',
  'How EIDLIP began, what we believe, and why we design unisex clothing that fits real lives across Bangladesh.',
  E'EIDLIP started with a simple frustration: good basics were either overpriced or poorly made. We wanted premium, unisex clothing that anyone could wear and afford.\n\nWe believe clothing should be inclusive. That is why every EIDLIP design is unisex by default — built to flatter a range of bodies, not a single ideal.\n\nWe believe in honest quality. We choose durable fabrics, reinforce the seams that matter, and price fairly because we sell directly to you.\n\nWe believe in serving Bangladesh first. Cash on delivery nationwide, fast dispatch from Dhaka, and a return policy that respects your time.\n\nEvery collection we release carries these values forward. Thank you for being part of the EIDLIP story.',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80',
  'EIDLIP brand storytelling imagery',
  'Brand',
  ARRAY['brand','story','about','unisex'],
  'Team EIDLIP',
  'The EIDLIP Story — Premium Unisex Clothing for Everyone',
  'How EIDLIP began and why we design premium, affordable unisex clothing made for real lives across Bangladesh.',
  true, 30
),
(
  'styling-tips-for-monsoon-season',
  '5 Styling Tips to Stay Sharp Through Monsoon Season',
  'Rain, humidity, and unpredictable days — here is how to dress well and stay comfortable through the Bangladeshi monsoon.',
  E'Monsoon season tests every wardrobe. With the right pieces and a few tricks, you can stay sharp no matter the weather.\n\n1. Choose quick-dry fabrics. Lightweight cotton blends dry faster and resist that heavy, damp feeling.\n\n2. Layer light. A water-resistant overshirt beats a bulky jacket on humid days and packs away when the sun returns.\n\n3. Stick to deeper tones. Washed black, olive, and charcoal hide splashes far better than pale shades.\n\n4. Roll your hems. Cuffed trousers keep edges clean and dry when puddles are unavoidable.\n\n5. Keep a spare tee. A compact EIDLIP tee in your bag means you are always one quick change from fresh.\n\nDress smart, stay dry, and let the rain do its thing.',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80',
  'Stylish outfit suited for rainy weather',
  'Style Guide',
  ARRAY['monsoon','styling','tips','seasonal'],
  'EIDLIP Editorial',
  '5 Monsoon Styling Tips — Stay Sharp & Comfortable | EIDLIP',
  'Dress well through the Bangladeshi monsoon with five practical styling tips for rain, humidity, and unpredictable days.',
  true, 20
),
(
  'unisex-fashion-why-it-matters',
  'Unisex Fashion: Why It Matters and How to Wear It',
  'Unisex clothing is more than a trend — it is a smarter, more inclusive way to dress. Here is what it means and how to make it yours.',
  E'Unisex fashion removes the artificial line between "men''s" and "women''s" clothing, focusing instead on fit, comfort, and versatility.\n\nWhy it matters. Inclusive sizing and design mean more people find clothes that genuinely fit. It also reduces waste — pieces are shared, restyled, and worn longer.\n\nHow to wear it. Start with fit, not labels. An EIDLIP tee or overshirt is cut to flatter a range of bodies; choose the size that gives you the silhouette you want, relaxed or tailored.\n\nMake it yours. Accessories, layering, and proportion turn a unisex base into a personal statement. The same overshirt can read minimal, street, or smart depending on how you style it.\n\nUnisex is the future of everyday wear — and at EIDLIP, it has always been the foundation.',
  'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1600&q=80',
  'Two people in unisex everyday clothing',
  'Style Guide',
  ARRAY['unisex','inclusive','fashion','guide'],
  'EIDLIP Editorial',
  'Unisex Fashion: Why It Matters & How to Wear It | EIDLIP',
  'Unisex clothing is a smarter, more inclusive way to dress. Learn what it means and how to make EIDLIP unisex pieces your own.',
  true, 10
);