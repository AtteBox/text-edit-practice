export function isMac() {
  return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
}

export function ctrlEquivalentPressed(
  event: KeyboardEvent | globalThis.KeyboardEvent,
) {
  return isMac() ? event.altKey : event.ctrlKey;
}

/**
 * Call this function to assert that the code should never be reached.
 * For instance, in a switch statement, if all cases are handled, the default case should never be reached
 * @param value
 */
export function assertNever(value: never): never {
  throw new Error(`Unhandled alternative: ${value}`);
}

/**
 * Get a color for a ratio where 0 is bad and 1 is good
 * @param ratio number between 0-1
 * @returns css color string
 */
export function getDangerColor(ratio: number): string {
  const red = 255 * Math.min(1, 2 * ratio);
  const green = 255 * Math.min(1, 2 - 2 * ratio);
  return `rgb(${red}, ${green}, 0)`;
}
