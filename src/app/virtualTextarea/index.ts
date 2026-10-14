export type ITextareaState = {
  text: string;
  cursorPos: number;
  /**
   * Selection spans [min(selectionAnchor, cursorPos), max(selectionAnchor, cursorPos)).
   * null means no selection.
   */
  selectionAnchor: number | null;
  clipboard: string;
};

function isWordCharacter(char: string): boolean {
  return !/\s/.test(char);
}

function wordBoundaryLeft(characters: string[], pos: number): number {
  // Skip any non-word characters before the position
  while (pos > 0 && !isWordCharacter(characters[pos - 1])) {
    pos--;
  }

  // Skip word characters to the start of the word
  while (pos > 0 && isWordCharacter(characters[pos - 1])) {
    pos--;
  }

  return pos;
}

function wordBoundaryRight(characters: string[], pos: number): number {
  const len = characters.length;

  // Skip non-word characters (including line breaks)
  while (pos < len && !isWordCharacter(characters[pos])) {
    pos++;
  }

  // Skip word characters to the end of the next word
  while (pos < len && isWordCharacter(characters[pos])) {
    pos++;
  }

  return pos;
}

export function calcTextarea(
  state: ITextareaState,
  keyCombination: string[],
): ITextareaState {
  if (keyCombination.length === 0) {
    return state;
  }
  const baseKey = keyCombination[keyCombination.length - 1];
  const modifiers = keyCombination.slice(0, -1);
  if (
    modifiers.some((modifier) => modifier !== "ctrl" && modifier !== "shift")
  ) {
    return state;
  }
  const ctrl = modifiers.includes("ctrl");
  const shift = modifiers.includes("shift");

  // Convert text to an array of characters (code points, emoji-safe)
  const characters = Array.from(state.text);
  const len = characters.length;

  const selectionStart =
    state.selectionAnchor === null
      ? state.cursorPos
      : Math.min(state.selectionAnchor, state.cursorPos);
  const selectionEnd =
    state.selectionAnchor === null
      ? state.cursorPos
      : Math.max(state.selectionAnchor, state.cursorPos);
  const hasSelection = selectionStart < selectionEnd;

  function deleteSelection(): ITextareaState {
    const newCharacters = [...characters];
    newCharacters.splice(selectionStart, selectionEnd - selectionStart);
    return {
      ...state,
      text: newCharacters.join(""),
      cursorPos: selectionStart,
      selectionAnchor: null,
    };
  }

  if (baseKey === "ArrowLeft" || baseKey === "ArrowRight") {
    if (shift) {
      const anchor = state.selectionAnchor ?? state.cursorPos;
      const newCursorPos =
        baseKey === "ArrowLeft"
          ? ctrl
            ? wordBoundaryLeft(characters, state.cursorPos)
            : Math.max(0, state.cursorPos - 1)
          : ctrl
            ? wordBoundaryRight(characters, state.cursorPos)
            : Math.min(len, state.cursorPos + 1);
      return {
        ...state,
        cursorPos: newCursorPos,
        selectionAnchor: newCursorPos === anchor ? null : anchor,
      };
    }
    if (hasSelection && !ctrl) {
      // Plain arrows collapse the selection to its edge
      return {
        ...state,
        cursorPos: baseKey === "ArrowLeft" ? selectionStart : selectionEnd,
        selectionAnchor: null,
      };
    }
    const newCursorPos =
      baseKey === "ArrowLeft"
        ? ctrl
          ? wordBoundaryLeft(characters, state.cursorPos)
          : Math.max(0, state.cursorPos - 1)
        : ctrl
          ? wordBoundaryRight(characters, state.cursorPos)
          : Math.min(len, state.cursorPos + 1);
    return { ...state, cursorPos: newCursorPos, selectionAnchor: null };
  }

  if ((baseKey === "Backspace" || baseKey === "Delete") && !shift) {
    if (hasSelection) {
      return deleteSelection();
    }
    if (baseKey === "Backspace") {
      const deleteFrom = ctrl
        ? wordBoundaryLeft(characters, state.cursorPos)
        : Math.max(0, state.cursorPos - 1);
      const newCharacters = [...characters];
      newCharacters.splice(deleteFrom, state.cursorPos - deleteFrom);
      return {
        ...state,
        text: newCharacters.join(""),
        cursorPos: deleteFrom,
        selectionAnchor: null,
      };
    }
    const deleteTo = ctrl
      ? wordBoundaryRight(characters, state.cursorPos)
      : Math.min(len, state.cursorPos + 1);
    const newCharacters = [...characters];
    newCharacters.splice(state.cursorPos, deleteTo - state.cursorPos);
    return {
      ...state,
      text: newCharacters.join(""),
      selectionAnchor: null,
    };
  }

  if (ctrl && !shift && (baseKey === "x" || baseKey === "c" || baseKey === "v")) {
    if (baseKey === "v") {
      if (state.clipboard === "") {
        return state;
      }
      const clipboardCharacters = Array.from(state.clipboard);
      const newCharacters = [...characters];
      newCharacters.splice(
        selectionStart,
        selectionEnd - selectionStart,
        ...clipboardCharacters,
      );
      return {
        ...state,
        text: newCharacters.join(""),
        cursorPos: selectionStart + clipboardCharacters.length,
        selectionAnchor: null,
      };
    }
    if (!hasSelection) {
      return state;
    }
    const selectedText = characters.slice(selectionStart, selectionEnd).join("");
    if (baseKey === "c") {
      return { ...state, clipboard: selectedText };
    }
    return { ...deleteSelection(), clipboard: selectedText };
  }

  return state;
}
