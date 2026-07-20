import { describe, expect, it } from 'vitest';
import {
  createGameCharacter,
  createStartingHeirCharacter,
  createStartingRulerCharacter,
  defaultCharacterHealth,
  formatCharacterName,
  isCharacterDead,
  setCharacterRulership,
  startingHeirCharacterId,
  startingRulerCharacterId,
  toRulerProfile,
  updateCharacterHealth,
} from './game-character';

describe('game character', () => {
  it('creates a normalized game character', () => {
    const character = createGameCharacter({
      id: 'character-test',
      givenName: '  Ashurbanipal  ',
      familyName: '  Sargonid  ',
      startingAge: 31.9,
      gender: 'man',
      health: 84.8,
      isRuler: true,
      reignStartYear: 1,
    });

    expect(character).toEqual({
      id: 'character-test',
      givenName: 'Ashurbanipal',
      familyName: 'Sargonid',
      startingAge: 31,
      gender: 'man',
      health: 84,
      isRuler: true,
      reignStartYear: 1,
    });
  });

  it('creates a starting ruler character', () => {
    const character = createStartingRulerCharacter({
      givenName: 'Ashurbanipal',
      familyName: 'Sargonid',
      startingAge: 31,
      gender: 'man',
    }, 1);

    expect(character).toEqual({
      id: startingRulerCharacterId,
      givenName: 'Ashurbanipal',
      familyName: 'Sargonid',
      startingAge: 31,
      gender: 'man',
      health: defaultCharacterHealth,
      isRuler: true,
      reignStartYear: 1,
    });
  });

  it('creates a starting heir character', () => {
    const character = createStartingHeirCharacter('Heir', 'Sargonid');

    expect(character).toEqual({
      id: startingHeirCharacterId,
      givenName: 'Heir',
      familyName: 'Sargonid',
      startingAge: 0,
      gender: 'unspecified',
      health: defaultCharacterHealth,
      isRuler: false,
      reignStartYear: null,
    });
  });

  it('formats character names and ruler profile compatibility', () => {
    const character = createGameCharacter({
      id: 'character-test',
      givenName: 'Ashurbanipal',
      familyName: 'Sargonid',
      startingAge: 31,
      gender: 'man',
    });

    expect(formatCharacterName(character)).toBe('Ashurbanipal Sargonid');
    expect(toRulerProfile(character)).toEqual({
      givenName: 'Ashurbanipal',
      familyName: 'Sargonid',
      startingAge: 31,
      gender: 'man',
    });
  });

  it('tracks health and death below zero', () => {
    const character = createGameCharacter({
      id: 'character-test',
      health: 0,
    });

    expect(isCharacterDead(character)).toBe(false);
    expect(isCharacterDead(updateCharacterHealth(character, -1))).toBe(true);
  });

  it('updates rulership state', () => {
    const character = createStartingHeirCharacter('Heir', 'Sargonid');

    expect(setCharacterRulership(character, true, 8)).toEqual({
      ...character,
      isRuler: true,
      reignStartYear: 8,
    });
  });
});