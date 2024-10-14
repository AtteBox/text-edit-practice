export function calcTextarea(
  cursorPos: number,
  text: string,
  keyCombination: string[],
): { cursorPos: number; text: string } {
  // Convert text to an array of characters
  function isWordCharacter(char: string): boolean {
    return !/\s/.test(char);
  }

  const characters = Array.from(text);
  const len = characters.length;

  if (keyCombination.length === 1) {
    switch (keyCombination[0]) {
      case "ArrowLeft":
        return {
          cursorPos: Math.max(0, cursorPos - 1),
          text: text,
        };
      case "ArrowRight":
        return {
          cursorPos: Math.min(len, cursorPos + 1),
          text: text,
        };
      case "Backspace":
        if (cursorPos > 0) {
          const newCharacters = [...characters];
          newCharacters.splice(cursorPos - 1, 1);
          return {
            cursorPos: cursorPos - 1,
            text: newCharacters.join(""),
          };
        }
        break;
      case "Delete":
        if (cursorPos < len) {
          const newCharacters = [...characters];
          newCharacters.splice(cursorPos, 1);
          return {
            cursorPos,
            text: newCharacters.join(""),
          };
        }
        break;
      default:
        break;
    }
  }

  if (keyCombination.length === 2 && keyCombination[0] === "ctrl") {
    switch (keyCombination[1]) {
      case "ArrowLeft": {
        let pos = cursorPos;

        // Skip any non-word characters before the cursor
        while (pos > 0 && !isWordCharacter(characters[pos - 1])) {
          pos--;
        }

        // Skip word characters to the start of the word
        while (pos > 0 && isWordCharacter(characters[pos - 1])) {
          pos--;
        }

        return { cursorPos: pos, text: text };
      }
      case "ArrowRight": {
        let pos = cursorPos;
        const len = characters.length;

        // Skip non-word characters (including line breaks)
        while (pos < len && !isWordCharacter(characters[pos])) {
          pos++;
        }

        // Skip word characters to the end of the next word
        while (pos < len && isWordCharacter(characters[pos])) {
          pos++;
        }

        return { cursorPos: pos, text: text };
      }
      case "Backspace": {
        let pos = cursorPos;

        // Skip any non-word characters before the cursor
        while (pos > 0 && !isWordCharacter(characters[pos - 1])) {
          pos--;
        }

        // Skip word characters to the start of the word
        while (pos > 0 && isWordCharacter(characters[pos - 1])) {
          pos--;
        }

        const newCharacters = [...characters];
        newCharacters.splice(pos, cursorPos - pos);

        return {
          cursorPos: pos,
          text: newCharacters.join(""),
        };
      }
      case "Delete": {
        let pos = cursorPos;

        // Skip any non-word characters at or after the cursor
        while (pos < len && !isWordCharacter(characters[pos])) {
          pos++;
        }

        // Skip word characters to the end of the word
        while (pos < len && isWordCharacter(characters[pos])) {
          pos++;
        }

        const newCharacters = [...characters];
        newCharacters.splice(cursorPos, pos - cursorPos);

        return {
          cursorPos: cursorPos,
          text: newCharacters.join(""),
        };
      }
      default:
        break;
    }
  }

  return { cursorPos, text: text };
}
