import { game_version } from './version';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Missing #app root element.');
}

app.innerHTML = `
  <section>
    <h1>Hamurabi Rebuild</h1>
    <p>Version ${game_version}</p>
    <p>Project shell initialized. Title screen and headless runner come next.</p>
  </section>
`;

console.log('[headless] project shell initialized');
console.log(`[headless] game version ${game_version}`);
