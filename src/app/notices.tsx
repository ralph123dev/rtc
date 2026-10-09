import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MENU_COLORS } from '../constants/menu';

const noticeSections = [
  { key: 'favorites', label: 'Favoris', emptyMessage: 'Aucun avis favori pour le moment.' },
  { key: 'general', label: 'General', emptyMessage: 'Aucun avis général pour le moment.' },
  { key: 'others', label: 'Others', emptyMessage: 'Aucun autre avis pour le moment.' },
] as const;

type NoticeSection = (typeof noticeSections)[number]['key'];

export default function Notices() {
  const [selectedSection, setSelectedSection] = useState<NoticeSection>('favorites');
  const activeSection =
    noticeSections.find((section) => section.key === selectedSection) ?? noticeSections[0];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retour"
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={26} color={MENU_COLORS.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Notices</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.tabs}>
          {noticeSections.map((section) => {
            const selected = section.key === selectedSection;

            return (
              <Pressable
                key={section.key}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                onPress={() => setSelectedSection(section.key)}
                style={[styles.tab, selected && styles.selectedTab]}
              >
                <Text style={[styles.tabLabel, selected && styles.selectedTabLabel]}>
                  {section.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.section} accessibilityLiveRegion="polite">
          <Text style={styles.emptyMessage}>{activeSection.emptyMessage}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: MENU_COLORS.screenBackground,
  },
  header: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: MENU_COLORS.panelBackground,
  },
  backButton: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: '30%',
  },
  headerTitle: {
    color: MENU_COLORS.white,
    fontSize: 20,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  tab: {
    flex: 1,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: MENU_COLORS.panelBackground,
  },
  selectedTab: {
    backgroundColor: MENU_COLORS.white,
  },
  tabLabel: {
    color: MENU_COLORS.itemText,
    fontSize: 15,
    fontWeight: '600',
  },
  selectedTabLabel: {
    color: MENU_COLORS.panelBackground,
  },
  section: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 48,
  },
  emptyMessage: {
    color: MENU_COLORS.itemText,
    fontSize: 16,
    textAlign: 'center',
  },
});
