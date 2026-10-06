import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import Head from 'expo-router/head';
import { useColorScheme } from 'react-native';
import { I18nProvider } from '@/i18n';
import { Brand } from '@/constants/brand';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <I18nProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Head>
          <title>{Brand.name}</title>
        </Head>
        <Stack
          screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}
        />
      </ThemeProvider>
    </I18nProvider>
  );
}
