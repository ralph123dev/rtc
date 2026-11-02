import { useRef, useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View, type ScrollView } from 'react-native';
import { AppPage } from '@/components/shop/AppPage';
import { CategorySelect } from '@/components/shop/CategorySelect';
import { ProductCard } from '@/components/shop/ProductCard';
import { useShopCart } from '@/contexts/shop-cart-context';
import { useAuth } from '@/contexts/auth-context';
import { useActiveTicket } from '@/contexts/active-ticket-context';
import { ShopTheme } from '@/constants/shop-theme';
import { SHOP_PRODUCTS, type ShopCategory, type ShopProduct } from '@/data/shop-products';

export function BoutiqueScreen() {
  const [category, setCategory] = useState<ShopCategory>('RTC - Général');
  const scrollRef = useRef<ScrollView>(null);
  const { addItem, showToast } = useShopCart();
  const { user } = useAuth();
  const { activateTicket } = useActiveTicket();

  const handleAdd = (product: ShopProduct) => {
    addItem(product);
    showToast(`${product.title} ajouté au panier`);
  };

  const handleJustification = () => {
    router.push('/connexion');
  };

  const handleCategoryChange = (nextCategory: ShopCategory) => {
    setCategory(nextCategory);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  return (
    <AppPage title="Boutique" titleFontSize={23} scrollRef={scrollRef} showProfile>
      <CategorySelect value={category} onChange={handleCategoryChange} />
      <View style={styles.productList}>
        {SHOP_PRODUCTS[category].map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={handleAdd}
            onJustification={handleJustification}
          />
        ))}
      </View>
    </AppPage>
  );
}

const styles = StyleSheet.create({
  productList: {
    gap: 18,
    paddingBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
