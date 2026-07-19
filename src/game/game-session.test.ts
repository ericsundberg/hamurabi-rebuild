import { describe, expect, it } from 'vitest';
import { createGameSession } from './game-session';

describe('GameSession', () => {
  it('starts without an active game', () => {
    const session = createGameSession();

    expect(session.hasActiveGame()).toBe(false);
    expect(session.getStatus()).toBe('not-started');
    expect(session.isGameOver()).toBe(false);
    expect(session.getGameOverState()).toBeNull();
    expect(session.getState()).toBeNull();
    expect(session.getAnnualReport()).toBeNull();
    expect(session.getLastOutcome()).toBeNull();
    expect(session.getSuggestedTurnCommand()).toBeNull();
  });

  it('starts a new game with a normalized player name', () => {
    const session = createGameSession();

    session.startNewGame('  Ada  ');

    expect(session.hasActiveGame()).toBe(true);
    expect(session.getStatus()).toBe('active');
    expect(session.isGameOver()).toBe(false);
    expect(session.getState()?.playerName).toBe('Ada');
    expect(session.getAnnualReport()?.year).toBe(1);
  });

  it('creates a suggested opening turn command', () => {
    const session = createGameSession();

    session.startNewGame('Tester');

    expect(session.getSuggestedTurnCommand()).toEqual({
      acresToBuy: 0,
      acresToSell: 0,
      grainToFeed: 2000,
      acresToPlant: 800,
    });
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
    expect(session.getStatus()).toBe('active');
  });

  it('ends the game when population reaches zero', () => {
    const session = createGameSession();

    session.startNewGame('Tester');

    const outcome = session.processTurn({
      acresToBuy: 0,
      acresToSell: 0,
      grainToFeed: 0,
      acresToPlant: 0,
    });

    expect(outcome?.nextState.population).toBe(0);
    expect(session.getStatus()).toBe('ended');
    expect(session.isGameOver()).toBe(true);
    expect(session.getGameOverState()).toEqual({
      reason: 'population-collapse',
      title: 'Dynasty Collapsed',
      message: 'There are no people left to rule. Your reign has ended.',
    });
    expect(session.getSuggestedTurnCommand()).toBeNull();
  });

  it('does not process additional turns after the game ends', () => {
    const session = createGameSession();

    session.startNewGame('Tester');

    session.processTurn({
      acresToBuy: 0,
      acresToSell: 0,
      grainToFeed: 0,
      acresToPlant: 0,
    });

    const stateAfterGameOver = session.getState();

    expect(session.processTurn({
      acresToBuy: 0,
      acresToSell: 0,
      grainToFeed: 0,
      acresToPlant: 0,
    })).toBeNull();

    expect(session.getState()).toEqual(stateAfterGameOver);
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