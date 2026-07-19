import type { GameState } from '../../core/types';
import {
  formatRulerName,
  type RulerGender,
  type RulerProfile,
} from '../../game/ruler-profile';
import { text, type LocalizedTextKey } from '../../localization/localized-text';
import { makeElement } from '../../ui/dom-helpers';
import type { SceneContext } from '../../app/scene-router';

const genderTextKeys = {
  unspecified: 'gameSetup.genderUnspecified',
  woman: 'gameSetup.genderWoman',
  man: 'gameSetup.genderMan',
  nonbinary: 'gameSetup.genderNonbinary',
} as const satisfies Record<RulerGender, LocalizedTextKey>;

export function makeRulerStatsLine(
  context: SceneContext,
  state: GameState,
): HTMLElement {
  const rulerProfile = context.game.getRulerProfile();
  const rulerAge = context.game.getRulerAge();

  return makeElement('p', {
    className: 'scene-description',
    textContent: formatRulerStatsText({
      rulerName: getRulerName(rulerProfile, state),
      age: rulerAge,
      gender: rulerProfile?.gender ?? null,
    }),
  });
}

interface RulerStatsTextInput {
  readonly rulerName: string;
  readonly age: number | null;
  readonly gender: RulerGender | null;
}

function formatRulerStatsText(input: RulerStatsTextInput): string {
  const ageText = input.age?.toString() ?? text('rulerStats.unknownValue');
  const genderText = input.gender
    ? text(genderTextKeys[input.gender])
    : text('rulerStats.unknownValue');

  return `${text('rulerStats.rulerLabel')}: ${input.rulerName} | ${text('rulerStats.ageLabel')}: ${ageText} | ${text('rulerStats.genderLabel')}: ${genderText}`;
}

function getRulerName(
  rulerProfile: RulerProfile | null,
  state: GameState,
): string {
  if (!rulerProfile) {
    return state.playerName;
  }

  return formatRulerName(rulerProfile);
}