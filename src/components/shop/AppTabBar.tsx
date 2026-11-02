import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ComponentProps } from 'react';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShopCart } from '@/contexts/shop-cart-context';
import { ShopTheme } from '@/constants/shop-theme';
import { ShopTabIcon } from '@/components/shop/ShopIcons';

type AppTabBarProps = Parameters<
  NonNullable<ComponentProps<typeof Tabs>['tabBar']>
>[0];

const tabLabels: Record<string, string> = {
  panier: 'Panier',
  'mes-titres': 'Mes titres',
  boutique: 'Boutique',
  index: 'Plus',
};

const tabIcons = {
  panier: 'basket',
  'mes-titres': 'ticket',
  boutique: 'shop',
  index: 'grid',
} as const;

export function AppTabBar({ state, descriptors, emitter, navigateToTab }: AppTabBarProps) {
  const insets = useSafeAreaInsets();
  const { itemCount } = useShopCart();

  return (
    <View
      style={[
        styles.bar,
        {
          height: ShopTheme.dimensions.tabBarHeight + insets.bottom,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const label = tabLabels[route.name] ?? descriptors[route.key].options.title ?? route.name;
        const icon = tabIcons[route.name as keyof typeof tabIcons];
        const color = focused ? ShopTheme.colors.active : ShopTheme.colors.inactive;

        const onPress = () => {
          const event = emitter.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigateToTab(route.key);
          }
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityLabel={descriptors[route.key].options.tabBarAccessibilityLabel ?? label}
            accessibilityState={focused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tab}
          >
            {focused && <View style={styles.indicator} />}
            <View style={styles.iconContainer}>
              {icon && <ShopTabIcon name={icon} color={color} />}
              {route.name === 'panier' && itemCount > 0 && (
                <View style={styles.badge}>
                  <Text allowFontScaling={false} style={styles.badgeText}>
                    {itemCount}
                  </Text>
                </View>
              )}
            </View>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={[styles.label, focused ? styles.labelActive : styles.labelInactive]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: ShopTheme.colors.tabBackground,
    borderTopColor: ShopTheme.colors.tabBorder,
    borderTopWidth: 2,
    flexDirection: 'row',
    flexShrink: 0,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
    paddingTop: 12,
    position: 'relative',
  },
  indicator: {
    backgroundColor: ShopTheme.colors.blue,
    height: ShopTheme.dimensions.tabIndicatorHeight,
    left: '50%',
    marginLeft: -ShopTheme.dimensions.tabIndicatorWidth / 2,
    position: 'absolute',
    top: -2,
    width: ShopTheme.dimensions.tabIndicatorWidth,
  },
  iconContainer: {
    alignItems: 'center',
    height: ShopTheme.dimensions.tabIconSize,
    justifyContent: 'center',
    position: 'relative',
    width: ShopTheme.dimensions.tabIconSize,
  },
  label: {
    fontSize: 15,
    lineHeight: 18,
  },
  labelActive: {
    color: ShopTheme.colors.active,
    fontFamily: ShopTheme.fonts.bold,
  },
  labelInactive: {
    color: ShopTheme.colors.inactive,
    fontFamily: ShopTheme.fonts.regular,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: '#DC2626',
    borderRadius: 10,
    height: 19,
    justifyContent: 'center',
    left: ShopTheme.dimensions.tabIconSize / 2 + 3,
    minWidth: 19,
    paddingHorizontal: 4,
    position: 'absolute',
    top: -5,
  },
  badgeText: {
    color: '#FFFFFF',
    fontFamily: ShopTheme.fonts.bold,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },
});
