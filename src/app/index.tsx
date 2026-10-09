import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import SideMenu from '../components/SideMenu';
import { MENU_COLORS } from '../constants/menu';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.topBar}>
          <View style={styles.search}>
            <Ionicons name="search" size={20} color={MENU_COLORS.searchText} />
            <TextInput
              accessibilityLabel="Rechercher un itinéraire ou un arrêt"
              placeholder="Route, stop…"
              placeholderTextColor={MENU_COLORS.searchText}
              returnKeyType="search"
              style={styles.searchInput}
            />
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Voir les notifications"
            onPress={() => router.push('/notices')}
            hitSlop={10}
          >
            <Ionicons name="notifications-outline" size={24} color={MENU_COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Ouvrir le menu"
            onPress={() => setMenuOpen(true)}
            hitSlop={12}
          >
            <Ionicons name="menu" size={30} color={MENU_COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Contenu de l’écran</Text>
        </View>
      </SafeAreaView>

      <SideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={(key) => console.log('Menu :', key)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: MENU_COLORS.screenBackground },
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  search: {
    flex: 0.85,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: MENU_COLORS.searchBackground,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
  },
  searchInput: { flex: 1, color: MENU_COLORS.white, fontSize: 16, paddingVertical: 0 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { color: MENU_COLORS.white, fontSize: 20 },
});