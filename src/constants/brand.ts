/**
 * Brand constants for the Found dating-app demo.
 *
 * `Brand` holds colors that stay identical across light/dark mode (solid
 * fills, buttons, accents). For theme-aware colors (that adapt to the current
 * color scheme), use the `tint` / `tintSoft` keys from `Colors` in
 * `@/constants/theme`.
 */
export const Brand = {
  /** App name shown in the UI. */
  name: 'Found',
  /** Short tagline shown under the logo. */
  tagline: 'Find your person.',
  /** Primary brand color — used for filled buttons, sliders, selected pills. */
  primary: '#E0245E',
  /** Darker brand color for pressed / active button states. */
  primaryPressed: '#B8174D',
  /** Soft brand tint used for chips, badges and decorative blobs. */
  primarySoft: '#FDE7F0',
  /** Lighter decorative heart tone (top of the logo mark). */
  heartStart: '#FF8FB5',
  /** Deeper decorative heart tone (bottom of the logo mark). */
  heartEnd: '#E0245E',
  /** Color used for positive / success feedback. */
  success: '#22C55E',
  /** Text color placed on top of filled brand surfaces. */
  textOnPrimary: '#FFFFFF',
} as const;

/** Shared layout values used to keep the demo consistent and responsive. */
export const Layout = {
  /** Max width of centered content on large (web) screens. */
  maxContentWidth: 640,
  /** Standard height for tappable buttons. */
  buttonHeight: 54,
} as const;