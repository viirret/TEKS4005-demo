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
  question: string;
  /** Short label shown under the left end of the slider. */
  lowLabel: string;
  /** Short label shown under the right end of the slider. */
  highLabel: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
};

export type YesNoQuestion = {
  id: string;
  type: 'yesno';
  question: string;
  defaultValue: boolean;
};

export type PersonalityQuestion = SliderQuestion | YesNoQuestion;

export const SLIDER_QUESTIONS: SliderQuestion[] = [
  {
    id: 'sl_energy',
    type: 'slider',
    question: "I'm the life of the party.",
    lowLabel: 'Homebody',
    highLabel: 'Life of the party',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50,
  },
  {
    id: 'sl_spontaneity',
    type: 'slider',
    question: 'I prefer to go with the flow.',
    lowLabel: 'Planner',
    highLabel: 'Spontaneous',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50,
  },
  {
    id: 'sl_adventure',
    type: 'slider',
    question: 'How adventurous are you?',
    lowLabel: 'Home sweet home',
    highLabel: 'Born explorer',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50,
  },
  {
    id: 'sl_social',
    type: 'slider',
    question: 'Where do you fall on the introvert–extrovert scale?',
    lowLabel: 'Introvert',
    highLabel: 'Extrovert',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50,
  },
  {
    id: 'sl_foodie',
    type: 'slider',
    question: "I'm a foodie at heart.",
    lowLabel: 'Eat to live',
    highLabel: 'Live to eat',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50,
  },
  {
    id: 'sl_fitness',
    type: 'slider',
    question: 'How important is staying active to you?',
    lowLabel: 'Couch vibes',
    highLabel: 'Fitness first',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50,
  },
  {
    id: 'sl_tidiness',
    type: 'slider',
    question: 'How tidy is your living space?',
    lowLabel: 'Organized chaos',
    highLabel: 'Marie Kondo',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50,
  },
  {
    id: 'sl_competitiveness',
    type: 'slider',
    question: 'How competitive are you, really?',
    lowLabel: 'All for fun',
    highLabel: 'Must win',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50,
  },
];

export const YES_NO_QUESTIONS: YesNoQuestion[] = [
  { id: 'yn_morning', type: 'yesno', question: 'Are you a morning person?', defaultValue: false },
  { id: 'yn_pets', type: 'yesno', question: 'Do you have (or dream of) pets?', defaultValue: false },
  {
    id: 'yn_serious',
    type: 'yesno',
    question: 'Are you looking for something serious?',
    defaultValue: false,
  },
  { id: 'yn_cooking', type: 'yesno', question: 'Can you cook a great meal?', defaultValue: false },
  {
    id: 'yn_hiking',
    type: 'yesno',
    question: 'Would you go on a hiking date?',
    defaultValue: false,
  },
  { id: 'yn_surprises', type: 'yesno', question: 'Do you love surprises?', defaultValue: false },
  {
    id: 'yn_karaoke',
    type: 'yesno',
    question: 'Is karaoke a good first date?',
    defaultValue: false,
  },
  {
    id: 'yn_move',
    type: 'yesno',
    question: 'Would you cross an ocean for love?',
    defaultValue: false,
  },
  {
    id: 'yn_planning',
    type: 'yesno',
    question: 'Do you plan your weekends in advance?',
    defaultValue: false,
  },
  {
    id: 'yn_dancefloor',
    type: 'yesno',
    question: 'Are you the first one on the dance floor?',
    defaultValue: false,
  },
];

export const PERSONALITY_QUESTIONS: PersonalityQuestion[] = [
  ...SLIDER_QUESTIONS,
  ...YES_NO_QUESTIONS,
];

/** All questions in the flow, used for the completion progress indicator. */
export const TOTAL_QUESTION_COUNT = PERSONALITY_QUESTIONS.length;