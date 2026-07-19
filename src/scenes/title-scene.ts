import type { SceneContext } from '../app/scene-router';
import { makeButton, makeElement } from '../ui/dom-helpers';
import { game_version } from '../version';

export function renderTitleScene(context: SceneContext): HTMLElement {
  const scene = makeElement('section', {
    className: 'scene title-scene',
  });

  const panel = makeElement('div', {
    className: 'scene-panel title-panel',
  });

  const title = makeElement('h1', {
    className: 'game-title',
    textContent: 'Hamurabi Rebuild',
  });

  const version = makeElement('p', {
    className: 'game-version',
    textContent: `Version ${game_version}`,
  });

  const subtitle = makeElement('p', {
    className: 'scene-description',
    textContent: 'A browser-first resource-management experiment inspired by Hamurabi.',
  });

  const menu = makeElement('nav', {
    className: 'title-menu',
  });

  menu.setAttribute('aria-label', 'Main menu');

  menu.append(
    makeButton('New Game', () => context.navigate('game-setup')),
    makeButton('Load Game', () => context.navigate('load-game')),
    makeButton('Settings', () => context.navigate('settings')),
    makeButton('Credits', () => context.navigate('credits')),
    makeButton('Quit Game', () => {
      console.log('[ui] quit requested: reloading browser page');
      globalThis.location.reload();
    }),
  );

  panel.append(title, version, subtitle, menu);
  scene.append(panel);

  return scene;
}