export interface PrototypeScreen {
  id: string;           // e.g., "dashboard", "payments"
  name: string;         // Display name
  code: string;         // React component code
  description: string;
  isHome?: boolean;     // Landing page
}

export interface Prototype {
  id: string;           // e.g., "business-banking"
  name: string;
  persona: 'business' | 'retail';
  description: string;
  icon: string;         // Icon name from lucide-react
  features: string[];   // Feature list for selector card
  screens: PrototypeScreen[];
}

export type PrototypeKey = 'business' | 'retail';
