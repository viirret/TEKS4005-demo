import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';

type FormFieldProps = TextInputProps & {
  label: string;
  /** Hint shown under the input, e.g. units or an example. */
  hint?: string;
  /** Error message shown under the input in the danger color. */
  error?: string;
  labelColor?: ThemeColor;
};

/**
 * A labeled text input used for the basic profile fields (name, age,
 * occupation). Styled consistently across web and mobile.
 */
export function FormField({
  label,
  hint,
  error,
  labelColor = 'text',
  ...inputProps
}: FormFieldProps) {
  const theme = useTheme();

  return (
    <View style={styles.field}>
      <ThemedText themeColor={labelColor} type="smallBold">
        {label}
      </ThemedText>
      <TextInput
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: error ? theme.danger : theme.backgroundSelected,
            color: theme.text,
          },
        ]}
        {...inputProps}
      />
      {error ? (
        <ThemedText themeColor="danger" type="small" style={styles.hint}>
          {error}
        </ThemedText>
      ) : hint ? (
        <ThemedText themeColor="textSecondary" type="small" style={styles.hint}>
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: Spacing.two,
    flexGrow: 1,
    flexBasis: 200,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    lineHeight: 16,
  },
});