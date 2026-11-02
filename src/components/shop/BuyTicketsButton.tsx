import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { ShopTheme } from '@/constants/shop-theme';

export function BuyTicketsButton({
  accessibilityLabel = 'Acheter des titres',
}: {
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={() => router.push('/boutique')}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={styles.buttonText}>Acheter des titres</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: ShopTheme.colors.blue,
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 18,
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonText: {
    color: ShopTheme.colors.card,
    fontFamily: ShopTheme.fonts.medium,
    fontSize: 14,
  },
});
