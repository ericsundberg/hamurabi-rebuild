import { startBrowserConsoleRunner } from '../headless/browser-console-runner';
import { renderCreditsScene } from '../scenes/credits-scene';
import { renderGameSetupScene } from '../scenes/game-setup-scene';
import { renderLoadGameScene } from '../scenes/load-game-scene';
import { renderSettingsScene } from '../scenes/settings-scene';
import { renderTitleScene } from '../scenes/title-scene';
import { SceneRouter } from './scene-router';

export class AppController {
  private readonly router: SceneRouter;

  public constructor(rootElement: HTMLElement) {
    this.router = new SceneRouter(rootElement);
    this.registerScenes();
  }

  public start(): void {
    startBrowserConsoleRunner();
    this.router.navigate('title');
  }

  private registerScenes(): void {
    this.router.register('title', renderTitleScene);
    this.router.register('game-setup', renderGameSetupScene);
    this.router.register('load-game', renderLoadGameScene);
    this.router.register('settings', renderSettingsScene);
    this.router.register('credits', renderCreditsScene);
  }
}