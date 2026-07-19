import type { SceneContext } from '../app/scene-router';
import { makeButton, makeElement } from '../ui/dom-helpers';

export function renderGameSetupScene(context: SceneContext): HTMLElement {
  const scene = makeElement('section', {
    className: 'scene',
  });

  const panel = makeElement('div', {
    className: 'scene-panel',
  });

  const title = makeElement('h1', {
    textContent: 'New Game',
  });

  const description = makeElement('p', {
    className: 'scene-description',
    textContent: 'Enter a player name. The full game setup flow will be expanded later.',
  });

  const form = makeElement('form', {
    className: 'menu-form',
  });

  const label = makeElement('label', {
    textContent: 'Player name',
  });

  const input = document.createElement('input');

  input.name = 'player-name';
  input.placeholder = 'Player';
  input.autocomplete = 'off';

  const startButton = document.createElement('button');

  startButton.type = 'submit';
  startButton.className = 'menu-button';
  startButton.textContent = 'Start Game';

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const playerName = input.value.trim() || 'Player';

    console.log(`[ui] new game requested for player: ${playerName}`);
    console.log('[headless] command: new-game');
    console.log('[headless] game scene is not wired yet');
  });

  label.append(input);
  form.append(label, startButton);

  panel.append(
    title,
    description,
    form,
    makeButton('Back', () => context.navigate('title'), 'secondary-button'),
  );

  scene.append(panel);

  return scene;
}