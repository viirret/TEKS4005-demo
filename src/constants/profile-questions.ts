/**
 * Profile questions shown in the "About you" section of the create-profile
 * flow. Values are kept separate from labels so the submitted payload can use
 * stable identifiers rather than display text.
 */

export const GENDER_OPTIONS = [
  { value: 'man', label: 'Man' },
  { value: 'woman', label: 'Woman' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'dont-want-to-say', label: "Don't want to say" },
] as const;

export type Gender = (typeof GENDER_OPTIONS)[number]['value'];

export const LOOKING_FOR_PREFERENCE_OPTIONS = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'non-binary-people', label: 'Non-binary people' },
] as const;

export const ANYONE_OPTION = { value: 'anyone', label: 'Anyone' } as const;

export const LOOKING_FOR_OPTIONS = [...LOOKING_FOR_PREFERENCE_OPTIONS, ANYONE_OPTION] as const;

export type LookingForPreference = (typeof LOOKING_FOR_PREFERENCE_OPTIONS)[number]['value'];
export type LookingFor = (typeof LOOKING_FOR_OPTIONS)[number]['value'];

export const LOOKING_FOR_PREFERENCE_VALUES = [
  'men',
  'women',
  'non-binary-people',
] as const satisfies readonly LookingForPreference[];

export const PROFILE_QUESTION_COUNT = 2;
