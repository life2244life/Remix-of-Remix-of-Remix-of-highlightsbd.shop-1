import DynamicHome from './DynamicHome';
import type { HomeProps } from './types';

// Modern template now renders the fully dynamic, admin-managed homepage
// (Hero Slider, Product Sections, Homepage Builder blocks). Visual identity
// comes from the active theme tokens + the "modern" spacing rhythm.
const HomeModern = (props: HomeProps) => <DynamicHome {...props} variant="modern" />;

export default HomeModern;
