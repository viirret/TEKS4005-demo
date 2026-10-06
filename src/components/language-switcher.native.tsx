import { MenuView } from '@expo/ui/community/menu';
import { StyleSheet, View, useColorScheme } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';
import { isLanguage, languages } from '@/i18n/translations';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();
  const theme = useTheme();
  const colorScheme = useColorScheme();

  return (
    <MenuView
      title={t('language.label')}
      colorScheme={colorScheme}
      actions={languages.map((option) => ({
        id: option,
        title: t(`language.${option}`),
        state: language === option ? 'on' : 'off',
      }))}
      onPressAction={({ nativeEvent }) => {
        if (isLanguage(nativeEvent.event)) setLanguage(nativeEvent.event);
      }}
    >
      <View
        accessible
        accessibilityRole="button"
        accessibilityLabel={`${t('language.label')}: ${t(`language.${language}`)}`}
        style={[styles.button, { backgroundColor: theme.backgroundElement }]}
      >
        <ThemedText type="smallBold" themeColor="textSecondary">
          {t(`language.${language}`)} ▾
        </ThemedText>
      </View>
    </MenuView>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    justifyContent: 'center',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: 22,
  },
});
