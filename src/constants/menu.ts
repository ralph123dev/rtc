import { Ionicons } from '@expo/vector-icons';

export type MenuItem = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export const MENU_GROUP_1: MenuItem[] = [
  { key: 'notices', label: 'Notices', icon: 'notifications-outline' },
  { key: 'alarms', label: 'Alarms', icon: 'alarm-outline' },
  { key: 'settings', label: 'Settings', icon: 'options-outline' },
];

export const MENU_GROUP_2: MenuItem[] = [
  { key: 'rates', label: 'Rates', icon: 'cash-outline' },
  { key: 'pos', label: 'Points of sale', icon: 'location-sharp' },
  { key: 'news', label: 'News', icon: 'newspaper-outline' },
  { key: 'contact', label: 'Contact us', icon: 'call' },
  { key: 'help', label: 'Help', icon: 'help-circle-outline' },
];

export const MENU_COLORS = {
  screenBackground: '#0A1F44',
  panelBackground: '#003A8C',
  overlay: 'rgba(0,0,0,0.5)',
  itemText: '#C9DCFF',
  logo: '#7ED321',
  white: '#FFFFFF',
  versionText: 'rgba(201,220,255,0.6)',
  divider: 'rgba(255,255,255,0.15)',
  searchBackground: 'rgba(255,255,255,0.1)',
  searchText: '#9bb4e0',
} as const;
