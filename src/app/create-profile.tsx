import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/app-button';
import { FormField } from '@/components/form-field';
import { LogoMark } from '@/components/logo';
import { PhotoUploader } from '@/components/photo-uploader';
import { ProfileCard, type Profile } from '@/components/profile-card';
import { ProgressBar } from '@/components/progress-bar';
import { SliderQuestionCard } from '@/components/slider-question';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { YesNoQuestionCard } from '@/components/yes-no-question';
import { Brand, Layout } from '@/constants/brand';
import { Spacing } from '@/constants/theme';
import {
  PERSONALITY_QUESTIONS,
  SLIDER_QUESTIONS,
  TOTAL_QUESTION_COUNT,
  YES_NO_QUESTIONS,
} from '@/constants/questions';
import { useTheme } from '@/hooks/use-theme';

type PersonalityAnswers = Record<string, number | boolean>;

const INITIAL_ANSWERS: PersonalityAnswers = (() => {
  const answers: PersonalityAnswers = {};
  for (const question of PERSONALITY_QUESTIONS) {
    answers[question.id] = question.defaultValue;
  }
  return answers;
})();

const TOTAL_FIELDS = 5 + TOTAL_QUESTION_COUNT;

/**
 * The "create a profile" flow: basic info (name, age, occupation, description,
 * photo) followed by a batch of personality questions answered with sliders
 * and yes/no toggles. For now the whole payload is printed to the console.
 */
