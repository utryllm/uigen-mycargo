import type { Prototype } from '@/types/prototype';
import { RETAIL_DASHBOARD } from './dashboard';
import { RETAIL_PAYMENTS } from './payments';
import { RETAIL_SAVINGS_GOALS } from './savings-goals';
import { RETAIL_SMART_WEALTH } from './smart-wealth';

export const RETAIL_PROTOTYPE: Prototype = {
  id: 'retail-banking',
  name: 'Retail Banking',
  persona: 'retail',
  description: 'Personal banking with payments, savings goals, and wealth management',
  icon: 'User',
  features: [
    'Account Dashboard',
    'Everyday Payments',
    'Savings Goals',
    'SmartWealth',
  ],
  screens: [
    {
      id: 'dashboard',
      name: 'Dashboard',
      code: RETAIL_DASHBOARD,
      description: 'Personal account overview with balances, transactions, and spending insights',
      isHome: true,
    },
    {
      id: 'payments',
      name: 'Payments',
      code: RETAIL_PAYMENTS,
      description: 'Send money, pay bills, and manage scheduled payments',
    },
    {
      id: 'savings-goals',
      name: 'Savings Goals',
      code: RETAIL_SAVINGS_GOALS,
      description: 'Track and achieve your financial goals',
    },
    {
      id: 'smart-wealth',
      name: 'SmartWealth',
      code: RETAIL_SMART_WEALTH,
      description: 'Portfolio overview, investments, and advisor access',
    },
  ],
};

export { RETAIL_DASHBOARD, RETAIL_PAYMENTS, RETAIL_SAVINGS_GOALS, RETAIL_SMART_WEALTH };
