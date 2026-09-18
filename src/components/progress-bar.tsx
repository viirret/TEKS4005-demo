import { StyleSheet, View } from 'react-native';

import { Brand } from '@/constants/brand';
import { useTheme } from '@/hooks/use-theme';

type ProgressBarProps = {
  /** Value between 0 and 1. */
  progress: number;
};

/** A thin branded progress bar used for the profile-completion indicator. */
export function ProgressBar({ progress }: ProgressBarProps) {
  const theme = useTheme();
  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
      <View
        style={[
          styles.fill,
          { backgroundColor: Brand.primary, width: `${clamped * 100}%` as `${number}%` },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});