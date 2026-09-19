import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { ThemedText } from '@/components/themed-text';
import { Brand } from '@/constants/brand';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const AVATAR_SIZE = 120;

type PhotoUploaderProps = {
  photo: ImagePicker.ImagePickerAsset | null;
  onChange: (photo: ImagePicker.ImagePickerAsset | null) => void;
};

/**
 * Profile-photo picker for the "create a profile" flow. Uses the system image
 * picker (photos on iOS/Android, file picker on web) with a square crop.
 */
export function PhotoUploader({ photo, onChange }: PhotoUploaderProps) {
  const theme = useTheme();

  const pickPhoto = async () => {
    try {
      // No permission prompt is needed for images on modern iOS/Android; must
      // run directly inside the user interaction on web.
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onChange(result.assets[0]);
      }
    } catch (error) {
      console.warn('[Found] Failed to pick a photo:', error);
    }
  };

  return (
    <View style={styles.container}>
      {photo ? (
        <Image
          source={{ uri: photo.uri }}
          style={[styles.avatar, { borderColor: Brand.primary }]}
          contentFit="cover"
          transition={150}
        />
      ) : (
        <View style={[styles.avatar, styles.placeholder, { backgroundColor: theme.tintSoft }]}>
          <ThemedText style={styles.cameraGlyph}>📷</ThemedText>
        </View>
      )}

      <ThemedText themeColor="textSecondary" type="small" style={styles.hint}>
        {photo
          ? 'Looks good — first impressions matter.'
          : 'Add a photo so people can recognize you.'}
      </ThemedText>

      <View style={styles.actions}>
        <AppButton
          compact
          label={photo ? 'Change photo' : 'Add photo'}
          variant="primary"
          onPress={pickPhoto}
        />
        {photo ? (
          <AppButton compact label="Remove" variant="secondary" onPress={() => onChange(null)} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.three,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 3,
    overflow: 'hidden',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraGlyph: {
    fontSize: 38,
    lineHeight: 46,
  },
  hint: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.two,
  },
});
