import { describe, expect, it } from 'vitest';
import type { GameState } from '../core/types';
import { getCurrentRulerAge, gameStartYear } from './game-calendar';
import type { RulerProfile } from './ruler-profile';

describe('game calendar', () => {
  it('uses a fixed game start year', () => {
    expect(gameStartYear).toBe(1);
  });

  it('calculates current ruler age from starting age and game year', () => {
    const rulerProfile: RulerProfile = {
      givenName: 'Ada',
      familyName: 'Stone',
      startingAge: 30,
      gender: 'woman',
    };

    const state: GameState = {
      year: 3,
      playerName: 'Ada Stone',
      population: 100,
      acres: 1000,
      grain: 1800,
    };

    expect(getCurrentRulerAge(rulerProfile, state)).toBe(32);
  });
});