export default function CreateProfileScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [answers, setAnswers] = useState<PersonalityAnswers>(INITIAL_ANSWERS);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
  const [importantIds, setImportantIds] = useState<Set<string>>(new Set());
  const [profile, setProfile] = useState<Profile | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Progress through the flow: the bar tracks how far the user has actually
  // scrolled (each question has a default answer, so leaving one as "No" /
  // untouched and moving on still counts as progress). Reaching the end of the
  // page fills the bar completely.
  const [scrollMetrics, setScrollMetrics] = useState({ top: 0, viewport: 0, content: 0 });

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollMetrics((previous) => {
      const next = {
        ...previous,
        top: event.nativeEvent.contentOffset.y,
        content: event.nativeEvent.contentSize.height,
      };
      return next.top === previous.top && next.content === previous.content ? previous : next;
    });
  };

  const handleAnswer = (id: string, value: number | boolean) => {
    setAnswers((previous) => ({ ...previous, [id]: value }));
    setAnsweredIds((previous) => {
      if (previous.has(id)) return previous;
      const next = new Set(previous);
      next.add(id);
      return next;
    });
  };

  const handleImportant = (id: string) => {
    setImportantIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const maxScroll = Math.max(0, scrollMetrics.content - scrollMetrics.viewport);
  const scrollFraction =
    maxScroll > 0 ? Math.min(1, Math.max(0, scrollMetrics.top / maxScroll)) : 0;
  const progressSteps = Math.round(scrollFraction * TOTAL_FIELDS);
  const progress = progressSteps / TOTAL_FIELDS;

  // Age gate: profiles are open to adults from 18 through 125. An empty or
  // invalid age also blocks submission so the gate can't be bypassed.
  const ageNumber = age.trim() ? Number(age.trim()) : null;
  const hasValidAge =
    ageNumber !== null && Number.isFinite(ageNumber) && ageNumber >= 18 && ageNumber <= 125;
  const ageError =
    ageNumber !== null && Number.isFinite(ageNumber) && ageNumber < 18
      ? 'You must be 18 or older to create a profile.'
      : ageNumber !== null && Number.isFinite(ageNumber) && ageNumber > 125
        ? 'Age must be 125 or younger.'
        : undefined;

  const handleSubmit = () => {
    if (!name.trim() || !hasValidAge) return;
    const payload = {
      app: Brand.name,
      profile: {
        name: name.trim(),
        age: ageNumber,
        occupation: occupation.trim(),
        description: description.trim(),
        photos: photos.map((asset) => ({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          fileName: asset.fileName ?? null,
          fileSize: asset.fileSize ?? null,
        })),
      },
      personality: Object.fromEntries(
        PERSONALITY_QUESTIONS.map((question) => [
          question.id,
          { value: answers[question.id], important: importantIds.has(question.id) },
        ]),
      ),
    };
    console.log(`[${Brand.name}] New profile created:`);
    console.log(JSON.stringify(payload, null, 2));
    setProfile({
      name: name.trim(),
      age: ageNumber ?? 0,
      occupation: occupation.trim(),
      description: description.trim(),
      photos: photos.map((asset) => ({ uri: asset.uri })),
    });
    setSubmitted(true);
  };

  return (
    <ThemedView style={styles.page}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={12}
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backButton,
                { backgroundColor: theme.backgroundElement },
                pressed && { opacity: 0.6 },
              ]}
            >
              <ThemedText style={styles.backIcon}>←</ThemedText>
            </Pressable>
            <ThemedText style={styles.headerTitle}>Create your profile</ThemedText>
            <View style={styles.headerSpacer} />
          </View>
          {!submitted && (
            <View style={styles.progressBlock}>
              <ThemedText themeColor="textSecondary" type="small" style={styles.progressLabel}>
                {progressSteps} of {TOTAL_FIELDS} complete
              </ThemedText>
              <ProgressBar progress={progress} />
            </View>
          )}
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            onScroll={handleScroll}
            onLayout={(event) =>
              setScrollMetrics((previous) => {
                const viewport = event.nativeEvent.layout.height;
                return previous.viewport === viewport ? previous : { ...previous, viewport };
              })
            }
            scrollEventThrottle={16}
          >
            <View style={styles.content}>
              {submitted && profile ? (
                <SuccessView
                  profile={profile}
                  onReview={() => setSubmitted(false)}
                  onHome={() => router.replace('/')}
                />
              ) : (
                <>
                  {/* Basic info */}
                  <View style={styles.sectionHeader}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                      About you
                    </ThemedText>
                    <ThemedText themeColor="textSecondary" type="small">
                      The essentials — plus a few words about who you are.
                    </ThemedText>
                  </View>

                  <ThemedView type="backgroundElement" style={styles.formCard}>
                    <PhotoUploader photos={photos} onChange={setPhotos} />
                    <View
                      style={[styles.formDivider, { backgroundColor: theme.backgroundSelected }]}
                    />

                    <FormField
                      label="Name"
                      placeholder="e.g. Alex"
                      placeholderTextColor={theme.textSecondary}
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                      autoComplete="name"
                    />
                    <View style={styles.formRow}>
                      <FormField
                        label="Age 18+"
                        placeholder="e.g. 28"
                        placeholderTextColor={theme.textSecondary}
                        value={age}
                        onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ''))}
                        keyboardType="number-pad"
                        inputMode="numeric"
                        maxLength={3}
                        error={ageError}
                      />
                      <FormField
                        label="Occupation"
                        placeholder="e.g. Barista"
                        placeholderTextColor={theme.textSecondary}
                        value={occupation}
                        onChangeText={setOccupation}
                        autoCapitalize="words"
                      />
                    </View>

                    <FormField
                      label="Description"
                      placeholder="e.g. Coffee nerd, weekend hiker, karaoke enthusiast…"
                      placeholderTextColor={theme.textSecondary}
                      value={description}
                      onChangeText={setDescription}
                      autoCapitalize="sentences"
                      multiline
                      numberOfLines={4}
                      maxLength={500}
                      textAlignVertical="top"
                    />
                  </ThemedView>

                  {/* Personality — sliders */}
                  <View style={styles.sectionHeader}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                      Personality
                    </ThemedText>
                    <ThemedText themeColor="textSecondary" type="small">
                      Slide into the answers that feel most like you — there are no wrong ones.
                    </ThemedText>
                  </View>

                  {SLIDER_QUESTIONS.map((question) => (
                    <SliderQuestionCard
                      key={question.id}
                      question={question.question}
                      value={answers[question.id] as number}
                      min={question.min}
                      max={question.max}
                      step={question.step}
                      lowLabel={question.lowLabel}
                      highLabel={question.highLabel}
                      onChange={(value) => handleAnswer(question.id, value)}
                      important={importantIds.has(question.id)}
                      onImportantChange={() => handleImportant(question.id)}
                      answered={answeredIds.has(question.id)}
                    />
                  ))}

                  {/* Personality — yes / no */}
                  <View style={styles.sectionHeader}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                      Quick yes or no
                    </ThemedText>
                    <ThemedText themeColor="textSecondary" type="small">
                      No overthinking — first instinct wins.
                    </ThemedText>
                  </View>

                  {YES_NO_QUESTIONS.map((question) => (
                    <YesNoQuestionCard
                      key={question.id}
                      question={question.question}
                      value={answers[question.id] as boolean}
                      onChange={(value) => handleAnswer(question.id, value)}
                      important={importantIds.has(question.id)}
                      onImportantChange={() => handleImportant(question.id)}
                    />
                  ))}

                  {/* Submit */}
                  <View style={styles.submitBlock}>
                    <AppButton
                      label={submitted ? 'Profile created' : 'Create profile'}
                      variant="primary"
                      disabled={!name.trim() || !hasValidAge}
                      onPress={handleSubmit}
                    />
                    {!name.trim() ? (
                      <ThemedText themeColor="textSecondary" type="small" style={styles.submitHint}>
                        Add your name to create the profile.
                      </ThemedText>
                    ) : !hasValidAge ? (
                      <ThemedText themeColor="danger" type="small" style={styles.submitHint}>
                        You must be 18 or older to create a profile.
                      </ThemedText>
                    ) : (
                      <ThemedText themeColor="textSecondary" type="small" style={styles.submitHint}>
                        Your answers are logged to the console.
                      </ThemedText>
                    )}
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

