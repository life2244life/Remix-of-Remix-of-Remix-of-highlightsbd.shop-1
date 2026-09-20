import DynamicHome from './DynamicHome';
import type { HomeProps } from './types';

// Street template now renders the fully dynamic, admin-managed homepage
// (Hero Slider, Product Sections, Homepage Builder blocks). Visual identity
// comes from the active theme tokens + the "street" spacing rhythm.
const HomeStreet = (props: HomeProps) => <DynamicHome {...props} variant="street" />;

export default HomeStreet;
