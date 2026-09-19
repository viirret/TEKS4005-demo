import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand } from '@/constants/brand';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Maximum number of photos a profile can show. */
export const MAX_PHOTOS = 9;

type PhotoUploaderProps = {
  photos: ImagePicker.ImagePickerAsset[];
  onChange: (photos: ImagePicker.ImagePickerAsset[]) => void;
};

/**
 * Photo picker for the "create a profile" flow: pick multiple photos from the
 * system library (multi-select on iOS/Android and web) and manage them in a
 * grid where the first photo is the profile's main photo.
 */
export function PhotoUploader({ photos, onChange }: PhotoUploaderProps) {
  const theme = useTheme();

  const pickPhotos = async () => {
    try {
      // No permission prompt is needed for images on modern iOS/Android; must
      // run directly inside the user interaction on web.
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        orderedSelection: true,
        // Caps the system picker on iOS/Android. Web ignores it, so the merged
        // result is clamped below as a safety net.
        selectionLimit: MAX_PHOTOS - photos.length,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        onChange([...photos, ...result.assets].slice(0, MAX_PHOTOS));
      }
    } catch (error) {
      console.warn('[Found] Failed to pick photos:', error);
    }
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, photoIndex) => photoIndex !== index));
  };

  return (
    <View style={styles.container}>
      {photos.length === 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add photos"
          onPress={pickPhotos}
          style={({ pressed }) => [
            styles.addButtonEmpty,
            {
              borderColor: theme.backgroundSelected,
              backgroundColor: theme.backgroundElement,
            },
            pressed && styles.pressed,
          ]}
        >
          <ThemedText style={styles.addGlyph}>＋</ThemedText>
          <ThemedText themeColor="textSecondary" type="smallBold">
            Add photos
          </ThemedText>
        </Pressable>
      ) : (
        <View style={styles.grid}>
          {photos.map((photo, index) => (
            <View key={`${photo.uri}-${index}`} style={styles.tile}>
              <Image
                source={{ uri: photo.uri }}
                style={styles.tileImage}
                contentFit="cover"
                transition={150}
              />
              {index === 0 && (
                <View style={styles.mainBadge}>
                  <ThemedText style={styles.mainBadgeLabel}>Main</ThemedText>
                </View>
              )}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove photo ${index + 1}`}
                hitSlop={8}
                onPress={() => removePhoto(index)}
                style={({ pressed }) => [
                  styles.removeButton,
                  { backgroundColor: theme.background },
                  pressed && styles.pressed,
                ]}
              >
                <ThemedText style={styles.removeGlyph}>✕</ThemedText>
              </Pressable>
            </View>
          ))}

          {photos.length < MAX_PHOTOS && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add photos"
              onPress={pickPhotos}
              style={({ pressed }) => [
                styles.tile,
                styles.addTile,
                {
                  borderColor: theme.backgroundSelected,
                  backgroundColor: theme.backgroundElement,
                },
                pressed && styles.pressed,
              ]}
            >
              <ThemedText style={styles.addGlyph}>＋</ThemedText>
              <ThemedText themeColor="textSecondary" type="small">
                Add
              </ThemedText>
            </Pressable>
          )}
        </View>
      )}

      <ThemedText themeColor="textSecondary" type="small" style={styles.hint}>
        {photos.length > 0
          ? `${photos.length} of ${MAX_PHOTOS} photos — the first one is your main photo.`
          : `Add up to ${MAX_PHOTOS} photos so people can see more of you.`}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  tile: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  mainBadge: {
    position: 'absolute',
    bottom: Spacing.two,
    left: Spacing.two,
    backgroundColor: Brand.primary,
    borderRadius: 10,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  mainBadgeLabel: {
    color: Brand.textOnPrimary,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
  },
  removeButton: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.two,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeGlyph: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '800',
  },
  addTile: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  addButtonEmpty: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 260,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.four,
  },
  addGlyph: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.6,
  },
  hint: {
    textAlign: 'center',
  },
});
