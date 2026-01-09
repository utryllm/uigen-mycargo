// Sample prototypes
export { BUSINESS_PROTOTYPE } from './business';
export { RETAIL_PROTOTYPE } from './retail';

// Legacy sample (still available via /sample old)
export {
  SAMPLE_ONBOARDING_DASHBOARD,
  SAMPLE_SCREEN_NAME,
  SAMPLE_SCREEN_DESCRIPTION,
} from './onboarding-dashboard';

// Prototype map for easy access
import { BUSINESS_PROTOTYPE } from './business';
import { RETAIL_PROTOTYPE } from './retail';
import type { Prototype, PrototypeKey } from '@/types/prototype';

export const PROTOTYPES: Record<PrototypeKey, Prototype> = {
  business: BUSINESS_PROTOTYPE,
  retail: RETAIL_PROTOTYPE,
};
