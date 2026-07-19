# Hamurabi Rebuild

A browser-first TypeScript rebuild inspired by the classic resource-management game **Hamurabi**.

This project begins as a headless simulation with an HTML/CSS/DOM interface layered on top. The simulation core should remain independent from the UI so mechanics, resources, rules, and gameplay loops can be changed safely.

## Version

Current version: `0.0.1-prealpha`

## Project Goals

- Rebuild a Hamurabi-style annual decision loop.
- Keep game logic separate from UI, rendering, and browser-specific APIs.
- Support a browser-based build first.
- Support a headless simulation mode for testing and scripted runs.
- Show headless updates and player commands in the browser console.
- Add save/load through downloadable and uploadable JSON save files.
- Keep files small, modular, lowercase, and kebab-case.
- Make mechanics, resources, systems, and turn structure easy to alter.

## Technology

- TypeScript for game logic and app scripting.
- HTML5 for the document shell.
- CSS for DOM-based UI.
- Vite for local development and browser builds.
- Vitest for future tests.

## Why TypeScript First?

TypeScript gives the project strong typing, browser-friendly tooling, and straightforward integration with HTML/CSS/DOM layers.

Lua may be useful later if the project needs moddable scripting, but it would add unnecessary browser runtime and interop complexity for the first version. The first milestone should therefore use TypeScript only.

## Development

Install dependencies:

```sh
npm install
```

Run the development server:

```sh
npm run dev
```

Build the browser app:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

Run tests:

```sh
npm test
```

## Architecture

The project should separate the simulation from the browser UI.

```text
src/
  main.ts
  version.ts

  core/
    command-parser.ts
    event-log.ts
    game-config.ts
    game-engine.ts
    game-state.ts
    rng.ts
    save-codec.ts
    turn-processor.ts
    types.ts

  headless/
    browser-console-runner.ts
    scripted-game-runner.ts

  app/
    app-controller.ts
    scene-router.ts

  scenes/
    title-scene.ts
    game-setup-scene.ts
    game-scene.ts
    load-game-scene.ts
    settings-scene.ts
    credits-scene.ts

  ui/
    dom-helpers.ts
    save-file-picker.ts
    ui-scale.ts

  styles/
    base.css
    layout.css
    scenes.css

  content/
    default-game-config.ts
    default-scripted-commands.ts

  tests/
    command-parser.test.ts
    game-engine.test.ts
    save-codec.test.ts
    turn-processor.test.ts
```

### Core Layer

`src/core/` should contain pure game logic. It should not import DOM, browser, rendering, or scene code.

This layer owns:

- game state,
- turn processing,
- command parsing,
- rules and balancing,
- random events,
- save serialization,
- validation.

### Headless Layer

`src/headless/` should run the game without the visual GUI.

For the browser build, this means a simulation runner that logs updates and accepted commands to the browser console. This lets us test the game loop before the interface is complete.

### App and Scene Layers

`src/app/` and `src/scenes/` should connect the core simulation to human-facing screens.

Initial scene flow:

```text
title-scene
  ├── new game
  │     └── game-setup-scene
  │             └── game-scene
  ├── load game
  │     └── load-game-scene
  │             └── game-scene
  ├── settings
  │     └── settings-scene
  ├── credits
  │     └── credits-scene
  └── quit game
        └── reload page in browser build
```

## Initial Menu Scope

The first menu/title screen should include:

1. New Game
2. Load Game
3. Settings
4. Credits
5. Quit Game

Initial behavior:

- **New Game** opens a game setup scene where the player enters a name.
- **Load Game** opens a browser file upload flow for a JSON save file.
- **Settings** allows font/UI scale increase and decrease.
- **Credits** displays a simple credits scene.
- **Quit Game** reloads the webpage in the browser build.

## Save System

The browser version should use downloadable JSON save files.

A save file should include at minimum:

```ts
{
  saveVersion: 1,
  gameVersion: "0.0.1-prealpha",
  savedAt: "2026-07-19T00:00:00.000Z",
  state: {}
}
```

The save codec should live in `src/core/save-codec.ts` so future desktop wrappers can reuse the same format.

## Versioning

Versioning is part of the project architecture.

Rules:

- `package.json` is the source of truth for the package version.
- `src/version.ts` exposes the current version to the game code.
- The title screen should display the current version.
- Save files should include the current game version.
- Every push that materially changes behavior should include a version bump.
- Git tags should use `v` prefixes, such as `v0.0.1-prealpha`.

Suggested early version sequence:

```text
0.0.1-prealpha  repo skeleton + README
0.0.2-prealpha  title screen shell
0.0.3-prealpha  headless simulation loop
0.0.4-prealpha  new game setup + basic turn processing
0.0.5-prealpha  save/load files
0.0.6-prealpha  settings + credits
```

## File and Directory Naming

Unless a framework requires a specific filename, files and directories should be:

- lowercase,
- kebab-case,
- logically named after what they do.

This avoids case-sensitivity problems on Linux and keeps the project easier to navigate.

## Current Milestone

`0.0.1-prealpha` establishes the project repository, README, TypeScript/Vite project metadata, and version source file.
