import { describe, it, expect } from "vitest";
import { calcTextarea, ITextareaState } from ".";

function aState(
  cursorPos: number,
  text: string,
  overrides: Partial<ITextareaState> = {},
): ITextareaState {
  return { text, cursorPos, selectionAnchor: null, clipboard: "", ...overrides };
}

describe("calcTextarea", () => {
  describe("Single key operations", () => {
    it("moves cursor one position left when ArrowLeft is pressed", () => {
      const result = calcTextarea(aState(5, "Hello World"), ["ArrowLeft"]);
      expect(result).toEqual(aState(4, "Hello World"));
    });

    it("does not move cursor left when at position 0", () => {
      const result = calcTextarea(aState(0, "Hello World"), ["ArrowLeft"]);
      expect(result).toEqual(aState(0, "Hello World"));
    });

    it("moves cursor one position right when ArrowRight is pressed", () => {
      const result = calcTextarea(aState(5, "Hello World"), ["ArrowRight"]);
      expect(result).toEqual(aState(6, "Hello World"));
    });

    it("does not move cursor right when at end of text", () => {
      const text = "Hello World";
      const result = calcTextarea(aState(text.length, text), ["ArrowRight"]);
      expect(result).toEqual(aState(text.length, text));
    });

    it("deletes character before cursor when Backspace is pressed", () => {
      const result = calcTextarea(aState(6, "Hello World"), ["Backspace"]);
      expect(result).toEqual(aState(5, "HelloWorld"));
    });

    it("does not delete character when cursor is at position 0 and Backspace is pressed", () => {
      const result = calcTextarea(aState(0, "Hello World"), ["Backspace"]);
      expect(result).toEqual(aState(0, "Hello World"));
    });

    it("deletes character at cursor when Delete is pressed", () => {
      const result = calcTextarea(aState(5, "Hello World"), ["Delete"]);
      expect(result).toEqual(aState(5, "HelloWorld"));
    });

    it("does not delete character when cursor is at end of text and Delete is pressed", () => {
      const text = "Hello World";
      const result = calcTextarea(aState(text.length, text), ["Delete"]);
      expect(result).toEqual(aState(text.length, text));
    });

    it("returns original state when key is not handled", () => {
      const result = calcTextarea(aState(5, "Hello World"), ["A"]);
      expect(result).toEqual(aState(5, "Hello World"));
    });
  });

  describe("Ctrl key combinations", () => {
    it("moves cursor to start of previous word when ctrl+ArrowLeft is pressed from middle", () => {
      const result = calcTextarea(aState(6, "Hello World"), [
        "ctrl",
        "ArrowLeft",
      ]);
      expect(result).toEqual(aState(0, "Hello World"));
    });

    it("moves cursor to start of previous word when ctrl+ArrowLeft is pressed from end", () => {
      const result = calcTextarea(aState(11, "Hello World"), [
        "ctrl",
        "ArrowLeft",
      ]);
      expect(result).toEqual(aState(6, "Hello World"));
    });

    it("moves cursor to start of next word when ctrl+ArrowRight is pressed", () => {
      const result = calcTextarea(aState(0, "Hello World"), [
        "ctrl",
        "ArrowRight",
      ]);
      expect(result).toEqual(aState(5, "Hello World"));
    });

    it("moves cursor to end of text when ctrl+ArrowRight is pressed and no next word", () => {
      const result = calcTextarea(aState(6, "Hello World"), [
        "ctrl",
        "ArrowRight",
      ]);
      expect(result).toEqual(aState(11, "Hello World"));
    });

    it("deletes next word when ctrl+Delete is pressed from start", () => {
      const result = calcTextarea(aState(0, "Hello World"), ["ctrl", "Delete"]);
      expect(result).toEqual(aState(0, " World"));
    });

    it("deletes to end of text when ctrl+Delete is pressed and no next word", () => {
      const result = calcTextarea(aState(6, "Hello World"), ["ctrl", "Delete"]);
      expect(result).toEqual(aState(6, "Hello "));
    });

    it("deletes previous word when ctrl+Backspace is pressed from middle", () => {
      const result = calcTextarea(aState(6, "Hello World"), [
        "ctrl",
        "Backspace",
      ]);
      expect(result).toEqual(aState(0, "World"));
    });

    it("deletes previous word when ctrl+Backspace is pressed from end", () => {
      const result = calcTextarea(aState(11, "Hello World"), [
        "ctrl",
        "Backspace",
      ]);
      expect(result).toEqual(aState(6, "Hello "));
    });

    it("does not delete anything when cursor is at start and ctrl+Backspace is pressed", () => {
      const result = calcTextarea(aState(0, "Hello World"), [
        "ctrl",
        "Backspace",
      ]);
      expect(result).toEqual(aState(0, "Hello World"));
    });

    it("returns original state when ctrl+unhandled key is pressed", () => {
      const result = calcTextarea(aState(5, "Hello World"), ["ctrl", "A"]);
      expect(result).toEqual(aState(5, "Hello World"));
    });
    it("emojis in words", () => {
      const text = "🕷🕷 🐍🐊";
      const result = calcTextarea(aState(5, text), ["ctrl", "Backspace"]);
      expect(result).toEqual(aState(3, "🕷🕷 "));
    });
    it("Arrow right with control should move from empty space to the end of the next word", () => {
      const text = "a b c";
      const result = calcTextarea(aState(1, text), ["ctrl", "ArrowRight"]);
      expect(result).toEqual(aState(3, "a b c"));
    });
    it("Backspace with control in the middle of the text should delete the previous word", () => {
      const text = "adf sdlfj ldsjfq sdfsd";
      const result = calcTextarea(aState(16, text), ["ctrl", "Backspace"]);
      expect(result).toEqual(aState(10, "adf sdlfj  sdfsd"));
    });
  });

  describe("Invalid key combinations", () => {
    it("returns original state when modifier is not recognized", () => {
      const result = calcTextarea(aState(5, "Hello World"), ["Shift", "A"]);
      expect(result).toEqual(aState(5, "Hello World"));
    });

    it("returns original state when keyCombination is empty", () => {
      const result = calcTextarea(aState(5, "Hello World"), []);
      expect(result).toEqual(aState(5, "Hello World"));
    });
  });

  describe("Shift selection", () => {
    it("starts a selection with shift+ArrowLeft", () => {
      const result = calcTextarea(aState(5, "Hello World"), [
        "shift",
        "ArrowLeft",
      ]);
      expect(result).toEqual(aState(4, "Hello World", { selectionAnchor: 5 }));
    });

    it("extends a selection with shift+ArrowRight", () => {
      const result = calcTextarea(
        aState(4, "Hello World", { selectionAnchor: 2 }),
        ["shift", "ArrowRight"],
      );
      expect(result).toEqual(aState(5, "Hello World", { selectionAnchor: 2 }));
    });

    it("clamps shift+ArrowLeft selection at position 0", () => {
      const result = calcTextarea(
        aState(0, "Hello World", { selectionAnchor: 2 }),
        ["shift", "ArrowLeft"],
      );
      expect(result).toEqual(aState(0, "Hello World", { selectionAnchor: 2 }));
    });

    it("clamps shift+ArrowRight selection at end of text", () => {
      const result = calcTextarea(
        aState(11, "Hello World", { selectionAnchor: 6 }),
        ["shift", "ArrowRight"],
      );
      expect(result).toEqual(aState(11, "Hello World", { selectionAnchor: 6 }));
    });

    it("selects the previous word with ctrl+shift+ArrowLeft", () => {
      const result = calcTextarea(aState(11, "Hello World"), [
        "ctrl",
        "shift",
        "ArrowLeft",
      ]);
      expect(result).toEqual(aState(6, "Hello World", { selectionAnchor: 11 }));
    });

    it("selects the next word with ctrl+shift+ArrowRight", () => {
      const result = calcTextarea(aState(0, "Hello World"), [
        "ctrl",
        "shift",
        "ArrowRight",
      ]);
      expect(result).toEqual(aState(5, "Hello World", { selectionAnchor: 0 }));
    });

    it("clears the selection when shift movement returns to the anchor", () => {
      const result = calcTextarea(
        aState(4, "Hello World", { selectionAnchor: 5 }),
        ["shift", "ArrowRight"],
      );
      expect(result).toEqual(aState(5, "Hello World"));
    });

    it("collapses selection to its start with plain ArrowLeft", () => {
      const result = calcTextarea(
        aState(8, "Hello World", { selectionAnchor: 3 }),
        ["ArrowLeft"],
      );
      expect(result).toEqual(aState(3, "Hello World"));
    });

    it("collapses selection to its end with plain ArrowRight", () => {
      const result = calcTextarea(
        aState(3, "Hello World", { selectionAnchor: 8 }),
        ["ArrowRight"],
      );
      expect(result).toEqual(aState(8, "Hello World"));
    });

    it("clears selection and word-moves with ctrl+ArrowLeft", () => {
      const result = calcTextarea(
        aState(8, "Hello World", { selectionAnchor: 11 }),
        ["ctrl", "ArrowLeft"],
      );
      expect(result).toEqual(aState(6, "Hello World"));
    });
  });

  describe("Deleting with a selection", () => {
    it("deletes the selected range with Backspace", () => {
      const result = calcTextarea(
        aState(8, "Hello World", { selectionAnchor: 3 }),
        ["Backspace"],
      );
      expect(result).toEqual(aState(3, "Helrld"));
    });

    it("deletes the selected range with Delete", () => {
      const result = calcTextarea(
        aState(3, "Hello World", { selectionAnchor: 8 }),
        ["Delete"],
      );
      expect(result).toEqual(aState(3, "Helrld"));
    });

    it("deletes only the selected range with ctrl+Backspace", () => {
      const result = calcTextarea(
        aState(8, "Hello World", { selectionAnchor: 6 }),
        ["ctrl", "Backspace"],
      );
      expect(result).toEqual(aState(6, "Hello rld"));
    });
  });

  describe("Clipboard operations", () => {
    it("cuts the selection to the clipboard with ctrl+x", () => {
      const result = calcTextarea(
        aState(11, "Hello World", { selectionAnchor: 5 }),
        ["ctrl", "x"],
      );
      expect(result).toEqual(aState(5, "Hello", { clipboard: " World" }));
    });

    it("does nothing on ctrl+x without a selection", () => {
      const result = calcTextarea(aState(5, "Hello World"), ["ctrl", "x"]);
      expect(result).toEqual(aState(5, "Hello World"));
    });

    it("overwrites the previous clipboard content on ctrl+x", () => {
      const result = calcTextarea(
        aState(5, "Hello World", { selectionAnchor: 0, clipboard: "old" }),
        ["ctrl", "x"],
      );
      expect(result).toEqual(aState(0, " World", { clipboard: "Hello" }));
    });

    it("copies the selection with ctrl+c and keeps the selection", () => {
      const result = calcTextarea(
        aState(5, "Hello World", { selectionAnchor: 0 }),
        ["ctrl", "c"],
      );
      expect(result).toEqual(
        aState(5, "Hello World", { selectionAnchor: 0, clipboard: "Hello" }),
      );
    });

    it("does nothing on ctrl+c without a selection", () => {
      const result = calcTextarea(aState(5, "Hello World"), ["ctrl", "c"]);
      expect(result).toEqual(aState(5, "Hello World"));
    });

    it("pastes the clipboard at the cursor with ctrl+v", () => {
      const result = calcTextarea(
        aState(5, "Hello World", { clipboard: " there" }),
        ["ctrl", "v"],
      );
      expect(result).toEqual(
        aState(11, "Hello there World", { clipboard: " there" }),
      );
    });

    it("replaces the selection with the clipboard on ctrl+v", () => {
      const result = calcTextarea(
        aState(11, "Hello World", { selectionAnchor: 6, clipboard: "you" }),
        ["ctrl", "v"],
      );
      expect(result).toEqual(aState(9, "Hello you", { clipboard: "you" }));
    });

    it("does nothing on ctrl+v with an empty clipboard", () => {
      const result = calcTextarea(aState(5, "Hello World"), ["ctrl", "v"]);
      expect(result).toEqual(aState(5, "Hello World"));
    });

    it("cuts and pastes emoji words losslessly", () => {
      // "🐶 🐱 🐭" as code points: 🐶=0, space=1, 🐱=2, space=3, 🐭=4
      let state = aState(5, "🐶 🐱 🐭");
      state = calcTextarea(state, ["shift", "ArrowLeft"]);
      state = calcTextarea(state, ["shift", "ArrowLeft"]);
      state = calcTextarea(state, ["ctrl", "x"]);
      expect(state).toEqual(aState(3, "🐶 🐱", { clipboard: " 🐭" }));
      state = calcTextarea(state, ["ctrl", "ArrowLeft"]);
      state = calcTextarea(state, ["ArrowLeft"]);
      state = calcTextarea(state, ["ctrl", "v"]);
      expect(state).toEqual(aState(3, "🐶 🐭 🐱", { clipboard: " 🐭" }));
    });
  });

  describe("Line Breaks Handling", () => {
    const multiLineText = "Hello\nWorld\nThis is a test";

    describe("Single key operations with line breaks", () => {
      it("moves cursor across lines with ArrowLeft", () => {
        // Cursor at the start of 'World'
        const result = calcTextarea(aState(6, multiLineText), ["ArrowLeft"]);
        expect(result).toEqual(aState(5, multiLineText));
      });

      it("moves cursor across lines with ArrowRight", () => {
        // Cursor at the end of 'Hello'
        const result = calcTextarea(aState(5, multiLineText), ["ArrowRight"]);
        expect(result).toEqual(aState(6, multiLineText));
      });

      it("deletes newline character with Backspace", () => {
        // Cursor at the start of 'World'
        const result = calcTextarea(aState(6, multiLineText), ["Backspace"]);
        expect(result).toEqual(aState(5, "HelloWorld\nThis is a test"));
      });

      it("deletes newline character with Delete", () => {
        // Cursor at the end of 'Hello'
        const result = calcTextarea(aState(5, multiLineText), ["Delete"]);
        expect(result).toEqual(aState(5, "HelloWorld\nThis is a test"));
      });
    });

    describe("Ctrl key combinations with line breaks", () => {
      it("moves cursor to start of previous word across lines with ctrl+ArrowLeft", () => {
        // Cursor at the start of 'This'
        const result = calcTextarea(aState(12, multiLineText), [
          "ctrl",
          "ArrowLeft",
        ]);
        expect(result).toEqual(aState(6, multiLineText));
      });

      it("moves cursor to end of next word across lines with ctrl+ArrowRight", () => {
        // Cursor at the end of 'World'
        const result = calcTextarea(aState(11, multiLineText), [
          "ctrl",
          "ArrowRight",
        ]);
        expect(result).toEqual(aState(16, multiLineText));
      });
      it("deletes next word across lines with ctrl+Delete", () => {
        // Cursor at the end of 'Hello'
        const result = calcTextarea(aState(5, multiLineText), [
          "ctrl",
          "Delete",
        ]);
        expect(result).toEqual(aState(5, "Hello\nThis is a test"));
      });

      it("deletes previous word across lines with ctrl+Backspace", () => {
        // Cursor at the start of 'This'
        const result = calcTextarea(aState(12, multiLineText), [
          "ctrl",
          "Backspace",
        ]);
        expect(result).toEqual(aState(6, "Hello\nThis is a test"));
      });
    });

    describe("Edge cases with line breaks", () => {
      it("does not move cursor left when at position 0 in multi-line text", () => {
        const result = calcTextarea(aState(0, multiLineText), ["ArrowLeft"]);
        expect(result).toEqual(aState(0, multiLineText));
      });

      it("does not move cursor right when at end of multi-line text", () => {
        const result = calcTextarea(aState(multiLineText.length, multiLineText), [
          "ArrowRight",
        ]);
        expect(result).toEqual(aState(multiLineText.length, multiLineText));
      });

      it("deletes character before cursor at start of line with Backspace", () => {
        // Cursor at the start of 'World' on second line
        const result = calcTextarea(aState(6, multiLineText), ["Backspace"]);
        expect(result).toEqual(aState(5, "HelloWorld\nThis is a test"));
      });

      it("deletes character at cursor at end of line with Delete", () => {
        // Cursor at the end of 'Hello'
        const result = calcTextarea(aState(5, multiLineText), ["Delete"]);
        expect(result).toEqual(aState(5, "HelloWorld\nThis is a test"));
      });
    });
  });
  describe("Ctrl key combinations considering line breaks", () => {
    it("moves cursor to start of word when ctrl+ArrowLeft is pressed at middle of text with newline", () => {
      const text = "a\nb c";
      const cursorPos = 3; // After 'b'
      const result = calcTextarea(aState(cursorPos, text), [
        "ctrl",
        "ArrowLeft",
      ]);
      expect(result).toEqual(aState(2, text));
    });

    it("deletes previous word when ctrl+Backspace is pressed at middle of text with newline", () => {
      const text = "a\nb c";
      const cursorPos = 3; // After 'b'
      const result = calcTextarea(aState(cursorPos, text), [
        "ctrl",
        "Backspace",
      ]);
      expect(result).toEqual(aState(2, "a\n c"));
    });
  });
});
