# Hamurabi Rebuild

A browser-first TypeScript rebuild inspired by the classic Hamurabi resource-management game.

The project is designed to support both a visual browser UI and a headless simulation path. Early development is focused on a modular gameplay core, browser-playable yearly turn flow, audio services, localization-ready UI text, and expandable ruler/session systems.

## Project status

This is an early prealpha project.

The current runtime version is intentionally not hardcoded in this README. Use `package.json`, `src/version.ts`, and Git tags as the source of truth.

## Implemented features

- Browser title/menu flow
- New game / ruler creation flow
- Ruler profile fields:
  - given name
  - family name
  - starting age
  - gender
- Yearly court screen
- Annual report display
- Recent events display
- Yearly command form:
  - acres to buy
  - acres to sell
  - grain to feed
  - acres to plant
- Suggested yearly command defaults
- Turn processing through a shared game engine
- Terminal game-over state when population collapses
- Game-over panel with final report and final events
- Headless scripted simulation runner
- Browser audio services:
  - music manager
  - SFX manager
  - browser audio unlocker
  - button click SFX
  - cancel/back SFX
- Localization-ready text architecture for new UI text

## Architecture principles

### Modular gameplay core

Game mechanics should live outside scene files whenever possible.

Core simulation logic belongs under:

```text
src/core/
src/game/