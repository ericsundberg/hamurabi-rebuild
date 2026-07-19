import type { SceneContext } from '../app/scene-router';
import { defaultGameConfig } from '../content/default-game-config';
import type { GameState } from '../core/types';
import { makeButton, makeElement } from '../ui/dom-helpers';

export function renderYearlyTurnScene(context: SceneContext): HTMLElement {
  const scene = makeElement('section', {
    className: 'scene',
  });

  const panel = makeElement('div', {
    className: 'scene-panel',
  });

  const state = context.game.getState();

  if (!state) {
    panel.append(
      makeElement('h1', {
        textContent: 'No Active Game',
      }),
      makeElement('p', {
        className: 'scene-description',
        textContent: 'Start a new game before entering yearly commands.',
      }),
      makeButton('New Game', () => context.navigate('game-setup'), 'menu-button', {
        onBeforeClick: () => context.audio.sfx.play('button-click'),
      }),
      makeButton('Back to Title', () => context.navigate('title'), 'secondary-button', {
        onBeforeClick: () => context.audio.sfx.play('button-click'),
      }),
    );

    scene.append(panel);

    return scene;
  }

  const annualReport = context.game.getAnnualReport();
  const lastOutcome = context.game.getLastOutcome();

  const title = makeElement('h1', {
    textContent: `Year ${state.year} Court`,
  });

  const summary = makeElement('p', {
    className: 'scene-description',
    textContent: `Ruler: ${state.playerName}`,
  });

  const reportList = makeElement('ul', {
    className: 'annual-report-list',
  });

  for (const line of annualReport?.lines ?? []) {
    const item = makeElement('li', {
      textContent: line,
    });

    reportList.append(item);
  }

  const eventList = makeElement('ul', {
    className: 'annual-event-list',
  });

  if (lastOutcome) {
    for (const event of lastOutcome.events) {
      const item = makeElement('li', {
        textContent: event,
      });

      eventList.append(item);
    }
  } else {
    const item = makeElement('li', {
      textContent: 'No yearly command has been submitted yet.',
    });

    eventList.append(item);
  }

  const form = makeYearlyCommandForm(context, state);

  panel.append(
    title,
    summary,
    makeElement('h2', {
      textContent: 'Annual Report',
    }),
    reportList,
    makeElement('h2', {
      textContent: 'Recent Events',
    }),
    eventList,
    makeElement('h2', {
      textContent: 'Issue Commands',
    }),
    form,
    makeButton('Back to Title', () => context.navigate('title'), 'secondary-button', {
      onBeforeClick: () => context.audio.sfx.play('button-click'),
    }),
  );

  scene.append(panel);

  return scene;
}

function makeYearlyCommandForm(
  context: SceneContext,
  state: GameState,
): HTMLFormElement {
  const form = makeElement('form', {
    className: 'menu-form',
  });

  const acresToBuyInput = makeNumberInput('acres-to-buy', 0);
  const acresToSellInput = makeNumberInput('acres-to-sell', 0);
  const grainToFeedInput = makeNumberInput(
    'grain-to-feed',
    getDefaultGrainToFeed(state),
  );
  const acresToPlantInput = makeNumberInput(
    'acres-to-plant',
    getDefaultAcresToPlant(state),
  );

  form.append(
    makeNumberLabel('Acres to buy', acresToBuyInput),
    makeNumberLabel('Acres to sell', acresToSellInput),
    makeNumberLabel('Grain to feed people', grainToFeedInput),
    makeNumberLabel('Acres to plant', acresToPlantInput),
  );

  const submitButton = document.createElement('button');

  submitButton.type = 'submit';
  submitButton.className = 'menu-button';
  submitButton.textContent = 'Submit Year';

  form.append(submitButton);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    context.audio.sfx.play('button-click');

    const outcome = context.game.processTurn({
      acresToBuy: readWholeNumber(acresToBuyInput),
      acresToSell: readWholeNumber(acresToSellInput),
      grainToFeed: readWholeNumber(grainToFeedInput),
      acresToPlant: readWholeNumber(acresToPlantInput),
    });

    if (!outcome) {
      console.warn('[game] tried to submit a yearly turn without an active game');
      context.navigate('game-setup');
      return;
    }

    console.log(`[game] processed turn for year ${outcome.previousState.year}`);

    context.navigate('yearly-turn');
  });

  return form;
}

function makeNumberInput(name: string, value: number): HTMLInputElement {
  const input = document.createElement('input');

  input.name = name;
  input.type = 'number';
  input.min = '0';
  input.step = '1';
  input.value = String(value);

  return input;
}

function makeNumberLabel(
  labelText: string,
  input: HTMLInputElement,
): HTMLLabelElement {
  const label = makeElement('label', {
    textContent: labelText,
  });

  label.append(input);

  return label;
}

function readWholeNumber(input: HTMLInputElement): number {
  const parsedValue = Number.parseInt(input.value, 10);

  if (!Number.isFinite(parsedValue)) {
    return 0;
  }

  return Math.max(0, parsedValue);
}

function getDefaultGrainToFeed(state: GameState): number {
  return Math.min(
    state.grain,
    state.population * defaultGameConfig.grainPerPersonToFeed,
  );
}

function getDefaultAcresToPlant(state: GameState): number {
  const grainReservedForFood = getDefaultGrainToFeed(state);
  const grainAvailableForPlanting = Math.max(0, state.grain - grainReservedForFood);

  return Math.min(
    state.acres,
    state.population * defaultGameConfig.acresPerPersonCanPlant,
    Math.floor(grainAvailableForPlanting / defaultGameConfig.grainPerAcreToPlant),
  );
}