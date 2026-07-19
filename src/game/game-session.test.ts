import { describe, expect, it } from 'vitest';
import { createGameSession } from './game-session';

describe('GameSession', () => {
  it('starts without an active game', () => {
    const session = createGameSession();

    expect(session.hasActiveGame()).toBe(false);
    expect(session.getState()).toBeNull();
    expect(session.getAnnualReport()).toBeNull();
    expect(session.getLastOutcome()).toBeNull();
  });

  it('starts a new game with a normalized player name', () => {
    const session = createGameSession();

    session.startNewGame('  Ada  ');

    expect(session.hasActiveGame()).toBe(true);
    expect(session.getState()?.playerName).toBe('Ada');
    expect(session.getAnnualReport()?.year).toBe(1);
  });

  it('processes a turn and stores the latest outcome', () => {
    const session = createGameSession();

    session.startNewGame('Tester');

    const outcome = session.processTurn({
      acresToBuy: 0,
      acresToSell: 0,
      grainToFeed: 2000,
      acresToPlant: 500,
    });

    expect(outcome?.nextState.year).toBe(2);
    expect(session.getState()?.year).toBe(2);
    expect(session.getLastOutcome()).toBe(outcome);
  });

  it('returns null when processing a turn before a game starts', () => {
    const session = createGameSession();

    expect(
      session.processTurn({
        acresToBuy: 0,
        acresToSell: 0,
        grainToFeed: 0,
        acresToPlant: 0,
      }),
    ).toBeNull();
  });
});