function SuccessView({
  profile,
  onReview,
  onHome,
}: {
  profile: Profile;
  onReview: () => void;
  onHome: () => void;
}) {
  const theme = useTheme();
  const [previewOpen, setPreviewOpen] = useState(false);
  const mainPhoto = profile.photos[0];

  return (
    <ThemedView type="backgroundElement" style={styles.successCard}>
      {mainPhoto ? (
        <Image
          source={{ uri: mainPhoto.uri }}
          style={[styles.successAvatar, { borderColor: Brand.primary }]}
          contentFit="cover"
          transition={150}
        />
      ) : (
        <LogoMark size={84} />
      )}
      <ThemedText type="subtitle" style={styles.successTitle}>
        You&apos;re all set, {profile.name}!
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.successBody}>
        Your profile was created. Open the developer console to see your answers — they&apos;re just
        logged there for now.
      </ThemedText>
      <View style={styles.successActions}>
        <AppButton
          label="View my profile"
          variant="primary"
          onPress={() => setPreviewOpen(true)}
          style={styles.successButton}
        />
        <AppButton
          label="Back to start"
          variant="secondary"
          onPress={onHome}
          style={styles.successButton}
        />
        <AppButton
          label="Review answers"
          variant="ghost"
          onPress={onReview}
          style={styles.successButton}
        />
      </View>

      <Modal
        visible={previewOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <ThemedView style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Your profile</ThemedText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close profile preview"
                hitSlop={12}
                onPress={() => setPreviewOpen(false)}
                style={({ pressed }) => [
                  styles.modalClose,
                  { backgroundColor: theme.backgroundElement },
                  pressed && { opacity: 0.6 },
                ]}
              >
                <ThemedText style={styles.modalCloseGlyph}>✕</ThemedText>
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator
            >
              <ProfileCard profile={profile} />
            </ScrollView>

            <AppButton
              label="Close"
              variant="secondary"
              onPress={() => setPreviewOpen(false)}
              style={styles.successButton}
            />
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
    gap: Spacing.three,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 40,
  },
  progressBlock: {
    gap: Spacing.two,
  },
  progressLabel: {
    textAlign: 'right',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: Spacing.six + 24,
  },
  content: {
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  sectionHeader: {
    gap: Spacing.one,
    marginTop: Spacing.three,
  },
  sectionTitle: {
    fontSize: 24,
    lineHeight: 32,
  },
  formCard: {
    borderRadius: 20,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  formDivider: {
    height: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
  },
  formRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  submitBlock: {
    marginTop: Spacing.three,
    gap: Spacing.two,
  },
  submitHint: {
    textAlign: 'center',
  },
  successCard: {
    marginTop: Spacing.five,
    borderRadius: 24,
    padding: Spacing.five,
    alignItems: 'center',
    gap: Spacing.three,
  },
  successTitle: {
    textAlign: 'center',
    fontSize: 26,
    lineHeight: 34,
  },
  successAvatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    overflow: 'hidden',
  },
  successBody: {
    textAlign: 'center',
  },
  successActions: {
    alignSelf: 'stretch',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  successButton: {
    alignSelf: 'stretch',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  modalCard: {
    width: '100%',
    maxWidth: 560,
    maxHeight: '92%',
    borderRadius: 28,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
  },
  modalClose: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseGlyph: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
  },
  modalScroll: {
    flexShrink: 1,
  },
  modalScrollContent: {
    paddingBottom: Spacing.one,
  },
});
