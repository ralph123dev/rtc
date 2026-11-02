import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ShopProduct } from '@/data/shop-products';
import { formatShopPrice } from '@/data/shop-products';
import { ShopTheme } from '@/constants/shop-theme';
import { BasketPlusIcon } from '@/components/shop/ShopIcons';
import { useShopCart } from '@/contexts/shop-cart-context';

export function ProductCard({
  product,
  onAdd,
  onJustification,
}: {
  product: ShopProduct;
  onAdd: (product: ShopProduct) => void;
  onJustification: (product: ShopProduct) => void;
}) {
  const { getItemCount, removeProduct } = useShopCart();
  const count = getItemCount(product.id);

  return (
    <View style={styles.card}>
      {/* Top row: image + title + price */}
      <View style={styles.productRow}>
        <Image
          source={product.image}
          contentFit="contain"
          accessibilityLabel={`Billet : ${product.title}`}
          style={styles.ticketImage}
        />
        <Text allowFontScaling={false} style={styles.title}>
          {product.title}
        </Text>
        <Text allowFontScaling={false} numberOfLines={1} style={styles.price}>
          {formatShopPrice(product.priceInCents)}
        </Text>
      </View>

      {/* Bottom row: quantity or add-to-cart button */}
      <View style={styles.bottomRow}>
        {count > 0 ? (
          <View style={styles.quantityRow}>
            <View style={styles.quantityBadge}>
              <Text style={styles.quantityText}>{count}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Retirer ${product.title} du panier`}
              onPress={() => removeProduct(product.id)}
              style={({ pressed }) => [styles.trashButton, pressed && styles.buttonPressed]}
            >
              <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
            </Pressable>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Ajouter ${product.title} au panier`}
            onPress={() => onAdd(product)}
            style={({ pressed }) => [styles.addButton, pressed && styles.buttonPressed]}
          >
            <BasketPlusIcon />
          </Pressable>
        )}
      </View>

      {product.requiresJustification && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Fournir les justificatifs nécessaires pour ${product.title}`}
          onPress={() => onJustification(product)}
          style={({ pressed }) => [
            styles.justificationButton,
            pressed && styles.justificationButtonPressed,
          ]}
        >
          <Text style={styles.justificationButtonText}>Justificatifs nécessaires</Text>
        </Pressable>
      )}
    </View>
  );
}

const BUTTON_SIZE = 38;

const styles = StyleSheet.create({
  card: {
    backgroundColor: ShopTheme.colors.card,
    borderRadius: 12,
    boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.12)',
    elevation: 3,
    paddingBottom: 12,
    paddingHorizontal: 14,
    paddingLeft: 14,
    paddingTop: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  productRow: {
    alignItems: 'flex-start',
    columnGap: 12,
    flexDirection: 'row',
  },
  ticketImage: {
    height: 52,
    width: 58,
  },
  title: {
    color: ShopTheme.colors.text,
    flex: 1,
    fontFamily: ShopTheme.fonts.regular,
    fontSize: 15,
    lineHeight: 20,
    minWidth: 0,
    paddingTop: 4,
  },
  price: {
    color: ShopTheme.colors.text,
    flexShrink: 0,
    fontFamily: ShopTheme.fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    paddingTop: 4,
  },
  bottomRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  quantityRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  quantityBadge: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#737373',
    borderRadius: 5,
    borderWidth: 1,
    height: BUTTON_SIZE,
    justifyContent: 'center',
    width: BUTTON_SIZE,
  },
  quantityText: {
    color: '#000000',
    fontFamily: ShopTheme.fonts.bold,
    fontSize: 18,
  },
  trashButton: {
    alignItems: 'center',
    backgroundColor: ShopTheme.colors.navy,
    borderRadius: 5,
    height: BUTTON_SIZE,
    justifyContent: 'center',
    width: BUTTON_SIZE,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#737373',
    borderRadius: 5,
    borderWidth: 1,
    height: BUTTON_SIZE,
    justifyContent: 'center',
    width: BUTTON_SIZE,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  justificationButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderColor: ShopTheme.colors.text,
    borderRadius: 24,
    borderWidth: 1.5,
    justifyContent: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  justificationButtonPressed: {
    backgroundColor: ShopTheme.colors.pressed,
  },
  justificationButtonText: {
    color: ShopTheme.colors.active,
    fontFamily: ShopTheme.fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
});
