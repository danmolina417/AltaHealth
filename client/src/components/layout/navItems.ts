import {
  CalendarCheck,
  ChatCircleText,
  Flask,
  Gear,
  Heart,
  House,
  Leaf,
  Sparkle,
  Stethoscope,
  Tooth,
  User,
  type Icon,
} from '@phosphor-icons/react';
import { paths } from '../../routes/paths';

export interface NavItem {
  id: string;
  label: string;
  icon: Icon;
  /** Items without a route are shown but not yet navigable. */
  to?: string;
  /** Match only the exact path, so Home is not active on every page. */
  end?: boolean;
}

export const primaryNav: NavItem[] = [
  { id: 'home', label: 'Home', icon: House, to: paths.home, end: true },
  { id: 'my-health', label: 'My Health', icon: Heart, to: paths.myHealth },
  { id: 'skin', label: 'Skin & Aesthetics', icon: User, to: paths.skin },
  { id: 'dental', label: 'Dental', icon: Tooth, to: paths.dental },
  { id: 'medical', label: 'Medical', icon: Stethoscope, to: paths.medical },
  { id: 'lifestyle', label: 'Lifestyle & Nutrition', icon: Leaf, to: paths.lifestyle },
  { id: 'labs', label: 'Labs & Biomarkers', icon: Flask },
  { id: 'insights', label: 'Wellness Insights', icon: Sparkle },
];

export const secondaryNav: NavItem[] = [
  { id: 'appointments', label: 'Appointments', icon: CalendarCheck },
  { id: 'messages', label: 'Messages', icon: ChatCircleText },
  { id: 'settings', label: 'Settings', icon: Gear },
];
