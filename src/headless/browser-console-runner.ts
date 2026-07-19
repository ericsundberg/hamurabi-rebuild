import { game_version } from '../version';

let hasStarted = false;

export function startBrowserConsoleRunner(): void {
  if (hasStarted) {
    return;
  }

  hasStarted = true;

  console.groupCollapsed('[headless] startup');
  console.log('[headless] starting browser console runner');
  console.log(`[headless] game version ${game_version}`);
  console.log('[headless] simulation core is not wired yet');
  console.log('[headless] command: boot');
  console.log('[headless] command: await-player-input');
  console.groupEnd();
}