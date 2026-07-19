import type { SceneContext } from '../app/scene-router';
import { makeButton, makeElement } from '../ui/dom-helpers';

export function renderCreditsScene(context: SceneContext): HTMLElement {
  const scene = makeElement('section', {
    className: 'scene',
  });

  const panel = makeElement('div', {
    className: 'scene-panel',
  });

  const title = makeElement('h1', {
    textContent: 'Credits',
  });

  const description = makeElement('p', {
    className: 'scene-description',
    textContent:
      'Hamurabi Rebuild is a modern TypeScript experiment inspired by the classic Hamurabi resource-management game.',
  });

  panel.append(
    title,
    description,
    makeButton('Back', () => context.navigate('title'), 'secondary-button'),
  );

  scene.append(panel);

  return scene;
}