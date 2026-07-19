import type { SceneContext } from '../../app/scene-router';
import type { GameState } from '../../core/types';
import { makeButton, makeElement } from '../../ui/dom-helpers';
import { makeAnnualReportList } from './annual-report-list';
import { makeRecentEventsList } from './recent-events-list';
import { makeYearlyCommandForm } from './yearly-command-form';

export function makeYearlyTurnPanel(
  context: SceneContext,
  state: GameState,
): HTMLElement {
  const panel = makeElement('div', {
    className: 'scene-panel',
  });

  panel.append(
    makeElement('h1', {
      textContent: `Year ${state.year} Court`,
    }),
    makeElement('p', {
      className: 'scene-description',
      textContent: `Ruler: ${state.playerName}`,
    }),
    makeElement('h2', {
      textContent: 'Annual Report',
    }),
    makeAnnualReportList(context.game.getAnnualReport()),
    makeElement('h2', {
      textContent: 'Recent Events',
    }),
    makeRecentEventsList(context.game.getLastOutcome()),
    makeElement('h2', {
      textContent: 'Issue Commands',
    }),
    makeYearlyCommandForm(context),
    makeButton('Back to Title', () => context.navigate('title'), 'secondary-button', {
    onBeforeClick: () => context.audio.sfx.play('button-cancel'),
    }),
  );

  return panel;
}
