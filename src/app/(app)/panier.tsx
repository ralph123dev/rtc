import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

function EmptyBasketIcon() {
  return (
    <Svg
      width={174}
      height={174}
      viewBox="0 0 128 128"
      accessibilityLabel="Illustration d’un panier vide"
    >
      <Path
        d="M27 49 51 20m50 29L77 20M18 51h92v12H18zm4 13 8 47q1 7 9 7h50q8 0 9-7l8-47"
        fill="none"
        stroke="#C8C8C8"
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M43 79v20m21-20v20m21-20v20"
        fill="none"
        stroke="#C8C8C8"
        strokeWidth={7}
      />
    </Svg>
  );
}

export default function Panier() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.logoBar}>
        <Image
          source={require('../../../assets/images/img/rtc.png')}
          contentFit="contain"
          accessibilityLabel="RTC logo"
          style={styles.logo}
        />
      </View>

      <View style={styles.page}>
        <View style={styles.hero}>
          <Text style={styles.title}>Panier</Text>
          <View style={styles.emptyNotice}>
            <Text style={styles.emptyNoticeText}>Votre panier est vide</Text>
          </View>
        </View>

        <View style={styles.emptyContent}>
          <EmptyBasketIcon />
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/boutique')}
            style={({ pressed }) => [styles.purchaseButton, pressed && styles.pressedButton]}
          >
            <Text style={styles.purchaseButtonText}>Acheter des titres</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const COLORS = {
  background: '#F2F2F2',
  navy: '#15366F',
  blue: '#1C4698',
  text: '#171717',
  emptyIcon: '#C8C8C8',
  white: '#FFFFFF',
} as const;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },
  logoBar: {
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.navy,
  },
  logo: {
    width: 116,
    height: 58,
  },
  page: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  hero: {
    height: 204,
    paddingTop: 42,
    paddingHorizontal: 28,
    backgroundColor: COLORS.blue,
  },
  title: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: '600',
  },
  emptyNotice: {
    position: 'absolute',
    right: 20,
    bottom: -38,
    left: 20,
    minHeight: 76,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.16)',
    elevation: 4,
  },
  emptyNoticeText: {
    color: COLORS.text,
    fontSize: 20,
    textAlign: 'center',
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 46,
    paddingHorizontal: 24,
    paddingTop: 38,
    paddingBottom: 24,
  },
  purchaseButton: {
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: COLORS.blue,
  },
  pressedButton: {
    opacity: 0.82,
  },
  purchaseButtonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '500',
  },
});
