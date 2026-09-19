import { StyleSheet, View } from 'react-native';

import { Slider } from '@/components/slider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand } from '@/constants/brand';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SliderQuestionCardProps = {
  question: string;
  value: number;
  min: number;
  max: number;
  step: number;
  lowLabel: string;
  highLabel: string;
  onChange: (value: number) => void;
};

/**
 * A personality question answered with the custom `Slider`. Shows the current
 * value in a chip and the semantic low/high labels under the track.
 */
export function SliderQuestionCard({
  question,
  value,
  min,
  max,
  step,
  lowLabel,
  highLabel,
  onChange,
}: SliderQuestionCardProps) {
  const theme = useTheme();

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.question}>{question}</ThemedText>
        <View style={[styles.valueChip, { backgroundColor: theme.tintSoft }]}>
          <ThemedText themeColor="tint" type="smallBold">
            {value}
          </ThemedText>
        </View>
      </View>

      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={onChange}
        accessibilityLabel={`${question} value ${value} of ${max}`}
      />

      <View style={styles.labelsRow}>
        <ThemedText themeColor="textSecondary" type="small">
          {lowLabel}
        </ThemedText>
        <ThemedText themeColor="textSecondary" type="small">
          {highLabel}
        </ThemedText>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  question: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  valueChip: {
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingHorizontal: Spacing.half,
  },
});
