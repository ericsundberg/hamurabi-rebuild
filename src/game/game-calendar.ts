import type { GameState } from '../core/types';
import type { RulerProfile } from './ruler-profile';

export const gameStartYear = 1;

export function getCurrentRulerAge(
  rulerProfile: RulerProfile,
  state: GameState,
): number {
  return rulerProfile.startingAge + Math.max(0, state.year - 1);
}