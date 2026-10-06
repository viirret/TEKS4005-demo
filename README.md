# Found — dating app UI demo 💘

An [Expo](https://expo.dev) (SDK 57) demo app built with `expo-router`, running on
**iOS, Android and web** from a single codebase.

## What's here

- **Landing screen** (`src/app/index.tsx`) — brand hero with two actions:
  - **Create a profile** → takes you to the onboarding flow
  - **Sign in** → intentionally a no-op for this demo
- **Create a profile** (`src/app/create-profile.tsx`) — onboarding flow:
  - Add up to **9 photos** from the system library; the first is the main photo
  - Enter a name and age (18–125 required), plus optional occupation and description
  - Select your gender and who you are looking for
  - **8 personality questions** answered with a custom slider
    (`src/components/slider.tsx`, built on core RN `PanResponder` — no extra
    dependencies)
  - **10 yes/no questions** and the option to mark questions as important
  - A live completion progress bar
  - On submit, the profile and answers (including photo metadata) are **logged to
    the console** and the app opens the signed-in home
- **Signed-in home** — open Matches, Suggestions, or your own profile; Sign out
  returns to the landing screen. Matches is empty for now. Suggestions shows
  only the top three compatible bundled demo profiles, one at a time. Your
  profile includes a way to review and edit your answers.

This is a UI demo: sign-in is a no-op, Sign out simply returns to the start,
and profiles are not sent to a server.

## Get started

```bash
npm install
npx expo start
```

Press `w` for web, or scan the QR code with Expo Go on iOS/Android.

## Structure

```
src/
├── app/
│   ├── _layout.tsx        # Stack navigator, theme and language providers
│   ├── index.tsx          # Landing screen
│   └── create-profile.tsx # Onboarding / question flow
├── components/            # Buttons, language switcher, photo uploader, questions, …
├── constants/             # Brand, questions, profile options and theme
├── data/                  # Bundled demo profiles and photos
├── i18n/                  # Translation catalogs and language state
└── algorithm.ts           # Suggestion ranking
```

The layout is responsive: content is centered with a max width on desktop web,
and stacks full-width on phones.

## Languages

The app has **19 languages**: English, Finnish, Spanish, Swedish, Latin,
Italian, German, Greek, Russian, French, Portuguese, Simplified Chinese,
Estonian, Bengali, Japanese, Korean, Indonesian, Turkish and Vietnamese. Their
UI text lives in [`src/i18n/translations.json`](src/i18n/translations.json).

The language selector is in the top-right corner of both screens. On web it is
a browser select control; in the iOS and Android apps it opens a native menu.
Changing languages updates the UI immediately without clearing profile inputs
or suggestions. English is the default. The choice persists across navigation
and, on web, across reloads in browser storage. Native app restarts return to
English.

Use the typed hook in components:

```tsx
const { t } = useI18n();
t('profile.create');
t('success.ready', { name: 'Alex' });
```

Add each new translation key to **all 19 catalogs**. Named placeholders such as
`{name}` must match across languages. Question constants contain translation
keys; their IDs and answer values stay language-independent. To add another
language, add a complete catalog and a `language.<code>` label to every catalog;
the selector derives its options from the JSON. TypeScript checks key coverage.
Profile names, occupations and descriptions are user content (including the
bundled demo profiles) and are displayed as entered.
