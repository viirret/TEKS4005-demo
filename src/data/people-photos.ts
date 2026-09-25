import type { ImageSource } from 'expo-image';

/**
 * Photos for the fake people, keyed by the `photo` file name used in
 * `people.json`.
 *
 * Metro can only bundle images that are required with a literal path, so the
 * JSON keeps a plain file name and every image is listed explicitly here. That
 * is why `assets/images/people/` exists separately from the data.
 */
const PEOPLE_PHOTOS: Record<string, ImageSource> = {
  'AlexMorgan.jpeg': require('../../assets/images/people/AlexMorgan.jpeg'),
  'CamilleDubois.jpeg': require('../../assets/images/people/CamilleDubois.jpeg'),
  'EliasBerg.jpeg': require('../../assets/images/people/EliasBerg.jpeg'),
  'JordanJackson.jpeg': require('../../assets/images/people/JordanJackson.jpeg'),
  'LiamConnor.jpeg': require('../../assets/images/people/LiamConnor.jpeg'),
  'MayaThompson.jpeg': require('../../assets/images/people/MayaThompson.jpeg'),
  'NoorRahman.jpeg': require('../../assets/images/people/NoorRahman.jpeg'),
  'PriyaShah.jpeg': require('../../assets/images/people/PriyaShah.jpeg'),
  'SofiaAlvarez.jpeg': require('../../assets/images/people/SofiaAlvarez.jpeg'),
  'TheoMartin.jpeg': require('../../assets/images/people/TheoMartin.jpeg'),
};

/** The bundled photo for a person, or `undefined` if the name is unknown. */
export function getPersonPhoto(fileName: string): ImageSource | undefined {
  return PEOPLE_PHOTOS[fileName];
}
