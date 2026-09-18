import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand } from '@/constants/brand';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type YesNoQuestionCardProps = {
  question: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

/**
 * A personality question answered with a Yes / No segmented control.
 */
export function YesNoQuestionCard({ question, value, onChange }: YesNoQuestionCardProps) {
  const theme = useTheme();

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText style={styles.question}>{question}</ThemedText>

      <View accessibilityRole="radiogroup" style={[styles.segment, { backgroundColor: theme.backgroundSelected }]}>
        {(
          [
            { key: true, label: 'Yes' },
            { key: false, label: 'No' },
          ] as const
        ).map((option) => {
          const selected = value === option.key;
          return (
            <Pressable
              key={String(option.key)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => onChange(option.key)}
              style={({ pressed }) => [
                styles.option,
                selected
                  ? { backgroundColor: Brand.primary }
                  : { backgroundColor: 'transparent' },
                pressed && !selected && { backgroundColor: theme.backgroundElement },
              ]}>
              <ThemedText
                type="smallBold"
                themeColor={selected ? undefined : 'textSecondary'}
                style={selected ? { color: Brand.textOnPrimary } : undefined}>
                {option.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  segment: {
    flexDirection: 'row',
    borderRadius: 999,
    padding: Spacing.one,
    gap: Spacing.one,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 999,
  },
});