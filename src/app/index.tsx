import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/app-button';
import { LogoMark } from '@/components/logo';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Layout } from '@/constants/brand';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Landing screen. Offers a sign-in entry (no-op) and the "create a profile"
 * flow that asks the personality questions.
 */
export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <ThemedView style={styles.page}>
      <SafeAreaView style={styles.safeArea}>
        {/* Soft decorative blobs, kept behind everything. */}
        <View
          style={[
            styles.blob,
            styles.blobTop,
            { backgroundColor: theme.tintSoft, pointerEvents: 'none' },
          ]}
        />
        <View
          style={[
            styles.blob,
            styles.blobBottom,
            { backgroundColor: theme.tintSoft, pointerEvents: 'none' },
          ]}
        />

        <View style={styles.content}>
          <View style={styles.hero}>
            <LogoMark size={128} />
            <ThemedText style={styles.appName}>{Brand.name}</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.tagline}>
              {Brand.tagline}
            </ThemedText>
          </View>

          <View style={styles.actions}>
            <AppButton
              label="Create a profile"
              variant="primary"
              style={styles.actionButton}
              onPress={() => router.push('/create-profile')}
            />
            <AppButton
              label="Sign in"
              variant="secondary"
              style={styles.actionButton}
              onPress={() => {
                // Intentionally a no-op for this demo.
                console.log(`[${Brand.name}] sign-in is not implemented yet.`);
              }}
            />
          </View>

          <Pressable
            onPress={() => router.push('/create-profile')}
            style={styles.demoHint}
            accessibilityRole="link"
          >
            <ThemedText themeColor="textSecondary" type="small">
              New here? The questions take ~2 minutes ♥
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
    gap: Spacing.six,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.three,
  },
  appName: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '800',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 18,
    lineHeight: 26,
  },
  actions: {
    alignSelf: 'stretch',
    // The buttons wrap on their own: on phones each button takes a full row
    // (they don't fit side by side), on wide screens they sit next to each
    // other. This is decided purely in CSS so the layout is identical before
    // and after hydration with static rendering (no window measurement in JS,
    // which would be 0 at export time and bake in the wrong layout).
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  actionButton: {
    flexGrow: 1,
    flexBasis: 200,
    maxWidth: 280,
  },
  demoHint: {
    marginTop: -Spacing.three,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.6,
  },
  blobTop: {
    width: 320,
    height: 320,
    top: -120,
    right: -120,
  },
  blobBottom: {
    width: 280,
    height: 280,
    bottom: -110,
    left: -110,
  },
});
