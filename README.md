# Found — dating app UI demo 💘

An [Expo](https://expo.dev) (SDK 57) demo app built with `expo-router`, running on
**iOS, Android and web** from a single codebase.

## What's here

- **Landing screen** (`src/app/index.tsx`) — brand hero with two actions:
  - **Create a profile** → takes you to the onboarding flow
  - **Sign in** → intentionally a no-op for this demo
- **Create a profile** (`src/app/create-profile.tsx`) — onboarding flow:
  - **Profile photo** — pick a square-cropped image from the system
    gallery/file picker (`expo-image-picker`)
  - Basic info: name, age, occupation
  - **8 personality questions** answered with a custom slider
    (`src/components/slider.tsx`, built on core RN `PanResponder` — no extra
    dependencies)
  - **10 yes/no questions** answered with a segmented control
  - A live completion progress bar
  - On submit, the whole payload (including the photo metadata) is **logged to
    the console** (`console.log` + pretty-printed JSON)

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
│   ├── _layout.tsx        # Stack navigator + theme provider
│   ├── index.tsx          # Landing screen
│   └── create-profile.tsx # Onboarding / question flow
├── components/            # AppButton, Slider, PhotoUploader, question cards, LogoMark, …
└── constants/
    ├── brand.ts           # Brand colors & layout values
    ├── questions.ts       # The personality question definitions
    └── theme.ts           # Light/dark colors
```

The layout is responsive: content is centered with a max width on desktop web,
and stacks full-width on phones.