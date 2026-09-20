import DynamicHome from './DynamicHome';
import type { HomeProps } from './types';

// Noir template now renders the fully dynamic, admin-managed homepage
// (Hero Slider, Product Sections, Homepage Builder blocks). Visual identity
// comes from the active theme tokens + the "noir" spacing rhythm.
const HomeNoir = (props: HomeProps) => <DynamicHome {...props} variant="noir" />;

export default HomeNoir;
