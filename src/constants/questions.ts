import type { TranslationKey } from '@/i18n/translations';

/**
 * The personality questions used in the "create a profile" flow.
 *
 * Each question is answered with either a slider (`type: 'slider'`) or a
 * yes/no toggle (`type: 'yesno'`). For now the answers are only logged to the
 * console, so every question carries a sensible default value.
 */

export type SliderQuestion = {
  id: string;
  type: 'slider';
  question: TranslationKey;
  /** Short label shown under the left end of the slider. */
  lowLabel: TranslationKey;
  /** Short label shown under the right end of the slider. */
  highLabel: TranslationKey;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
};

export type YesNoQuestion = {
  id: string;
  type: 'yesno';
  question: TranslationKey;
  defaultValue: boolean;
};

export type PersonalityQuestion = SliderQuestion | YesNoQuestion;

export const SLIDER_QUESTIONS: SliderQuestion[] = [
  {
    id: 'sl_energy',
    type: 'slider',
    question: 'questions.sl_energy.question',
    lowLabel: 'questions.sl_energy.lowLabel',
    highLabel: 'questions.sl_energy.highLabel',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50,
  },
  {
    id: 'sl_spontaneity',
    type: 'slider',
    question: 'questions.sl_spontaneity.question',
    lowLabel: 'questions.sl_spontaneity.lowLabel',
    highLabel: 'questions.sl_spontaneity.highLabel',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50,
  },
  {
    id: 'sl_adventure',
    type: 'slider',
    question: 'questions.sl_adventure.question',
    lowLabel: 'questions.sl_adventure.lowLabel',
    highLabel: 'questions.sl_adventure.highLabel',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50,
  },
  {
    id: 'sl_social',
    type: 'slider',
    question: 'questions.sl_social.question',
    lowLabel: 'questions.sl_social.lowLabel',
    highLabel: 'questions.sl_social.highLabel',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50,
  },
  {
    id: 'sl_foodie',
    type: 'slider',
    question: 'questions.sl_foodie.question',
    lowLabel: 'questions.sl_foodie.lowLabel',
    highLabel: 'questions.sl_foodie.highLabel',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50,
  },
  {
    id: 'sl_fitness',
    type: 'slider',
    question: 'questions.sl_fitness.question',
    lowLabel: 'questions.sl_fitness.lowLabel',
    highLabel: 'questions.sl_fitness.highLabel',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50,
  },
  {
    id: 'sl_tidiness',
    type: 'slider',
    question: 'questions.sl_tidiness.question',
    lowLabel: 'questions.sl_tidiness.lowLabel',
    highLabel: 'questions.sl_tidiness.highLabel',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50,
  },
  {
    id: 'sl_competitiveness',
    type: 'slider',
    question: 'questions.sl_competitiveness.question',
    lowLabel: 'questions.sl_competitiveness.lowLabel',
    highLabel: 'questions.sl_competitiveness.highLabel',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50,
  },
];

export const YES_NO_QUESTIONS: YesNoQuestion[] = [
  {
    id: 'yn_morning',
    type: 'yesno',
    question: 'questions.yn_morning.question',
    defaultValue: false,
  },
  {
    id: 'yn_pets',
    type: 'yesno',
    question: 'questions.yn_pets.question',
    defaultValue: false,
  },
  {
    id: 'yn_serious',
    type: 'yesno',
    question: 'questions.yn_serious.question',
    defaultValue: false,
  },
  {
    id: 'yn_cooking',
    type: 'yesno',
    question: 'questions.yn_cooking.question',
    defaultValue: false,
  },
  {
    id: 'yn_hiking',
    type: 'yesno',
    question: 'questions.yn_hiking.question',
    defaultValue: false,
  },
  {
    id: 'yn_surprises',
    type: 'yesno',
    question: 'questions.yn_surprises.question',
    defaultValue: false,
  },
  {
    id: 'yn_karaoke',
    type: 'yesno',
    question: 'questions.yn_karaoke.question',
    defaultValue: false,
  },
  {
    id: 'yn_move',
    type: 'yesno',
    question: 'questions.yn_move.question',
    defaultValue: false,
  },
  {
    id: 'yn_planning',
    type: 'yesno',
    question: 'questions.yn_planning.question',
    defaultValue: false,
  },
  {
    id: 'yn_dancefloor',
    type: 'yesno',
    question: 'questions.yn_dancefloor.question',
    defaultValue: false,
  },
];

export const PERSONALITY_QUESTIONS: PersonalityQuestion[] = [
  ...SLIDER_QUESTIONS,
  ...YES_NO_QUESTIONS,
];

/** All questions in the flow, used for the completion progress indicator. */
export const TOTAL_QUESTION_COUNT = PERSONALITY_QUESTIONS.length;
