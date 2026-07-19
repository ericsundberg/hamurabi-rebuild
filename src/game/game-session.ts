import { GameEngine } from '../core/game-engine';
import type { GameConfig } from '../core/game-config';
import type {
  AnnualReport,
  GameState,
  TurnCommand,
  TurnOutcome,
} from '../core/types';
import { defaultGameConfig } from '../content/default-game-config';

export class GameSession {
  private engine: GameEngine | null = null;
  private lastOutcome: TurnOutcome | null = null;

  public constructor(private readonly config: GameConfig = defaultGameConfig) {}

  public startNewGame(playerName: string): void {
    const normalizedPlayerName = playerName.trim() || 'Player';

    this.engine = new GameEngine(this.config, normalizedPlayerName);
    this.lastOutcome = null;
  }

  public hasActiveGame(): boolean {
    return this.engine !== null;
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

  public processTurn(command: TurnCommand): TurnOutcome | null {
    if (!this.engine) {
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