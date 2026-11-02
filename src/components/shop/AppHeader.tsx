import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShopTheme } from '@/constants/shop-theme';

export function AppHeader({ showProfile = false }: { showProfile?: boolean }) {
  const insets = useSafeAreaInsets();
  const headerHeight = Math.max(
    ShopTheme.dimensions.headerHeight,
    insets.top + ShopTheme.dimensions.logoHeight + 12,
  );

  return (
    <View style={[styles.header, { height: headerHeight, paddingTop: insets.top }]}>
      <Image
        source={require('../../../assets/images/img/rtc.png')}
        contentFit="contain"
        accessibilityLabel="Logo RTC"
        style={[
          styles.logo,
        ]}
      />
      {showProfile && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ouvrir la page de connexion"
          onPress={() => router.push('/connexion')}
          style={({ pressed }) => [
            styles.profileButton,
            pressed && styles.profileButtonPressed,
          ]}
        >
          <View style={styles.avatarWrapper}>
            <Image
              source={require('../../../assets/images/img/user.jpg')}
              contentFit="cover"
              accessibilityLabel="Profil utilisateur"
              style={styles.avatarImage}
            />
            <View style={styles.avatarAccentDot} />
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: ShopTheme.colors.navy,
    flexShrink: 0,
    position: 'relative',
    width: '100%',
  },
  logo: {
    position: 'absolute',
    alignSelf: 'center',
    top: 44,
    width: ShopTheme.dimensions.logoWidth,
    height: ShopTheme.dimensions.logoHeight,
  },
  profileButton: {
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
    position: 'absolute',
    right: 18,
    top: 49,
    width: 38,
  },
  profileButtonPressed: {
    opacity: 0.8,
  },
  avatarWrapper: {
    height: 36,
    position: 'relative',
    width: 36,
  },
  avatarImage: {
    borderColor: '#C6D4EC',
    borderRadius: 18,
    borderWidth: 1.5,
    height: 36,
    width: 36,
  },
  avatarAccentDot: {
    backgroundColor: '#E4007C',
    borderColor: ShopTheme.colors.navy,
    borderRadius: 5,
    borderWidth: 1.5,
    bottom: -1,
    height: 10,
    left: -1,
    position: 'absolute',
    width: 10,
  },
});
