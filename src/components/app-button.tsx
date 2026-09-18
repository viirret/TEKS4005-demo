import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { Brand, Layout } from '@/constants/brand';
import { useTheme } from '@/hooks/use-theme';

type AppButtonProps = {
  label: string;
  onPress?: () => void;
  /** Filled brand button (default), soft surface button, or plain text button. */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Smaller height/labels, for inline actions like photo controls. */
  compact?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

/**
 * Branded button used across the demo. Works with touch on mobile and click /
 * hover on web, and adapts to the current color scheme.
 */
export function AppButton({
  label,
  onPress,
  variant = 'primary',
  compact = false,
  disabled = false,
  style,
}: AppButtonProps) {
  const theme = useTheme();

  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed, hovered }) => [
        styles.base,
        compact && styles.compact,
        isPrimary && styles.primary,
        variant === 'secondary' && {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.backgroundSelected,
        },
        isGhost && { borderColor: 'transparent' },
        disabled && styles.disabled,
        pressed && styles.pressed,
        (hovered || pressed) && isPrimary && styles.primaryHovered,
        (hovered || pressed) && variant === 'secondary' && { opacity: 0.85 },
        style,
      ]}>
      <Text
        style={[
          styles.label,
          compact && styles.labelCompact,
          isPrimary && { color: Brand.textOnPrimary },
          variant === 'secondary' && { color: Brand.primary, fontWeight: '700' },
          isGhost && { color: theme.tint },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: Layout.buttonHeight,
    borderRadius: Layout.buttonHeight / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  primary: {
    backgroundColor: Brand.primary,
    boxShadow: '0 6px 12px rgba(224, 36, 94, 0.28)',
  },
  primaryHovered: {
    backgroundColor: Brand.primaryPressed,
  },
  compact: {
    minHeight: 44,
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  labelCompact: {
    fontSize: 15,
  },
});