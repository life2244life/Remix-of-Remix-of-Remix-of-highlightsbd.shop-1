import DynamicHome from './DynamicHome';
import type { HomeProps } from './types';

// Boutique template now renders the fully dynamic, admin-managed homepage
// (Hero Slider, Product Sections, Homepage Builder blocks). Visual identity
// comes from the active theme tokens + the "boutique" spacing rhythm.
const HomeBoutique = (props: HomeProps) => <DynamicHome {...props} variant="boutique" />;

export default HomeBoutique;
