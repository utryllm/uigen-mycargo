import type { Prototype } from '@/types/prototype';
import { BUSINESS_DASHBOARD } from './dashboard';
import { BUSINESS_LENDING } from './lending';
import { BUSINESS_RELATIONSHIP_MANAGER } from './relationship-manager';
import { BUSINESS_ANALYTICS } from './analytics';

export const BUSINESS_PROTOTYPE: Prototype = {
  id: 'business-banking',
  name: 'Business Banking',
  persona: 'business',
  description: 'Corporate banking experience with lending tools and relationship manager access',
  icon: 'Building2',
  features: [
    'Account Dashboard',
    'Corporate Lending',
    'Relationship Manager',
    'Business Analytics',
  ],
  screens: [
    {
      id: 'dashboard',
      name: 'Dashboard',
      code: BUSINESS_DASHBOARD,
      description: 'Business account overview with balances, transactions, and quick actions',
      isHome: true,
    },
    {
      id: 'lending',
      name: 'Corporate Lending',
      code: BUSINESS_LENDING,
      description: 'Credit products, active loans, and loan applications',
    },
    {
      id: 'relationship-manager',
      name: 'Relationship Manager',
      code: BUSINESS_RELATIONSHIP_MANAGER,
      description: 'Dedicated RM profile, scheduling, and secure messaging',
    },
    {
      id: 'analytics',
      name: 'Business Analytics',
      code: BUSINESS_ANALYTICS,
      description: 'Cash flow charts, spending categories, and financial reports',
    },
  ],
};

export { BUSINESS_DASHBOARD, BUSINESS_LENDING, BUSINESS_RELATIONSHIP_MANAGER, BUSINESS_ANALYTICS };
