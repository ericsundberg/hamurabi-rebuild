import { describe, expect, it } from 'vitest';
import {
  defaultCharacterHealth,
  startingHeirCharacterId,
  startingRulerCharacterId,
} from './game-character';
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
    expect(session.getCharacters()).toEqual([]);
    expect(session.getCurrentRuler()).toBeNull();
    expect(session.getHeir()).toBeNull();
    expect(session.getRulerProfile()).toBeNull();
    expect(session.getRulerAge()).toBeNull();
    expect(session.getRulerHealth()).toBeNull();
    expect(session.getRulerReignYear()).toBeNull();
    expect(session.getGameStartYear()).toBe(1);
  });

  it('starts a new game with a normalized ruler and generated heir', () => {
    const session = createGameSession();

    session.startNewGame({
      givenName: '  Ashurbanipal  ',
      familyName: '  Sargonid  ',
      startingAge: 31,
      gender: 'man',
    });

    expect(session.hasActiveGame()).toBe(true);
    expect(session.getStatus()).toBe('active');
    expect(session.isGameOver()).toBe(false);
    expect(session.getState()?.playerName).toBe('Ashurbanipal Sargonid');
    expect(session.getCurrentRuler()).toEqual({
      id: startingRulerCharacterId,
      givenName: 'Ashurbanipal',
      familyName: 'Sargonid',
      startingAge: 31,
      gender: 'man',
      health: defaultCharacterHealth,
      isRuler: true,
      reignStartYear: 1,
    });
    expect(session.getHeir()).toEqual({
      id: startingHeirCharacterId,
      givenName: 'Heir',
      familyName: 'Sargonid',
      startingAge: 0,
      gender: 'unspecified',
      health: defaultCharacterHealth,
      isRuler: false,
      reignStartYear: null,
    });
    expect(session.getCharacters()).toHaveLength(2);
    expect(session.getRulerProfile()).toEqual({
      givenName: 'Ashurbanipal',
      familyName: 'Sargonid',
      startingAge: 31,
      gender: 'man',
    });
    expect(session.getRulerAge()).toBe(31);
    expect(session.getRulerHealth()).toBe(100);
    expect(session.getRulerReignYear()).toBe(1);
    expect(session.getAnnualReport()?.year).toBe(1);
  });

  it('keeps string startNewGame compatibility for simple callers', () => {
    const session = createGameSession();

    session.startNewGame('Tester');

    expect(session.hasActiveGame()).toBe(true);
    expect(session.getState()?.playerName).toBe('Tester House');
    expect(session.getRulerProfile()).toEqual({
      givenName: 'Tester',
      familyName: 'House',
      startingAge: 25,
      gender: 'unspecified',
    });
    expect(session.getCurrentRulerName()).toBe('Tester House');
    expect(session.getRulerAge()).toBe(25);
    expect(session.getRulerHealth()).toBe(100);
    expect(session.getRulerReignYear()).toBe(1);
  });

  it('creates a suggested opening turn command', () => {
    const session = createGameSession();

    session.startNewGame({
      givenName: 'Tester',
      familyName: 'House',
      startingAge: 25,
      gender: 'unspecified',
    });

    expect(session.getSuggestedTurnCommand()).toEqual({
      acresToBuy: 0,
      acresToSell: 0,
      grainToFeed: 2000,
      acresToPlant: 800,
    });
  });

  it('processes a turn and advances ruler age and reign year', () => {
    const session = createGameSession();

    session.startNewGame({
      givenName: 'Tester',
      familyName: 'House',
      startingAge: 25,
      gender: 'unspecified',
    });

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
    expect(session.getRulerAge()).toBe(26);
    expect(session.getRulerReignYear()).toBe(2);
  });

  it('does not trigger succession when ruler health is exactly zero', () => {
    const session = createGameSession();

    session.startNewGame({
      givenName: 'Tester',
      familyName: 'House',
      startingAge: 25,
      gender: 'unspecified',
    });

    session.damageCurrentRulerHealth(100);

    expect(session.getCurrentRuler()?.id).toBe(startingRulerCharacterId);
    expect(session.getCurrentRuler()?.health).toBe(0);
    expect(session.getHeir()?.id).toBe(startingHeirCharacterId);
  });

  it('transfers rulership to the heir when ruler health falls below zero', () => {
    const session = createGameSession();

    session.startNewGame({
      givenName: 'Ashurbanipal',
      familyName: 'Sargonid',
      startingAge: 31,
      gender: 'man',
    });

    session.processTurn({
      acresToBuy: 0,
      acresToSell: 0,
      grainToFeed: 2000,
      acresToPlant: 500,
    });

    session.damageCurrentRulerHealth(101);

    expect(session.getCurrentRuler()).toEqual({
      id: startingHeirCharacterId,
      givenName: 'Heir',
      familyName: 'Sargonid',
      startingAge: 0,
      gender: 'unspecified',
      health: 100,
      isRuler: true,
      reignStartYear: 2,
    });
    expect(session.getHeir()).toBeNull();
    expect(session.getRulerAge()).toBe(1);
    expect(session.getRulerHealth()).toBe(100);
    expect(session.getRulerReignYear()).toBe(1);
    expect(session.getCharacters()).toContainEqual({
      id: startingRulerCharacterId,
      givenName: 'Ashurbanipal',
      familyName: 'Sargonid',
      startingAge: 31,
      gender: 'man',
      health: -1,
      isRuler: false,
      reignStartYear: 1,
    });
  });

  it('ends the game when population reaches zero', () => {
    const session = createGameSession();

    session.startNewGame({
      givenName: 'Tester',
      familyName: 'House',
      startingAge: 25,
      gender: 'unspecified',
    });

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

    session.startNewGame({
      givenName: 'Tester',
      familyName: 'House',
      startingAge: 25,
      gender: 'unspecified',
    });

    session.processTurn({
      acresToBuy: 0,
      acresToSell: 0,
      grainToFeed: 0,
      acresToPlant: 0,
    });

    const stateAfterGameOver = session.getState();

    expect(
      session.processTurn({
        acresToBuy: 0,
        acresToSell: 0,
        grainToFeed: 0,
        acresToPlant: 0,
      }),
    ).toBeNull();

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