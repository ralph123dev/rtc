import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { AppPage } from '@/components/shop/AppPage';
import { BuyTicketsButton } from '@/components/shop/BuyTicketsButton';
import { ShopTheme } from '@/constants/shop-theme';
import { formatShopPrice } from '@/data/shop-products';
import { useShopCart } from '@/contexts/shop-cart-context';
import { useActiveTicket } from '@/contexts/active-ticket-context';

export function PanierScreen() {
  const { groupedItems, items, itemCount, totalInCents, removeProduct, clearCart, showToast } =
    useShopCart();
  const { addPurchasedTickets } = useActiveTicket();
  const [cgvAccepted, setCgvAccepted] = useState(true);

  const handleValidateCart = async () => {
    if (!cgvAccepted) {
      showToast('Veuillez accepter les CGV et les CGU');
      return;
    }

    if (items.length === 0) return;

    try {
      await addPurchasedTickets(items.map((item) => item.product));
    } catch {
      showToast('Impossible d’enregistrer vos titres. Veuillez réessayer.');
      return;
    }

    clearCart();
    router.push({
      pathname: '/(app)/mes-titres',
      params: { tab: 'current' },
    });
  };

  return (
    <AppPage title="Panier" titleFontSize={23} showProfile>
      <View style={styles.container}>
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyNotice}>
              <Text style={styles.emptyNoticeText}>Votre panier est vide</Text>
            </View>
            <View style={styles.emptyState}>
              <Svg
                width={174}
                height={174}
                viewBox="0 0 128 128"
                accessibilityLabel="Illustration d’un panier vide"
              >
                <Path
                  d="M27 49 51 20m50 29L77 20M18 51h92v12H18zm4 13 8 47q1 7 9 7h50q8 0 9-7l8-47"
                  fill="none"
                  stroke={ShopTheme.colors.border}
                  strokeWidth={7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M43 79v20m21-20v20m21-20v20"
                  fill="none"
                  stroke={ShopTheme.colors.border}
                  strokeWidth={7}
                />
              </Svg>
              <View style={styles.purchaseButtonSpacing}>
                <BuyTicketsButton />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.cartContent}>
            {/* Top Notice: Vous avez X article(s) dans votre panier */}
            <View style={styles.headerNoticeCard}>
              <Text style={styles.headerNoticeText}>
                Vous avez{' '}
                <Text style={styles.headerNoticeBold}>
                  {itemCount} {itemCount > 1 ? 'articles' : 'article'}
                </Text>{' '}
                dans votre panier
              </Text>
            </View>

            {/* List of Cart Items */}
            <View style={styles.itemsList}>
              {groupedItems.map((item) => (
                <View key={item.product.id} style={styles.itemCard}>
                  {/* Top row: Image + Title + Price */}
                  <View style={styles.itemTopRow}>
                    <View style={styles.imageFrame}>
                      <Image
                        source={item.product.image}
                        contentFit="contain"
                        style={styles.ticketImage}
                        accessibilityLabel={`Billet : ${item.product.title}`}
                      />
                    </View>
                    <Text allowFontScaling={false} style={styles.itemTitle}>
                      {item.product.title}
                    </Text>
                    <Text allowFontScaling={false} style={styles.itemPrice}>
                      {formatShopPrice(item.product.priceInCents)}
                    </Text>
                  </View>

                  {/* Quantity and Delete Controls */}
                  <View style={styles.quantityRow}>
                    <View style={styles.quantityBadge}>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Supprimer ${item.product.title} du panier`}
                      onPress={() => removeProduct(item.product.id)}
                      style={({ pressed }) => [styles.trashButton, pressed && styles.buttonPressed]}
                    >
                      <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
                    </Pressable>
                  </View>

                  {/* Sous-total row */}
                  <View style={styles.subtotalRow}>
                    <Text style={styles.subtotalLabel}>Sous-total</Text>
                    <Text style={styles.subtotalAmount}>
                      {formatShopPrice(item.subtotalInCents)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Terms checkbox */}
            <View style={styles.termsRow}>
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: cgvAccepted }}
                accessibilityLabel="J'accepte les CGV et les CGU"
                onPress={() => setCgvAccepted((prev) => !prev)}
                style={[styles.checkbox, cgvAccepted && styles.checkboxChecked]}
              >
                {cgvAccepted && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </Pressable>
              <View style={styles.termsTextWrapper}>
                <Text style={styles.termsText}>J&apos;accepte </Text>
                <Pressable
                  accessibilityRole="link"
                  accessibilityLabel="Consulter les CGV et les CGU"
                  onPress={() => router.push('/cgu-cgv')}
                >
                  <Text style={styles.termsLink}>les CGV et les CGU</Text>
                </Pressable>
              </View>
            </View>

            {/* Total and Checkout box */}
            <View style={styles.checkoutBox}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>{formatShopPrice(totalInCents)}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Valider mon panier"
                onPress={handleValidateCart}
                style={({ pressed }) => [
                  styles.validateButton,
                  !cgvAccepted && styles.validateButtonDisabled,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.validateButtonText}>Valider mon panier</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </AppPage>
  );
}

const CARD_IMAGE_SIZE = 70;
const BUTTON_SIZE = 38;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 32,
  },
  cartContent: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    marginTop: -32,
    paddingHorizontal: 16,
  },
  headerNoticeCard: {
    alignItems: 'center',
    backgroundColor: ShopTheme.colors.card,
    borderRadius: 12,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
    justifyContent: 'center',
    marginTop: -32,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerNoticeText: {
    color: ShopTheme.colors.text,
    fontFamily: ShopTheme.fonts.regular,
    fontSize: 15,
    textAlign: 'center',
  },
  headerNoticeBold: {
    fontFamily: ShopTheme.fonts.bold,
  },
  itemsList: {
    gap: 16,
    marginTop: 14,
  },
  itemCard: {
    backgroundColor: ShopTheme.colors.card,
    borderRadius: 12,
    boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.12)',
    elevation: 3,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  itemTopRow: {
    alignItems: 'flex-start',
    columnGap: 12,
    flexDirection: 'row',
  },
  imageFrame: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#CCCCCC',
    borderRadius: 8,
    borderWidth: 1,
    height: CARD_IMAGE_SIZE,
    justifyContent: 'center',
    width: CARD_IMAGE_SIZE,
  },
  ticketImage: {
    height: 52,
    width: 58,
  },
  itemTitle: {
    color: ShopTheme.colors.text,
    flex: 1,
    fontFamily: ShopTheme.fonts.regular,
    fontSize: 15,
    lineHeight: 20,
    minWidth: 0,
    paddingTop: 4,
  },
  itemPrice: {
    color: ShopTheme.colors.text,
    flexShrink: 0,
    fontFamily: ShopTheme.fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    paddingTop: 4,
  },
  quantityRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    marginTop: 4,
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
  subtotalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  subtotalLabel: {
    color: '#000000',
    fontFamily: ShopTheme.fonts.bold,
    fontSize: 16,
  },
  subtotalAmount: {
    color: '#000000',
    fontFamily: ShopTheme.fonts.bold,
    fontSize: 16,
  },
  termsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
    marginTop: 28,
  },
  checkbox: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#737373',
    borderRadius: 4,
    borderWidth: 1.5,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  checkboxChecked: {
    backgroundColor: ShopTheme.colors.navy,
    borderColor: ShopTheme.colors.navy,
  },
  termsTextWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  termsText: {
    color: '#000000',
    fontFamily: ShopTheme.fonts.regular,
    fontSize: 15,
  },
  termsLink: {
    color: '#000000',
    fontFamily: ShopTheme.fonts.bold,
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  checkoutBox: {
    backgroundColor: ShopTheme.colors.navy,
    borderRadius: 10,
    elevation: 3,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  totalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    color: '#FFFFFF',
    fontFamily: ShopTheme.fonts.bold,
    fontSize: 20,
  },
  totalAmount: {
    color: '#FFFFFF',
    fontFamily: ShopTheme.fonts.bold,
    fontSize: 20,
  },
  validateButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    marginTop: 16,
    width: '100%',
  },
  validateButtonDisabled: {
    opacity: 0.5,
  },
  validateButtonText: {
    color: '#000000',
    fontFamily: ShopTheme.fonts.bold,
    fontSize: 15,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  emptyNotice: {
    alignItems: 'center',
    backgroundColor: ShopTheme.colors.card,
    borderRadius: 16,
    boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.16)',
    elevation: 4,
    justifyContent: 'center',
    minHeight: 76,
    paddingHorizontal: 16,
  },
  emptyNoticeText: {
    color: ShopTheme.colors.text,
    fontFamily: ShopTheme.fonts.regular,
    fontSize: 20,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    gap: 28,
    justifyContent: 'center',
    paddingBottom: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  purchaseButtonSpacing: {
    marginTop: 24,
  },
});
