import type { ImageSource } from 'expo-image';

/**
 * Photos for the fake people, keyed by the `photo` file name used in
 * `people.json`.
 *
 * `require.context` pulls in every image in the directory in one line, so
 * adding a profile does not mean editing this file. It is an experimental Metro
 * feature, switched on by `transformer.unstable_allowRequireContext` in
 * `metro.config.js`; Metro has no other way to import a directory, so that flag
 * is the only reason this is not a list of 110 `require` calls.
 *
 * The result is memoised because the context object rebuilds its lookup table on
 * every access, and this is called once per card in the match deck.
 */
const photosByName: Record<string, ImageSource> = (() => {
  const context = require.context('../../assets/images/people', false, /\.jpe?g$/, 'sync');
  const byName: Record<string, ImageSource> = {};
  for (const key of context.keys()) {
    // Context keys are relative to the directory, e.g. './MayaThompson.jpeg'.
    const name = key.slice(key.lastIndexOf('/') + 1);
    byName[name] = context(key) as ImageSource;
  }
  return byName;
})();

/** The bundled photo for a person, or `undefined` if the name is unknown. */
export function getPersonPhoto(fileName: string): ImageSource | undefined {
  return photosByName[fileName];
}
