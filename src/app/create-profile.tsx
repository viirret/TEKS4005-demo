import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/app-button';
import { FormField } from '@/components/form-field';
import { LogoMark } from '@/components/logo';
import { PhotoUploader } from '@/components/photo-uploader';
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

const TOTAL_FIELDS = 4 + TOTAL_QUESTION_COUNT;

/**
 * The "create a profile" flow: basic info (name, age, occupation) followed by
 * a batch of personality questions answered with sliders and yes/no toggles.
 * For now the whole payload is printed to the console.
 */
export default function CreateProfileScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('');
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [answers, setAnswers] = useState<PersonalityAnswers>(INITIAL_ANSWERS);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (id: string, value: number | boolean) => {
    setAnswers((previous) => ({ ...previous, [id]: value }));
    setAnsweredIds((previous) => {
      if (previous.has(id)) return previous;
      const next = new Set(previous);
      next.add(id);
      return next;
    });
  };

  const basicsAnswered =
    [name.trim(), age.trim(), occupation.trim()].filter((value) => value.length > 0).length +
    (photo ? 1 : 0);
  const answeredCount = basicsAnswered + answeredIds.size;
  const progress = answeredCount / TOTAL_FIELDS;

  const handleSubmit = () => {
    const payload = {
      app: Brand.name,
      profile: {
        name: name.trim(),
        age: age.trim() ? Number(age.trim()) : null,
        occupation: occupation.trim(),
        photo: photo
          ? {
              uri: photo.uri,
              width: photo.width,
              height: photo.height,
              fileName: photo.fileName ?? null,
              fileSize: photo.fileSize ?? null,
            }
          : null,
      },
      personality: { ...answers },
    };
    console.log(`[${Brand.name}] New profile created:`);
    console.log(JSON.stringify(payload, null, 2));
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
              ]}>
              <ThemedText style={styles.backIcon}>←</ThemedText>
            </Pressable>
            <ThemedText style={styles.headerTitle}>Create your profile</ThemedText>
            <View style={styles.headerSpacer} />
          </View>
          <View style={styles.progressBlock}>
            <ThemedText themeColor="textSecondary" type="small" style={styles.progressLabel}>
              {answeredCount} of {TOTAL_FIELDS} answered
            </ThemedText>
            <ProgressBar progress={progress} />
          </View>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            <View style={styles.content}>
              {submitted ? (
                <SuccessView
                  name={name.trim()}
                  photo={photo}
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
                      The essentials — those three things everyone asks about.
                    </ThemedText>
                  </View>

                  <ThemedView type="backgroundElement" style={styles.formCard}>
                    <PhotoUploader photo={photo} onChange={setPhoto} />
                    <View style={[styles.formDivider, { backgroundColor: theme.backgroundSelected }]} />

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
                        label="Age"
                        placeholder="e.g. 28"
                        placeholderTextColor={theme.textSecondary}
                        value={age}
                        onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ''))}
                        keyboardType="number-pad"
                        inputMode="numeric"
                        maxLength={3}
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
                    />
                  ))}

                  {/* Submit */}
                  <View style={styles.submitBlock}>
                    <AppButton
                      label={submitted ? 'Profile created' : 'Create profile'}
                      variant="primary"
                      disabled={!name.trim()}
                      onPress={handleSubmit}
                    />
                    {!name.trim() ? (
                      <ThemedText themeColor="textSecondary" type="small" style={styles.submitHint}>
                        Add your name to create the profile.
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
  name,
  photo,
  onReview,
  onHome,
}: {
  name: string;
  photo: ImagePicker.ImagePickerAsset | null;
  onReview: () => void;
  onHome: () => void;
}) {
  return (
    <ThemedView type="backgroundElement" style={styles.successCard}>
      {photo ? (
        <Image
          source={{ uri: photo.uri }}
          style={[styles.successAvatar, { borderColor: Brand.primary }]}
          contentFit="cover"
          transition={150}
        />
      ) : (
        <LogoMark size={84} />
      )}
      <ThemedText type="subtitle" style={styles.successTitle}>
        You&apos;re all set{name ? `, ${name}` : ''}!
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.successBody}>
        Your profile was created. Open the developer console to see your
        answers — they&apos;re just logged there for now.
      </ThemedText>
      <View style={styles.successActions}>
        <AppButton label="Back to start" variant="primary" onPress={onHome} style={styles.successButton} />
        <AppButton label="Review answers" variant="secondary" onPress={onReview} style={styles.successButton} />
      </View>
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
});