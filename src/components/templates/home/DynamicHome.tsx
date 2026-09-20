import { Fragment, type ReactNode } from 'react';
import FabHero from '@/components/fab/FabHero';
import FabCategoryGrid from '@/components/fab/FabCategoryGrid';
import FabDynamicProductSection from '@/components/fab/FabDynamicProductSection';
import FabDynamicBlock from '@/components/fab/FabDynamicBlock';
import { useHomepageSections } from '@/hooks/useSupabase';
import {
  parseProductSectionConfig,
  defaultProductSectionConfig,
} from '@/lib/productSections';
import { BLOCK_SECTION_TYPES } from '@/lib/homepageBlocks';
import type { HomeProps } from './types';

// Section types that render as managed product sections.
const PRODUCT_TYPES = new Set(['flash_sale', 'product_grid', 'product_slider', 'collection', 'product']);

// Default order used as a fallback before sections load.
const DEFAULT_ORDER = [
  'hero', 'category_grid', 'flash_sale', 'top_selling', 'new_arrivals',
  'collection_men', 'collection_women', 'collection_kids', 'collection_teens', 'collection_sports',
];

// Per-template outer spacing. The dynamic content is identical across every
// template; the visual identity comes from the active theme tokens (colors,
// fonts, radius) plus these spacing rhythms.
export type HomeVariant = 'classic' | 'modern' | 'noir' | 'boutique' | 'street';

const VARIANT_MAIN: Record<HomeVariant, string> = {
  classic: 'flex flex-col gap-[30px] py-[30px] md:gap-[40px] md:py-[40px] lg:gap-[60px] lg:py-0 lg:pb-[60px]',
  modern: 'flex flex-col gap-[36px] py-[28px] md:gap-[48px] md:py-[36px] lg:gap-[64px] lg:py-0 lg:pb-[64px]',
  noir: 'flex flex-col gap-[36px] py-0 md:gap-[52px] lg:gap-[72px] lg:pb-[72px]',
  boutique: 'flex flex-col gap-[36px] py-0 md:gap-[48px] lg:gap-[64px] lg:pb-[64px]',
  street: 'flex flex-col gap-[32px] py-0 md:gap-[44px] lg:gap-[60px] lg:pb-[60px]',
};

interface Props extends HomeProps {
  variant?: HomeVariant;
}

const DynamicHome = ({ allProducts, isLoading, shared, variant = 'classic' }: Props) => {
  const { data: sections = [] } = useHomepageSections(false);
  const mainClass = VARIANT_MAIN[variant] ?? VARIANT_MAIN.classic;

  const staticRegistry: Record<string, ReactNode> = {
    hero: <FabHero />,
    category_grid: <FabCategoryGrid />,
  };

  // Fallback rendering before sections load: keep the original layout order.
  if (!sections.length) {
    return (
      <main className={mainClass}>
        {DEFAULT_ORDER.map((key) => {
          if (staticRegistry[key]) return <Fragment key={key}>{staticRegistry[key]}</Fragment>;
          if (isLoading) return null;
          const config = defaultProductSectionConfig(key);
          return (
            <FabDynamicProductSection key={key} config={config}
              allProducts={allProducts} reviewStats={shared.reviewStats}
              hoverImageMap={shared.hoverImageMap} soldOutMap={shared.soldOutMap} />
          );
        })}
      </main>
    );
  }

  return (
    <main className={mainClass}>
      {sections.map((s) => {
        if (staticRegistry[s.section_key]) return <Fragment key={s.id}>{staticRegistry[s.section_key]}</Fragment>;
        if (BLOCK_SECTION_TYPES.has(s.type)) return <FabDynamicBlock key={s.id} section={s} />;
        if (!PRODUCT_TYPES.has(s.type)) return null; // newsletter/footer handled elsewhere
        if (isLoading) return null;
        const config = parseProductSectionConfig(s.section_key, s.title, s.config);
        return (
          <FabDynamicProductSection key={s.id} config={config}
            allProducts={allProducts} reviewStats={shared.reviewStats}
            hoverImageMap={shared.hoverImageMap} soldOutMap={shared.soldOutMap} />
        );
      })}
    </main>
  );
};

export default DynamicHome;
