import { Ionicons } from '@expo/vector-icons';

export type MenuItem = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export const MENU_GROUP_1: MenuItem[] = [
  { key: 'alarms', label: 'Alarmes', icon: 'alarm-outline' },
  { key: 'settings', label: 'Paramètres', icon: 'options-outline' },
];

export const MENU_GROUP_2: MenuItem[] = [
  { key: 'rates', label: 'Tarifs', icon: 'cash-outline' },
  { key: 'pos', label: 'Points de vente', icon: 'location-sharp' },
  { key: 'news', label: 'Actualités', icon: 'newspaper-outline' },
  { key: 'contact', label: 'Nous contacter', icon: 'call' },
  { key: 'help', label: 'Aide', icon: 'help-circle-outline' },
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
