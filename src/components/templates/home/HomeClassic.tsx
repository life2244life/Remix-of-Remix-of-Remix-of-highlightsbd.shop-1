import DynamicHome from './DynamicHome';
import type { HomeProps } from './types';

// Classic template now renders the fully dynamic, admin-managed homepage
// (Hero Slider, Product Sections, Homepage Builder blocks). Visual identity
// comes from the active theme tokens + the "classic" spacing rhythm.
const HomeClassic = (props: HomeProps) => <DynamicHome {...props} variant="classic" />;

export default HomeClassic;
