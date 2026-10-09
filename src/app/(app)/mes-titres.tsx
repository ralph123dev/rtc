import { useState } from 'react';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MesTitres() {
  const [selectedTab, setSelectedTab] = useState<'current' | 'remaining'>('remaining');
  const isCurrentTab = selectedTab === 'current';

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
          <Text style={styles.title}>Mes titres</Text>
          <View style={styles.tabsContainer}>
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: isCurrentTab }}
              onPress={() => setSelectedTab('current')}
              style={[styles.tab, isCurrentTab ? styles.tabActive : styles.tabInactive]}
            >
              <Text style={isCurrentTab ? styles.tabTextActive : styles.tabTextInactive}>
                Titres en cours
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: !isCurrentTab }}
              onPress={() => setSelectedTab('remaining')}
              style={[styles.tab, !isCurrentTab ? styles.tabActive : styles.tabInactive]}
            >
              <Text style={!isCurrentTab ? styles.tabTextActive : styles.tabTextInactive}>
                Titres restants
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.emptyState}>
          <Image
            source={require('../../../assets/images/img/titres.png')}
            contentFit="contain"
            accessibilityLabel="Ticket vide"
            style={styles.ticketImage}
          />

          <Text style={styles.emptyText}>
            {isCurrentTab
              ? "Vous n'avez aucun titre en cours"
              : "Vous n'avez aucun titre restant"}
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/boutique')}
            style={({ pressed }) => [styles.button, pressed && styles.pressedButton]}
          >
            <Text style={styles.buttonText}>Acheter des titres</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#15366F',
  },
  logoBar: {
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#15366F',
  },
  logo: {
    width: 116,
    height: 58,
  },
  page: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  hero: {
    height: 204,
    paddingTop: 42,
    paddingHorizontal: 28,
    backgroundColor: '#1C4698',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '600',
  },
  tabsContainer: {
    position: 'absolute',
    right: 20,
    bottom: -22,
    left: 20,
    height: 48,
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.16)',
    elevation: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInactive: {
    backgroundColor: '#FFFFFF',
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#1C4698',
  },
  tabTextInactive: {
    color: '#171717',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#171717',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 24,
  },
  ticketImage: {
    width: 120,
    height: 90,
  },
  emptyText: {
    color: '#131313',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    minHeight: 48,
    borderRadius: 8,
    backgroundColor: '#1C4698',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  pressedButton: {
    opacity: 0.82,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
