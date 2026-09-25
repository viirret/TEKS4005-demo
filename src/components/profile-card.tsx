import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { LogoMark } from '@/components/logo';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** A single photo on a profile. Either a plain URI (locally picked photos and,
 *  later, photos fetched from a server) or a bundled asset from `require()`. */
export type ProfilePhoto = ImageSource | number;

/** Everything a profile shows to others. Used for the owner's own preview and,
 *  in the future, for viewing other people's profiles. */
export type Profile = {
  name: string;
  age: number;
  occupation?: string;
  description: string;
  photos: ProfilePhoto[];
};

/**
 * How a profile appears to other people: the main photo (plus a collage of the
 * rest), then name, age, occupation and description. Reusable anywhere a
 * profile should be shown — for now the owner's preview after creation.
 */
export function ProfileCard({ profile }: { profile: Profile }) {
  const theme = useTheme();

  const [hero, ...rest] = profile.photos;

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      {hero ? (
        <Image
          source={hero}
          style={[styles.hero, { backgroundColor: theme.backgroundSelected }]}
          contentFit="cover"
          transition={150}
          accessibilityLabel={`${profile.name}'s main photo`}
        />
      ) : (
        <View style={[styles.hero, styles.heroPlaceholder, { backgroundColor: theme.tintSoft }]}>
          <LogoMark size={72} />
        </View>
      )}

      {rest.length > 0 && (
        <View style={styles.grid}>
          {rest.map((photo, index) => (
            <Image
              key={`${typeof photo === 'number' ? photo : photo.uri}-${index}`}
              source={photo}
              style={[styles.gridImage, { backgroundColor: theme.backgroundSelected }]}
              contentFit="cover"
              transition={150}
              accessibilityLabel={`${profile.name}'s photo ${index + 2}`}
            />
          ))}
        </View>
      )}

      <View style={styles.body}>
        <ThemedText style={styles.name}>
          {profile.name}, {profile.age}
        </ThemedText>
        {profile.occupation ? (
          <ThemedText themeColor="textSecondary" type="smallBold">
            {profile.occupation}
          </ThemedText>
        ) : null}
        <ThemedText style={styles.description}>{profile.description}</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  hero: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  heroPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    padding: Spacing.two,
  },
  gridImage: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  body: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  name: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  description: {
    marginTop: Spacing.two,
  },
});
