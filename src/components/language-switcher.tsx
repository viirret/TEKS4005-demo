import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n';
import { isLanguage, languages } from '@/i18n/translations';

/** Browser select also uses the system selection UI in mobile browsers. */
export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();
  const theme = useTheme();

  return (
    <select
      aria-label={t('language.label')}
      value={language}
      onChange={(event) => {
        const value = event.target.value;
        if (isLanguage(value)) setLanguage(value);
      }}
      style={{
        minHeight: 44,
        maxWidth: '100%',
        padding: '8px 12px',
        borderRadius: 22,
        border: 'none',
        backgroundColor: theme.backgroundElement,
        color: theme.textSecondary,
        fontFamily: 'inherit',
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer',
      }}
    >
      {languages.map((option) => (
        <option key={option} value={option}>
          {t(`language.${option}`)}
        </option>
      ))}
    </select>
  );
}
