import { StatusBar } from 'expo-status-bar';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppTabBar } from '@/components/shop/AppTabBar';
import { ShopToast } from '@/components/shop/ShopToast';
import { ShopCartProvider } from '@/contexts/shop-cart-context';
import { ShopTheme } from '@/constants/shop-theme';

export default function AppTabsLayout() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Tabs
        initialRouteName="boutique"
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <AppTabBar {...props} />}
      >
        <Tabs.Screen name="panier" options={{ title: 'Panier' }} />
        <Tabs.Screen name="mes-titres" options={{ title: 'Mes titres' }} />
        <Tabs.Screen name="boutique" options={{ title: 'Boutique' }} />
        <Tabs.Screen name="index" options={{ title: 'Plus' }} />
      </Tabs>
      <ShopToast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
