export function makeElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options: {
    className?: string;
    textContent?: string;
  } = {},
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);

  if (options.className) {
    element.className = options.className;
  }

  if (options.textContent) {
    element.textContent = options.textContent;
  }

  return element;
}

export function makeButton(
  label: string,
  onClick: () => void,
  className = 'menu-button',
): HTMLButtonElement {
  const button = document.createElement('button');

  button.type = 'button';
  button.className = className;
  button.textContent = label;
  button.addEventListener('click', onClick);

  return button;
}

export function replaceChildren(
  parentElement: HTMLElement,
  childElement: HTMLElement,
): void {
  parentElement.replaceChildren(childElement);
}