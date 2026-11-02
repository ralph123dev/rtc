import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { Stack, usePathname, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Platform, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { usePreventScreenCapture } from 'expo-screen-capture';
import {
  AccessCodeProvider,
  useAccessCode,
  ADMIN_EMAIL,
} from '@/contexts/access-code-context';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { ActiveTicketProvider } from '@/contexts/active-ticket-context';
import { ShopCartProvider } from '@/contexts/shop-cart-context';

const SPLASH_DURATION_MS = 2000;

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const pathname = usePathname();
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });
  const [splashDurationElapsed, setSplashDurationElapsed] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setSplashDurationElapsed(true), SPLASH_DURATION_MS);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (fontsLoaded && splashDurationElapsed) {
      SplashScreen.hide();
    }
  }, [fontsLoaded, splashDurationElapsed]);

  if (fontError) {
    throw fontError;
  }

  return (
    <>
      {Platform.OS !== 'web' && pathname !== '/ticket-countdown' && (
        <ScreenCaptureProtection />
      )}
      {!fontsLoaded || !splashDurationElapsed ? (
        <View style={styles.splashContainer}>
          <Image
            source={require('../../assets/images/img/logo.png')}
            contentFit="contain"
            style={styles.splashLogo}
            accessibilityLabel="RTC Logo"
          />
        </View>
      ) : (
        <AuthProvider>
          <AccessCodeProvider>
            <ActiveTicketProvider>
              <ShopCartProvider>
                <RootNavigator />
              </ShopCartProvider>
            </ActiveTicketProvider>
          </AccessCodeProvider>
        </AuthProvider>
      )}
    </>
  );
}

function ScreenCaptureProtection() {
  usePreventScreenCapture('rtc-app');
  return null;
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    width: 140,
    height: 140,
  },
  navigatorContainer: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0F3D87',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});

function RootNavigator() {
  const pathname = usePathname();
  const { user, isLoading: authLoading } = useAuth();
  const { isUnlocked, isLoading: codeLoading } = useAccessCode();

  useEffect(() => {
    if (authLoading || codeLoading) return;

    const isAdmin = user?.email?.trim().toLowerCase() === ADMIN_EMAIL;
    const isPublicRoute =
      pathname === '/cgu-cgv' ||
      pathname === '/politique-confidentialite' ||
      pathname === '/ticket-countdown';

    if (isPublicRoute) return;

    // Utilisateur non connecté -> vers la page de connexion
    if (!user) {
      if (pathname !== '/connexion') {
        router.replace('/connexion');
      }
      return;
    }

    // Administrateur -> vers le panneau d'administration sans barre de navigation
    if (isAdmin) {
      if (pathname !== '/admin') {
        router.replace('/admin');
      }
      return;
    }

    // Utilisateur connecté ordinaire non débloqué -> vers la page de saisie du code
    if (!isUnlocked) {
      if (pathname !== '/access-code') {
        router.replace('/access-code');
      }
      return;
    }

    // Utilisateur débloqué sur une page de connexion / code / admin -> vers la boutique
    if (pathname === '/access-code' || pathname === '/connexion' || pathname === '/admin') {
      router.replace('/(app)/boutique');
    }
  }, [user, isUnlocked, authLoading, codeLoading, pathname]);

  return (
    <View style={styles.navigatorContainer}>
      <Stack initialRouteName="connexion" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="connexion" />
        <Stack.Screen name="access-code" />
        <Stack.Screen name="admin" />
        <Stack.Screen name="index" />
        <Stack.Screen name="(app)" />
        <Stack.Screen name="cgu-cgv" />
        <Stack.Screen name="politique-confidentialite" />
        <Stack.Screen name="ticket-countdown" />
      </Stack>
      {(authLoading || codeLoading) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
    </View>
  );
}
