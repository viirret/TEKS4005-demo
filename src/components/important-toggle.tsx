import { Pressable, StyleSheet } from 'react-native';

import { useI18n } from '@/i18n';
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
  const { t } = useI18n();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: important }}
      accessibilityLabel={important ? t('important.marked') : t('important.mark')}
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
        {important ? t('important.label') : t('important.mark')}
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
