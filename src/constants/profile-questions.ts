/**
 * Profile questions shown in the "About you" section of the create-profile
 * flow. Values are kept separate from labels so the submitted payload can use
 * stable identifiers rather than display text.
 */

export const GENDER_OPTIONS = [
  { value: 'man', label: 'gender.man' },
  { value: 'woman', label: 'gender.woman' },
  { value: 'non-binary', label: 'gender.nonBinary' },
  { value: 'dont-want-to-say', label: 'gender.private' },
] as const;

export type Gender = (typeof GENDER_OPTIONS)[number]['value'];

export const LOOKING_FOR_PREFERENCE_OPTIONS = [
  { value: 'men', label: 'lookingFor.men' },
  { value: 'women', label: 'lookingFor.women' },
  { value: 'non-binary-people', label: 'lookingFor.nonBinary' },
] as const;

export const ANYONE_OPTION = { value: 'anyone', label: 'lookingFor.anyone' } as const;

export const LOOKING_FOR_OPTIONS = [...LOOKING_FOR_PREFERENCE_OPTIONS, ANYONE_OPTION] as const;

export type LookingForPreference = (typeof LOOKING_FOR_PREFERENCE_OPTIONS)[number]['value'];
export type LookingFor = (typeof LOOKING_FOR_OPTIONS)[number]['value'];

export const LOOKING_FOR_PREFERENCE_VALUES = [
  'men',
  'women',
  'non-binary-people',
] as const satisfies readonly LookingForPreference[];

export const PROFILE_QUESTION_COUNT = 2;
