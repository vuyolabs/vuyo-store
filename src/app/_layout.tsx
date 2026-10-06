import { Fraunces_400Regular, Fraunces_400Regular_Italic, Fraunces_500Medium } from '@expo-google-fonts/fraunces';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, useFonts } from '@expo-google-fonts/inter';
import { DefaultTheme, Stack, ThemeProvider, type Theme } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ToastHost } from '@/components/ui';
import { useStoresHydrated } from '@/store';
import { usePreferencesStore } from '@/store/preferencesStore';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync();

const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.background, card: colors.background, text: colors.ink, border: colors.line, primary: colors.ink },
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Fraunces_400Regular,
    Fraunces_400Regular_Italic,
    Fraunces_500Medium,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  const hydrated = useStoresHydrated();
  const hasOnboarded = usePreferencesStore((s) => s.hasOnboarded);
  const ready = (fontsLoaded || !!fontError) && hydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider value={navigationTheme}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: Platform.OS === 'android' ? 'ios_from_right' : 'default',
            fullScreenGestureEnabled: true,
          }}>
          <Stack.Protected guard={!hasOnboarded}>
            <Stack.Screen name="onboarding" options={{ animation: 'fade', gestureEnabled: false }} />
          </Stack.Protected>

          <Stack.Protected guard={hasOnboarded}>
            <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
            <Stack.Screen name="product/[id]" />
            <Stack.Screen name="collection/[id]" />
            <Stack.Screen name="search" options={{ animation: 'fade_from_bottom', fullScreenGestureEnabled: false }} />
            <Stack.Screen name="checkout/delivery" />
            <Stack.Screen name="checkout/payment" />
            <Stack.Screen name="checkout/review" />
            <Stack.Screen name="checkout/success" options={{ animation: 'fade', gestureEnabled: false }} />
            <Stack.Screen name="orders/index" />
            <Stack.Screen name="orders/[id]" />
            <Stack.Screen name="account/addresses" />
            <Stack.Screen name="account/sizes" />
            <Stack.Screen name="account/notifications" />
            <Stack.Screen name="account/help" />
            <Stack.Screen name="account/about" />
          </Stack.Protected>
        </Stack>
        <ToastHost />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
});
