import { StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/brand';
import { useTheme } from '@/hooks/use-theme';

/**
 * The Found logo mark: a rounded brand-colored tile with a white heart glyph.
 * The heart is a plain text glyph so it renders identically on iOS, Android
 * and web.
 */
export function LogoMark({ size = 72 }: { size?: number }) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.root,
        {
          width: size,
          height: size,
          borderRadius: size * 0.28,
        },
      ]}
    >
      <View style={[styles.glowBackdrop, { backgroundColor: Brand.heartStart }]} />
      <Text
        style={[
          styles.heart,
          {
            fontSize: size * 0.5,
            color: theme.background,
          },
        ]}
      >
        ♥
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: Brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glowBackdrop: {
    position: 'absolute',
    top: '-45%',
    left: '-45%',
    right: '-45%',
    bottom: '-45%',
    opacity: 0.45,
  },
  heart: {
    fontWeight: '700',
    // Slight optical adjustment so the glyph sits nicely in the tile.
    marginTop: -2,
  },
});
