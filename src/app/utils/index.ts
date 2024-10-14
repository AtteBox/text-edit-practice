export function isMac() {
  return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
}

export function ctrlEquivalentPressed(
  event: KeyboardEvent | globalThis.KeyboardEvent
) {
  return isMac() ? event.altKey : event.ctrlKey;
}

/**
 * Call this function to assert that the code should never be reached.
 * For instance, in a switch statement, if all cases are handled, the default case should never be reached
 * @param cursorStartPos 
 */
export function assertNever(cursorStartPos: never): never {
  throw new Error(`Unexpected cursor position: ${cursorStartPos}`);
}
