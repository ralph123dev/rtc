import { useEffect, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  MENU_COLORS,
  MENU_GROUP_1,
  MENU_GROUP_2,
  type MenuItem,
} from '../constants/menu';

type Props = {
  open: boolean;
  onClose: () => void;
  onNavigate?: (key: string) => void;
};

type SocialIconName = 'facebook' | 'twitter-x' | 'youtube';

const SOCIAL_ICON_PATHS: Record<SocialIconName, string> = {
  facebook:
    'M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58-.001-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951',
  'twitter-x':
    'M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z',
  youtube:
    'M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z',
};

function SocialIcon({ name }: { name: SocialIconName }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 16 16">
      <Path d={SOCIAL_ICON_PATHS[name]} fill={MENU_COLORS.white} />
    </Svg>
  );
}

export default function SideMenu({ open, onClose, onNavigate }: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const menuWidth = width * 0.8;
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [open, progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [menuWidth, 0],
  });

  const renderItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.key}
      accessibilityRole="button"
      style={styles.item}
      onPress={() => {
        onNavigate?.(item.key);
        onClose();
      }}
    >
      <Ionicons name={item.icon} size={26} color={MENU_COLORS.itemText} style={styles.icon} />
      <Text style={styles.label}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container} pointerEvents={open ? 'auto' : 'none'}>
      <Animated.View style={[styles.overlay, { opacity: progress }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fermer le menu"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.panel,
          { width: menuWidth, paddingTop: insets.top + 16, transform: [{ translateX }] },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>RTC</Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Fermer le menu"
            onPress={onClose}
            hitSlop={12}
          >
            <Ionicons name="close" size={34} color={MENU_COLORS.white} />
          </TouchableOpacity>
        </View>

        {MENU_GROUP_1.map(renderItem)}
        <View style={styles.divider} />
        {MENU_GROUP_2.map(renderItem)}
        <View style={styles.divider} />

        <View style={styles.footerRow}>
          <Text style={styles.language}>Français</Text>
          <Text style={styles.version}>RTC 2.1.6</Text>
        </View>

        <View style={styles.social}>
          <SocialIcon name="facebook" />
          <SocialIcon name="twitter-x" />
          <SocialIcon name="youtube" />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: StyleSheet.absoluteFill,
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: MENU_COLORS.overlay,
  },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: MENU_COLORS.panelBackground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  logo: {
    color: MENU_COLORS.logo,
    fontSize: 32,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 19,
  },
  icon: { width: 40 },
  label: { color: MENU_COLORS.itemText, fontSize: 22, marginLeft: 20 },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: MENU_COLORS.divider,
    marginVertical: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  language: { color: MENU_COLORS.itemText, fontSize: 20 },
  version: {
    color: MENU_COLORS.versionText,
    fontSize: 14,
    alignSelf: 'center',
  },
  social: {
    flexDirection: 'row',
    gap: 32,
    paddingHorizontal: 24,
  },
});
