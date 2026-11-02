import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { ReactNode, RefObject } from 'react';
import { ShopTheme } from '@/constants/shop-theme';
import { AppHeader } from '@/components/shop/AppHeader';

export function PageHero({
  title,
  titleFontSize = 28,
}: {
  title: string;
  titleFontSize?: number;
}) {
  return (
    <View style={styles.hero}>
      <Text style={[styles.title, { fontSize: titleFontSize, lineHeight: titleFontSize + 6 }]}>
        {title}
      </Text>
    </View>
  );
}

export function AppPage({
  title,
  children,
  scrollRef,
  showProfile = false,
  titleFontSize,
}: {
  title: string;
  children: ReactNode;
  scrollRef?: RefObject<ScrollView | null>;
  showProfile?: boolean;
  titleFontSize?: number;
}) {
  return (
    <View style={styles.screen}>
      <AppHeader showProfile={showProfile} />
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PageHero title={title} titleFontSize={titleFontSize} />
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: ShopTheme.colors.page,
    flex: 1,
  },
  scrollView: {
    backgroundColor: ShopTheme.colors.page,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    backgroundColor: ShopTheme.colors.blue,
    height: ShopTheme.dimensions.heroHeight,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    color: '#FFFFFF',
    fontFamily: ShopTheme.fonts.bold,
    lineHeight: 34,
  },
});
