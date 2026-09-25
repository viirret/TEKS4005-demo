/**
 * Matching logic for the demo.
 *
 * Kept free of React and of the data itself: the screen hands in the answers of
 * the person who just created a profile plus the list of candidates (currently
 * the fake people in `src/data/people.json`), and gets back a ranked list.
 *
 * Two steps, in this order:
 *  1. Hard filter — the match has to work both ways: the user must want the
 *     candidate's gender, and the candidate's own preferences must cover the
 *     user's gender ("men only" can never return a woman, and a man looking
 *     for men can only meet men who are also looking for men).
 *  2. Ranking — the survivors are scored by how similar their personality
 *     answers are to the user's, best first.
 */

import { PERSONALITY_QUESTIONS } from '@/constants/questions';

/** Answers keyed by question id, matching the shape stored in the payload. */
export type PersonalityAnswers = Record<string, number | boolean>;

/** One person from the fake database (`src/data/people.json`). */
export type MatchCandidate = {
  id: number;
  name: string;
  age: number;
  occupation?: string;
  description: string;
  /** `man` | `woman` | `non-binary` | `dont-want-to-say` for real entries. */
  gender: string;
  /** The candidate's own preferences, e.g. `['men', 'non-binary-people']`. */
  lookingFor: string[];
  /** File name of the candidate's photo, e.g. `MayaThompson.jpeg`. */
  photo: string;
  personality: PersonalityAnswers;
};

/** What the algorithm needs to know about the user who is looking for a match. */
export type MatchSeeker = {
  /** The user's own gender answer, or `null` if they skipped the question. */
  gender: string | null;
  lookingFor: string[];
  answers: PersonalityAnswers;
};

export type MatchResult = {
  candidate: MatchCandidate;
  /** Similarity between the two sets of answers, 0–100. */
  score: number;
};

/** The "who are you looking for" option that stands for each gender. */
const PREFERENCE_BY_GENDER: Record<string, string> = {
  man: 'men',
  woman: 'women',
  'non-binary': 'non-binary-people',
};

/**
 * A record needs a gender, a photo and preferences of its own to be a real
 * person rather than a placeholder.
 */
function isMatchable(candidate: MatchCandidate): boolean {
  return Boolean(candidate.gender) && Boolean(candidate.photo) && candidate.lookingFor.length > 0;
}

/**
 * Whether the user asked for this candidate: their preferences cover the
 * candidate's gender, or they are open to everyone. The `anyone` shortcut and
 * an unanswered question are treated the same way.
 */
function userWantsCandidate(seeker: MatchSeeker, candidate: MatchCandidate): boolean {
  if (seeker.lookingFor.includes('anyone') || seeker.lookingFor.length === 0) return true;
  return seeker.lookingFor.includes(PREFERENCE_BY_GENDER[candidate.gender]);
}

/**
 * Whether the candidate would want the user back — matching only works both
 * ways, so a man looking for men can only meet men who are also looking for
 * men. If the user hasn't shared a gender there is nothing to check against,
 * so this side of the match stands aside.
 */
function candidateWantsUser(seeker: MatchSeeker, candidate: MatchCandidate): boolean {
  const wanted = seeker.gender ? PREFERENCE_BY_GENDER[seeker.gender] : undefined;
  if (!wanted) return true;
  return candidate.lookingFor.includes('anyone') || candidate.lookingFor.includes(wanted);
}

/**
 * How similar two answers to the same question are, from 0 to 1. Sliders lose
 * points gradually as the values drift apart; yes/no answers are all or
 * nothing. Questions either side has not answered are ignored.
 */
function answerSimilarity(mine: number | boolean, theirs: number | boolean, range: number): number {
  if (typeof mine !== typeof theirs) return 0;
  if (typeof mine === 'number' && typeof theirs === 'number') {
    const distance = Math.abs(mine - theirs);
    return range > 0 ? Math.max(0, 1 - distance / range) : 0;
  }
  return mine === theirs ? 1 : 0;
}

/**
 * Similarity between the user's answers and a candidate's, as a percentage.
 * Every question counts the same, so the score is the average similarity
 * across the questions both of them answered.
 */
export function scoreCandidate(answers: PersonalityAnswers, candidate: MatchCandidate): number {
  let similarity = 0;
  let counted = 0;

  for (const question of PERSONALITY_QUESTIONS) {
    const mine = answers[question.id];
    const theirs = candidate.personality[question.id];
    if (mine === undefined || theirs === undefined) continue;

    const range = question.type === 'slider' ? question.max - question.min : 0;
    similarity += answerSimilarity(mine, theirs, range);
    counted += 1;
  }

  if (counted === 0) return 0;
  return Math.round((similarity / counted) * 100);
}

/**
 * Candidates that both the user and the candidate want, best match first. An
 * empty result means there is nobody left to show.
 */
export function rankMatches(seeker: MatchSeeker, candidates: MatchCandidate[]): MatchResult[] {
  return candidates
    .filter(isMatchable)
    .filter(
      (candidate) => userWantsCandidate(seeker, candidate) && candidateWantsUser(seeker, candidate),
    )
    .map((candidate) => ({ candidate, score: scoreCandidate(seeker.answers, candidate) }))
    .sort((a, b) => b.score - a.score);
}
