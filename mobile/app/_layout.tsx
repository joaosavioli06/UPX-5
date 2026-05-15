import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import {useRouter, useSegments } from 'expo-router';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { RegisterProvider } from '@/contexts/RegisterContext';
import { DiscardProvider } from '@/contexts/DiscardContext';
import { AuthProvider } from '@/contexts/AuthContext';

import * as SplashScreen from 'expo-splash-screen';
import { useAuth } from '@/contexts/AuthContext'; // Garanta que o caminho está correto

// app/_layout.tsx

export const unstable_settings = {
  // 1. Mudamos o 'anchor' para o grupo de autenticação
  initialRouteName: '(auth)', 
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <DiscardProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <RegisterProvider>
            <Stack initialRouteName="(auth)">
              {/* 2. Declaramos o (auth) PRIMEIRO aqui na lista */}
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" />
            </Stack>
          </RegisterProvider>
          <StatusBar style="auto" />
        </ThemeProvider>
      </DiscardProvider>
    </AuthProvider>
  );
}

/*export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <DiscardProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

        <RegisterProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" />
            </Stack>
          </RegisterProvider>

          <StatusBar style="auto" />
        </ThemeProvider>
      </DiscardProvider>
    </AuthProvider>
  );
}
*/