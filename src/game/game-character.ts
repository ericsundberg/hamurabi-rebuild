import {
  createRulerProfile,
  defaultRulerProfile,
  type RulerCreationInput,
  type RulerGender,
  type RulerProfile,
} from './ruler-profile';

export type CharacterId = string;

export interface GameCharacter {
  readonly id: CharacterId;
  readonly givenName: string;
  readonly familyName: string;
  readonly startingAge: number;
  readonly gender: RulerGender;
  readonly health: number;
  readonly isRuler: boolean;
  readonly reignStartYear: number | null;
}

export interface GameCharacterCreationInput extends RulerCreationInput {
  readonly id: CharacterId;
  readonly health: number;
  readonly isRuler: boolean;
  readonly reignStartYear: number | null;
}

export const defaultCharacterHealth = 100;
export const startingRulerCharacterId = 'character-ruler';
export const startingHeirCharacterId = 'character-heir';

export function createGameCharacter(
  input: Partial<GameCharacterCreationInput> & Pick<GameCharacterCreationInput, 'id'>,
): GameCharacter {
  const profile = createRulerProfile(input);

  return {
    id: input.id,
    givenName: profile.givenName,
    familyName: profile.familyName,
    startingAge: normalizeCharacterStartingAge(input.startingAge),
    gender: profile.gender,
    health: normalizeHealth(input.health),
    isRuler: input.isRuler ?? false,
    reignStartYear: input.reignStartYear ?? null,
  };
}

export function createStartingRulerCharacter(
  rulerProfile: RulerProfile,
  reignStartYear: number,
): GameCharacter {
  return createGameCharacter({
    id: startingRulerCharacterId,
    givenName: rulerProfile.givenName,
    familyName: rulerProfile.familyName,
    startingAge: rulerProfile.startingAge,
    gender: rulerProfile.gender,
    health: defaultCharacterHealth,
    isRuler: true,
    reignStartYear,
  });
}

export function createStartingHeirCharacter(
  givenName: string,
  familyName: string,
): GameCharacter {
  return createGameCharacter({
    id: startingHeirCharacterId,
    givenName,
    familyName,
    startingAge: 0,
    gender: 'unspecified',
    health: defaultCharacterHealth,
    isRuler: false,
    reignStartYear: null,
  });
}

export function formatCharacterName(character: GameCharacter): string {
  return `${character.givenName} ${character.familyName}`;
}

export function toRulerProfile(character: GameCharacter): RulerProfile {
  return {
    givenName: character.givenName,
    familyName: character.familyName,
    startingAge: character.startingAge,
    gender: character.gender,
  };
}

export function updateCharacterHealth(
  character: GameCharacter,
  health: number,
): GameCharacter {
  return {
    ...character,
    health: normalizeHealth(health),
  };
}

export function setCharacterRulership(
  character: GameCharacter,
  isRuler: boolean,
  reignStartYear: number | null,
): GameCharacter {
  return {
    ...character,
    isRuler,
    reignStartYear,
  };
}

export function isCharacterDead(character: GameCharacter): boolean {
  return character.health < 0;
}

function normalizeCharacterStartingAge(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value)) {
    return defaultRulerProfile.startingAge;
  }

  const wholeAge = Math.floor(value);

  return Math.min(99, Math.max(0, wholeAge));
}

function normalizeHealth(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value)) {
    return defaultCharacterHealth;
  }

  return Math.floor(value);
}