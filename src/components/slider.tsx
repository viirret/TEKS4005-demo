import { useEffect, useRef } from 'react';
import { PanResponder, Platform, StyleSheet, View } from 'react-native';

import { Brand } from '@/constants/brand';
import { useTheme } from '@/hooks/use-theme';

export type SliderProps = {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange: (value: number) => void;
  /** Accessible name for screen readers. */
  accessibilityLabel?: string;
};

/**
 * A dependency-free slider built on core React Native primitives.
 *
 * It uses `PanResponder` so it works with touch on iOS/Android and with both
 * mouse and touch on web — no extra native modules required. Tap anywhere on
 * the track to jump to that value, or drag the thumb.
 */
export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  accessibilityLabel,
}: SliderProps) {
  const theme = useTheme();

  const widthRef = useRef(0);
  const onChangeRef = useRef(onValueChange);
  const updateRef = useRef<(locationX: number) => void>(() => {});

  // Keep the latest callbacks/props available to the (stable) PanResponder.
  useEffect(() => {
    onChangeRef.current = onValueChange;
    updateRef.current = (locationX: number) => {
      const width = widthRef.current;
      if (width <= 0) return;

      const ratio = Math.min(1, Math.max(0, locationX / width));
      const raw = min + ratio * (max - min);
      let stepped = Math.round(raw / step) * step;
      stepped = Math.min(max, Math.max(min, stepped));
      onChangeRef.current(stepped);
    };
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (evt) => updateRef.current(evt.nativeEvent.locationX),
      onPanResponderMove: (evt) => updateRef.current(evt.nativeEvent.locationX),
    }),
  ).current;

  const pct = ((value - min) / (max - min)) * 100;

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min, max, now: value }}
      onLayout={(e) => {
        widthRef.current = e.nativeEvent.layout.width;
      }}
      style={[
        styles.container,
        Platform.OS === 'web' && ({ cursor: 'pointer', touchAction: 'none' } as object),
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.trackArea}>
        <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]} />
        <View
          style={[
            styles.fill,
            { backgroundColor: Brand.primary, width: `${pct}%` as `${number}%` },
          ]}
        />
        <View
          style={[
            styles.thumb,
            {
              borderColor: Brand.primary,
              left: `${pct}%` as `${number}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const THUMB_SIZE = 28;
const TRACK_HEIGHT = 6;

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  trackArea: {
    height: TRACK_HEIGHT,
    justifyContent: 'center',
    width: '100%',
  },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: TRACK_HEIGHT / 2,
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    position: 'absolute',
    top: (TRACK_HEIGHT - THUMB_SIZE) / 2,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    transform: [{ translateX: -THUMB_SIZE / 2 }],
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
});
