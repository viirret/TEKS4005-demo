import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ImportantToggleProps = {
  important: boolean;
  onToggle: (important: boolean) => void;
};

/**
 * Small pill that lets a person mark a question as important to them. The
 * active state is shown with a filled star and a brand tint.
 */
export function ImportantToggle({ important, onToggle }: ImportantToggleProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: important }}
      accessibilityLabel={important ? 'Marked as important' : 'Mark as important'}
      onPress={() => onToggle(!important)}
      style={({ pressed }) => [
        styles.pill,
        { backgroundColor: theme.backgroundSelected },
        important && { backgroundColor: theme.tintSoft },
        pressed && styles.pressed,
      ]}
    >
      <ThemedText style={styles.star} themeColor={important ? 'tint' : 'textSecondary'}>
        {important ? '★' : '☆'}
      </ThemedText>
      <ThemedText type="smallBold" themeColor={important ? 'tint' : 'textSecondary'}>
        {important ? 'Important' : 'Mark as important'}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.one,
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  star: {
    fontSize: 14,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.7,
  },
});
