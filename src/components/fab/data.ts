// Fabrilife-style storefront mock content (images + nav config).
// Product data itself comes from the live catalog; these are only for
// campaign visuals, category tiles and promo banners.

export const img = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export interface MegaColumn {
  heading: string;
  links: string[];
}

export interface NavItem {
  label: string;
  to: string;
  badge?: string;
  mega?: {
    categories: string[];
    popular: string[];
    featured: { name: string; price: string; image: string }[];
    banner: { title: string; subtitle: string; image: string };
  };
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Men',
    to: '/?category=men',
    mega: {
      categories: ['T-Shirts', 'Polo', 'Hoodie', 'Shirt', 'Joggers', 'Shorts', 'Jeans', 'Panjabi'],
      popular: ['Premium Cotton Tee', 'Oversized Hoodie', 'Slim Fit Shirt', 'Cargo Joggers', 'Eid Panjabi'],
      featured: [
        { name: 'Essential Polo', price: '৳890', image: img('1503341504253-dff4815485f1', 400) },
        { name: 'Winter Hoodie', price: '৳1,490', image: img('1556821840-3a63f95609a7', 400) },
      ],
      banner: { title: "Men's Winter Edit", subtitle: 'Up to 40% off', image: img('1539109136881-3be0616acf4b', 600) },
    },
  },
  {
    label: 'Women',
    to: '/?category=women',
    mega: {
      categories: ['Kurti', 'Tops', 'T-Shirt', 'Co-ords', 'Salwar Kameez', 'Leggings'],
      popular: ['Printed Kurti', 'Co-ord Set', 'Everyday Tee', 'Embroidered Salwar', 'Basic Leggings'],
      featured: [
        { name: 'Floral Kurti', price: '৳1,190', image: img('1485462537746-965f33f7f6a7', 400) },
        { name: 'Summer Co-ord', price: '৳1,690', image: img('1496747611176-843222e1e57c', 400) },
      ],
      banner: { title: "Women's New In", subtitle: 'Fresh styles weekly', image: img('1483985988355-763728e1935b', 600) },
    },
  },
  {
    label: 'Kids',
    to: '/?category=kids',
    mega: {
      categories: ['Boys', 'Girls', 'New Arrivals', 'T-Shirts', 'Frocks', 'Sets'],
      popular: ['Cartoon Tee', 'Party Frock', 'Twin Set', 'Denim Dungaree'],
      featured: [
        { name: 'Boys Combo Tee', price: '৳690', image: img('1503944583220-79d8926ad5e2', 400) },
        { name: 'Girls Frock', price: '৳990', image: img('1518831959646-742c3a14ebf7', 400) },
      ],
      banner: { title: 'Little Stars', subtitle: 'Comfy & cute', image: img('1519457431-44ccd64a579b', 600) },
    },
  },
  {
    label: 'Teens',
    to: '/?category=teens',
    mega: {
      categories: ['Teen Boys', 'Teen Girls', 'Streetwear', 'Graphic Tees', 'Joggers'],
      popular: ['Graphic Oversized Tee', 'Street Hoodie', 'Cargo Pants'],
      featured: [
        { name: 'Street Hoodie', price: '৳1,290', image: img('1542291026-7eec264c27ff', 400) },
        { name: 'Graphic Tee', price: '৳790', image: img('1521572163474-6864f9cf17ab', 400) },
      ],
      banner: { title: 'Teen Streetwear', subtitle: 'Bold & fresh', image: img('1523398002811-999ca8dec234', 600) },
    },
  },
  {
    label: 'Sports',
    to: '/?category=sports',
    mega: {
      categories: ['Football Jerseys', 'Sports T-Shirts', 'National Team', 'Active Shorts', 'Track Pants'],
      popular: ['Argentina Jersey', 'Brazil Jersey', 'Dry-Fit Tee', 'Pro Shorts'],
      featured: [
        { name: 'Home Jersey', price: '৳990', image: img('1517466787929-bc90951d0974', 400) },
        { name: 'Active Dry Tee', price: '৳650', image: img('1571019613454-1cb2f99b2d8b', 400) },
      ],
      banner: { title: 'Game Day Ready', subtitle: 'Jerseys & active wear', image: img('1577471488278-16eec37ffcc2', 600) },
    },
  },
  { label: 'New Arrivals', to: '/?category=All' },
  { label: 'Top Selling', to: '/?category=All' },
  { label: 'Free Delivery', to: '/?category=All', badge: 'Hot' },
];

export const CATEGORY_TILES = [
  { name: 'Men', count: '320+ Styles', to: '/?category=men', image: img('1516257984-b1b4d707412e', 600) },
  { name: 'Women', count: '410+ Styles', to: '/?category=women', image: img('1483985988355-763728e1935b', 600) },
  { name: 'Kids', count: '180+ Styles', to: '/?category=kids', image: img('1503944583220-79d8926ad5e2', 600) },
  { name: 'Teens', count: '150+ Styles', to: '/?category=teens', image: img('1523398002811-999ca8dec234', 600) },
  { name: 'Sports', count: '120+ Styles', to: '/?category=sports', image: img('1517466787929-bc90951d0974', 600) },
];
