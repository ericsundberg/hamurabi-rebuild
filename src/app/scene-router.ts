import { replaceChildren } from '../ui/dom-helpers';

export type SceneName =
  | 'title'
  | 'game-setup'
  | 'load-game'
  | 'settings'
  | 'credits';

export type NavigateToScene = (sceneName: SceneName) => void;

export interface SceneContext {
  navigate: NavigateToScene;
}

export type SceneRenderer = (context: SceneContext) => HTMLElement;

export class SceneRouter {
  private readonly scenes = new Map<SceneName, SceneRenderer>();

  public constructor(private readonly rootElement: HTMLElement) {}

  public register(sceneName: SceneName, renderer: SceneRenderer): void {
    this.scenes.set(sceneName, renderer);
  }

  public navigate(sceneName: SceneName): void {
    const renderer = this.scenes.get(sceneName);

    if (!renderer) {
      throw new Error(`Scene is not registered: ${sceneName}`);
    }

    const sceneElement = renderer({
      navigate: (nextSceneName) => this.navigate(nextSceneName),
    });

    replaceChildren(this.rootElement, sceneElement);
    console.log(`[scene] ${sceneName}`);
  }
}