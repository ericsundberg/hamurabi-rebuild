import { GameEngine } from '../core/game-engine';
import type { GameConfig } from '../core/game-config';
import type {
  AnnualReport,
  GameState,
  TurnCommand,
  TurnOutcome,
} from '../core/types';
import { defaultGameConfig } from '../content/default-game-config';
import { gameStartYear, getCurrentRulerAge } from './game-calendar';
import {
  getGameOverState,
  getGameStatus,
  type GameOverState,
  type GameStatus,
} from './game-status';
import {
  createRulerProfile,
  formatRulerName,
  type RulerCreationInput,
  type RulerProfile,
} from './ruler-profile';
import { createDefaultTurnCommand } from './yearly-command-defaults';

export class GameSession {
  private engine: GameEngine | null = null;
  private lastOutcome: TurnOutcome | null = null;
  private rulerProfile: RulerProfile | null = null;

  public constructor(private readonly config: GameConfig = defaultGameConfig) {}

  public startNewGame(input: Partial<RulerCreationInput> | string): void {
    const rulerProfile = typeof input === 'string'
      ? createRulerProfile({ givenName: input })
      : createRulerProfile(input);

    this.rulerProfile = rulerProfile;
    this.engine = new GameEngine(this.config, formatRulerName(rulerProfile));
    this.lastOutcome = null;
  }

  public hasActiveGame(): boolean {
    return this.engine !== null;
  }

  public getStatus(): GameStatus {
    return getGameStatus(this.getState());
  }

  public isGameOver(): boolean {
    return this.getStatus() === 'ended';
  }

  public getGameOverState(): GameOverState | null {
    return getGameOverState(this.getState());
  }

  public getState(): GameState | null {
    return this.engine?.getState() ?? null;
  }

  public getAnnualReport(): AnnualReport | null {
    return this.engine?.getAnnualReport() ?? null;
  }

  public getLastOutcome(): TurnOutcome | null {
    return this.lastOutcome;
  }

  public getRulerProfile(): RulerProfile | null {
    return this.rulerProfile;
  }

  public getRulerAge(): number | null {
    const state = this.getState();

    if (!state || !this.rulerProfile) {
      return null;
    }

    return getCurrentRulerAge(this.rulerProfile, state);
  }

  public getGameStartYear(): number {
    return gameStartYear;
  }

  public getSuggestedTurnCommand(): TurnCommand | null {
    const state = this.getState();

    if (!state || this.isGameOver()) {
      return null;
    }

    return createDefaultTurnCommand(state, this.config);
  }

  public processTurn(command: TurnCommand): TurnOutcome | null {
    if (!this.engine || this.isGameOver()) {
      return null;
    }

    const outcome = this.engine.processTurn(command);

    this.lastOutcome = outcome;

    return outcome;
  }
}

export function createGameSession(): GameSession {
  return new GameSession();
}