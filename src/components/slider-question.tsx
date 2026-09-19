import { StyleSheet, View } from 'react-native';

import { ImportantToggle } from '@/components/important-toggle';
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
  important: boolean;
  onImportantChange: (important: boolean) => void;
  /** Whether the user has picked a value yet; the card stays muted until then. */
  answered: boolean;
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
  important,
  onImportantChange,
  answered,
}: SliderQuestionCardProps) {
  const theme = useTheme();

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.question}>{question}</ThemedText>
        <View
          style={[
            styles.valueChip,
            { backgroundColor: answered ? theme.tintSoft : theme.backgroundSelected },
          ]}
        >
          <ThemedText themeColor={answered ? 'tint' : 'textSecondary'} type="smallBold">
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
        active={answered}
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

      <ImportantToggle important={important} onToggle={onImportantChange} />
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
