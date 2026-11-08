import {
  AppleLogo,
  CalendarCheck,
  ChatCircleText,
  Flask,
  Gear,
  Heart,
  Leaf,
  Pill,
  ShieldCheck,
  Sparkle,
  Stethoscope,
  Tooth,
  User,
  Watch,
  type Icon,
} from '@phosphor-icons/react';
import { paths } from '../../routes/paths';

export interface NavItem {
  id: string;
  label: string;
  icon: Icon;
  /** Items without a route are shown but not yet navigable. */
  to?: string;
  /** Match only the exact path, so the home page is not active on every page. */
  end?: boolean;
}

export const primaryNav: NavItem[] = [
  { id: 'insights', label: 'Wellness Insights', icon: Sparkle, to: paths.home, end: true },
  { id: 'my-health', label: 'My Health', icon: Heart, to: paths.myHealth },
  { id: 'skin', label: 'Skin & Aesthetics', icon: User, to: paths.skin },
  { id: 'dental', label: 'Dental', icon: Tooth, to: paths.dental },
  { id: 'medical', label: 'Medical', icon: Stethoscope, to: paths.medical },
  { id: 'lifestyle', label: 'Lifestyle', icon: Leaf, to: paths.lifestyle },
  { id: 'nutrition', label: 'Nutrition', icon: AppleLogo, to: paths.nutrition },
  { id: 'preventive', label: 'Preventive & Longevity', icon: ShieldCheck, to: paths.preventive },
  { id: 'labs', label: 'Labs & Biomarkers', icon: Flask },
  { id: 'wearables', label: 'Wearables', icon: Watch },
  { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
];

export const secondaryNav: NavItem[] = [
  { id: 'appointments', label: 'Appointments', icon: CalendarCheck, to: paths.appointments },
  { id: 'messages', label: 'Messages', icon: ChatCircleText },
  { id: 'settings', label: 'Settings', icon: Gear },
];
