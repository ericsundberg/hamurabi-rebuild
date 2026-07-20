import { GameEngine } from '../core/game-engine';
import type { GameConfig } from '../core/game-config';
import type {
  AnnualReport,
  GameState,
  TurnCommand,
  TurnOutcome,
} from '../core/types';
import { defaultGameConfig } from '../content/default-game-config';
import { text } from '../localization/localized-text';
import {
  gameStartYear,
  getCurrentAge,
  getRulerReignYear,
} from './game-calendar';
import {
  createStartingHeirCharacter,
  createStartingRulerCharacter,
  formatCharacterName,
  isCharacterDead,
  setCharacterRulership,
  startingHeirCharacterId,
  startingRulerCharacterId,
  toRulerProfile,
  updateCharacterHealth,
  type CharacterId,
  type GameCharacter,
} from './game-character';
import {
  getGameOverState,
  getGameStatus,
  type GameOverState,
  type GameStatus,
} from './game-status';
import {
  createRulerProfile,
  type RulerCreationInput,
  type RulerProfile,
} from './ruler-profile';
import { createDefaultTurnCommand } from './yearly-command-defaults';

export class GameSession {
  private engine: GameEngine | null = null;
  private lastOutcome: TurnOutcome | null = null;
  private characters: GameCharacter[] = [];
  private currentRulerCharacterId: CharacterId | null = null;
  private heirCharacterId: CharacterId | null = null;

  public constructor(private readonly config: GameConfig = defaultGameConfig) {}

  public startNewGame(input: Partial<RulerCreationInput> | string): void {
    const rulerProfile = typeof input === 'string'
      ? createRulerProfile({ givenName: input })
      : createRulerProfile(input);

    const ruler = createStartingRulerCharacter(rulerProfile, gameStartYear);
    const heir = createStartingHeirCharacter(
      text('characterDefaults.heirGivenName'),
      rulerProfile.familyName,
    );

    this.characters = [ruler, heir];
    this.currentRulerCharacterId = startingRulerCharacterId;
    this.heirCharacterId = startingHeirCharacterId;
    this.engine = new GameEngine(this.config, formatCharacterName(ruler));
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

  public getCharacters(): readonly GameCharacter[] {
    return this.characters;
  }

  public getCurrentRuler(): GameCharacter | null {
    if (!this.currentRulerCharacterId) {
      return null;
    }

    return this.characters.find(
      (character) => character.id === this.currentRulerCharacterId,
    ) ?? null;
  }

  public getHeir(): GameCharacter | null {
    if (!this.heirCharacterId) {
      return null;
    }

    return this.characters.find(
      (character) => character.id === this.heirCharacterId,
    ) ?? null;
  }

  public getCurrentRulerName(): string | null {
    const ruler = this.getCurrentRuler();

    if (!ruler) {
      return null;
    }

    return formatCharacterName(ruler);
  }

  public getRulerProfile(): RulerProfile | null {
    const ruler = this.getCurrentRuler();

    if (!ruler) {
      return null;
    }

    return toRulerProfile(ruler);
  }

  public getRulerAge(): number | null {
    const state = this.getState();
    const ruler = this.getCurrentRuler();

    if (!state || !ruler) {
      return null;
    }

    return getCurrentAge(ruler, state);
  }

  public getRulerHealth(): number | null {
    return this.getCurrentRuler()?.health ?? null;
  }

  public getRulerReignYear(): number | null {
    const state = this.getState();
    const ruler = this.getCurrentRuler();

    if (!state || !ruler) {
      return null;
    }

    return getRulerReignYear(ruler, state);
  }

  public getGameStartYear(): number {
    return gameStartYear;
  }

  public damageCurrentRulerHealth(amount: number): GameCharacter | null {
    const ruler = this.getCurrentRuler();

    if (!ruler) {
      return null;
    }

    const normalizedAmount = Number.isFinite(amount)
      ? Math.max(0, Math.floor(amount))
      : 0;

    this.characters = this.characters.map((character) => {
      if (character.id !== ruler.id) {
        return character;
      }

      return updateCharacterHealth(character, character.health - normalizedAmount);
    });

    this.resolveRulerSuccession();

    return this.getCurrentRuler();
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

  private resolveRulerSuccession(): void {
    const ruler = this.getCurrentRuler();

    if (!ruler || !isCharacterDead(ruler)) {
      return;
    }

    const heir = this.getHeir();

    if (!heir) {
      return;
    }

    const state = this.getState();
    const reignStartYear = state?.year ?? gameStartYear;

    this.characters = this.characters.map((character) => {
      if (character.id === ruler.id) {
        return {
          ...character,
          isRuler: false,
        };
      }

      if (character.id === heir.id) {
        return setCharacterRulership(character, true, reignStartYear);
      }

      return character;
    });

    this.currentRulerCharacterId = heir.id;
    this.heirCharacterId = null;
  }
}

export function createGameSession(): GameSession {
  return new GameSession();
}