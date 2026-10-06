import { Pressable, StyleSheet, View } from 'react-native';

import { useI18n } from '@/i18n';
import { ThemedText } from '@/components/themed-text';
import { Brand } from '@/constants/brand';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ChoiceOption<Value extends string = string> = {
  value: Value;
  label: string;
};

type SingleChoiceQuestionProps<Value extends string> = {
  question: string;
  options: readonly ChoiceOption<Value>[];
  value: Value | null;
  onChange: (value: Value) => void;
  /** Marks the question as mandatory: it has to be answered to continue. */
  required?: boolean;
  /** Error message shown under the options in the danger color. */
  error?: string;
};

type MultipleChoiceQuestionProps<Value extends string> = {
  question: string;
  options: readonly ChoiceOption<Value>[];
  values: readonly Value[];
  onChange: (values: Value[]) => void;
  /** Marks the question as mandatory: it has to be answered to continue. */
  required?: boolean;
  /** Error message shown under the options in the danger color. */
  error?: string;
};

/**
 * A profile question where only one option can be selected.
 */
export function SingleChoiceQuestion<Value extends string>({
  question,
  options,
  value,
  onChange,
  required = false,
  error,
}: SingleChoiceQuestionProps<Value>) {
  const { t } = useI18n();
  return (
    <ChoiceQuestion
      question={question}
      instruction={t('choice.one')}
      required={required}
      error={error}
      accessibilityRole="radiogroup"
      options={options}
      isSelected={(option) => value === option.value}
      onPress={(option) => onChange(option.value)}
    />
  );
}

/**
 * A profile question where more than one option can be selected.
 */
export function MultipleChoiceQuestion<Value extends string>({
  question,
  options,
  values,
  onChange,
  required = false,
  error,
}: MultipleChoiceQuestionProps<Value>) {
  const { t } = useI18n();
  return (
    <ChoiceQuestion
      question={question}
      instruction={t('choice.many')}
      required={required}
      error={error}
      options={options}
      isSelected={(option) => values.includes(option.value)}
      onPress={(option) =>
        onChange(
          values.includes(option.value)
            ? values.filter((value) => value !== option.value)
            : [...values, option.value],
        )
      }
    />
  );
}

type ChoiceQuestionProps<Value extends string> = {
  question: string;
  instruction: string;
  required?: boolean;
  error?: string;
  accessibilityRole?: 'radiogroup';
  options: readonly ChoiceOption<Value>[];
  isSelected: (option: ChoiceOption<Value>) => boolean;
  onPress: (option: ChoiceOption<Value>) => void;
};

function ChoiceQuestion<Value extends string>({
  question,
  instruction,
  required = false,
  error,
  accessibilityRole,
  options,
  isSelected,
  onPress,
}: ChoiceQuestionProps<Value>) {
  const theme = useTheme();
  const { t } = useI18n();

  return (
    <View style={styles.question}>
      <View style={styles.heading}>
        <ThemedText style={styles.questionText}>{question}</ThemedText>
        <ThemedText themeColor="textSecondary" type="small">
          {required ? t('choice.required', { instruction }) : instruction}
        </ThemedText>
      </View>

      <View
        accessibilityLabel={question}
        accessibilityRole={accessibilityRole}
        style={styles.options}
      >
        {options.map((option) => {
          const selected = isSelected(option);
          return (
            <Pressable
              key={option.value}
              accessibilityLabel={option.label}
              accessibilityRole={accessibilityRole === 'radiogroup' ? 'radio' : 'checkbox'}
              accessibilityState={
                accessibilityRole === 'radiogroup' ? { selected } : { checked: selected }
              }
              onPress={() => onPress(option)}
              style={({ pressed, hovered }) => [
                styles.option,
                {
                  backgroundColor: selected
                    ? Brand.primary
                    : hovered || pressed
                      ? theme.backgroundElement
                      : theme.backgroundSelected,
                  borderColor: selected ? Brand.primary : theme.backgroundSelected,
                },
                selected && hovered && { backgroundColor: Brand.primaryPressed },
                pressed && !selected && styles.pressed,
              ]}
            >
              <ThemedText
                type="smallBold"
                themeColor={selected ? undefined : 'textSecondary'}
                style={[styles.optionLabel, selected && { color: Brand.textOnPrimary }]}
              >
                {option.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      {error ? (
        <ThemedText themeColor="danger" type="small" style={styles.error}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  question: {
    gap: Spacing.three,
  },
  heading: {
    gap: Spacing.one,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  option: {
    width: '48%',
    height: 56,
    flexGrow: 0,
    flexBasis: '48%',
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  optionLabel: {
    textAlign: 'center',
  },
  error: {
    fontSize: 12,
    lineHeight: 16,
  },
  pressed: {
    opacity: 0.7,
  },
});
