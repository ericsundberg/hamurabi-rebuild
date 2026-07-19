import type { SceneContext } from '../app/scene-router';
import type { RulerGender } from '../game/ruler-profile';
import { text } from '../localization/localized-text';
import { makeButton, makeElement } from '../ui/dom-helpers';

export function renderGameSetupScene(context: SceneContext): HTMLElement {
  const scene = makeElement('section', {
    className: 'scene',
  });

  const panel = makeElement('div', {
    className: 'scene-panel',
  });

  const title = makeElement('h1', {
    textContent: text('gameSetup.title'),
  });

  const description = makeElement('p', {
    className: 'scene-description',
    textContent: text('gameSetup.description'),
  });

  const startYearNote = makeElement('p', {
    className: 'scene-description',
    textContent: text('gameSetup.startYearNote'),
  });

  const form = makeElement('form', {
    className: 'menu-form',
  });

  const givenNameInput = makeTextInput(
    'given-name',
    text('gameSetup.givenNamePlaceholder'),
  );
  const familyNameInput = makeTextInput(
    'family-name',
    text('gameSetup.familyNamePlaceholder'),
  );
  const startingAgeInput = makeAgeInput();
  const genderSelect = makeGenderSelect();

  const startButton = document.createElement('button');

  startButton.type = 'submit';
  startButton.className = 'menu-button';
  startButton.textContent = text('gameSetup.startGameButton');

  form.append(
    makeInputLabel(text('gameSetup.givenNameLabel'), givenNameInput),
    makeInputLabel(text('gameSetup.familyNameLabel'), familyNameInput),
    makeInputLabel(text('gameSetup.startingAgeLabel'), startingAgeInput),
    makeInputLabel(text('gameSetup.genderLabel'), genderSelect),
    startButton,
  );

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    context.audio.sfx.play('button-click');

    context.game.startNewGame({
      givenName: givenNameInput.value,
      familyName: familyNameInput.value,
      startingAge: Number.parseInt(startingAgeInput.value, 10),
      gender: genderSelect.value as RulerGender,
    });

    const rulerProfile = context.game.getRulerProfile();

    console.log(
      `[ui] new game started for ruler: ${rulerProfile?.givenName} ${rulerProfile?.familyName}`,
    );

    context.navigate('yearly-turn');
  });

  panel.append(
    title,
    description,
    startYearNote,
    form,
    makeButton(text('gameSetup.backButton'), () => context.navigate('title'), 'secondary-button', {
      onBeforeClick: () => context.audio.sfx.play('button-cancel'),
    }),
  );

  scene.append(panel);

  return scene;
}

function makeTextInput(
  name: string,
  placeholder: string,
): HTMLInputElement {
  const input = document.createElement('input');

  input.name = name;
  input.placeholder = placeholder;
  input.autocomplete = 'off';

  return input;
}

function makeAgeInput(): HTMLInputElement {
  const input = document.createElement('input');

  input.name = 'starting-age';
  input.type = 'number';
  input.min = '1';
  input.max = '99';
  input.step = '1';
  input.value = '25';

  return input;
}

function makeGenderSelect(): HTMLSelectElement {
  const select = document.createElement('select');

  appendGenderOption(select, 'unspecified', text('gameSetup.genderUnspecified'));
  appendGenderOption(select, 'woman', text('gameSetup.genderWoman'));
  appendGenderOption(select, 'man', text('gameSetup.genderMan'));
  appendGenderOption(select, 'nonbinary', text('gameSetup.genderNonbinary'));

  return select;
}

function appendGenderOption(
  select: HTMLSelectElement,
  value: RulerGender,
  label: string,
): void {
  const option = document.createElement('option');

  option.value = value;
  option.textContent = label;

  select.append(option);
}

function makeInputLabel(
  labelText: string,
  input: HTMLInputElement | HTMLSelectElement,
): HTMLLabelElement {
  const label = makeElement('label', {
    textContent: labelText,
  });

  label.append(input);

  return label;
}