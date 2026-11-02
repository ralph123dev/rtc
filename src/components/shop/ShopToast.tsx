import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShopTheme } from '@/constants/shop-theme';
import { useShopCart } from '@/contexts/shop-cart-context';

export function ShopToast() {
  const { toastMessage, dismissToast } = useShopCart();
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    if (toastMessage === null) {
      return;
    }

    opacity.setValue(0);
    translateY.setValue(10);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 10, duration: 250, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) dismissToast();
      });
    }, 1550);

    return () => clearTimeout(timer);
  }, [dismissToast, opacity, toastMessage, translateY]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.toast,
        { bottom: ShopTheme.dimensions.tabBarHeight + insets.bottom + 12 },
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <Text allowFontScaling={false} style={styles.text}>
        {toastMessage}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    backgroundColor: ShopTheme.colors.toast,
    borderRadius: 8,
    left: ShopTheme.spacing.toastHorizontal,
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    right: ShopTheme.spacing.toastHorizontal,
    zIndex: 10,
  },
  text: {
    color: '#FFFFFF',
    fontFamily: ShopTheme.fonts.regular,
    fontSize: 15,
  },
});
