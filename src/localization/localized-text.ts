export const defaultLocalizedText = {
  'gameSetup.title': 'Create Ruler',
  'gameSetup.description': 'Create your ruler before beginning your first year in court.',
  'gameSetup.givenNameLabel': 'Given name',
  'gameSetup.givenNamePlaceholder': 'Ruler',
  'gameSetup.familyNameLabel': 'Family name',
  'gameSetup.familyNamePlaceholder': 'House',
  'gameSetup.startingAgeLabel': 'Starting age',
  'gameSetup.genderLabel': 'Gender',
  'gameSetup.genderUnspecified': 'Unspecified',
  'gameSetup.genderWoman': 'Woman',
  'gameSetup.genderMan': 'Man',
  'gameSetup.genderNonbinary': 'Nonbinary',
  'gameSetup.startGameButton': 'Start Game',
  'gameSetup.backButton': 'Back',
  'gameSetup.startYearNote': 'The game begins in Year 1 of the dynasty.',
} as const;

export type LocalizedTextKey = keyof typeof defaultLocalizedText;

export function text(key: LocalizedTextKey): string {
  return defaultLocalizedText[key];
}