import { describe, it, expect } from "vitest";
import { calcTextarea } from "./virtualTextarea";

describe("calcTextarea", () => {
  describe("Single key operations", () => {
    it("moves cursor one position left when ArrowLeft is pressed", () => {
      const result = calcTextarea(5, "Hello World", ["ArrowLeft"]);
      expect(result).toEqual({ cursorPos: 4, text: "Hello World" });
    });

    it("does not move cursor left when at position 0", () => {
      const result = calcTextarea(0, "Hello World", ["ArrowLeft"]);
      expect(result).toEqual({ cursorPos: 0, text: "Hello World" });
    });

    it("moves cursor one position right when ArrowRight is pressed", () => {
      const result = calcTextarea(5, "Hello World", ["ArrowRight"]);
      expect(result).toEqual({ cursorPos: 6, text: "Hello World" });
    });

    it("does not move cursor right when at end of text", () => {
      const text = "Hello World";
      const result = calcTextarea(text.length, text, ["ArrowRight"]);
      expect(result).toEqual({ cursorPos: text.length, text });
    });

    it("deletes character before cursor when Backspace is pressed", () => {
      const result = calcTextarea(6, "Hello World", ["Backspace"]);
      expect(result).toEqual({ cursorPos: 5, text: "HelloWorld" });
    });

    it("does not delete character when cursor is at position 0 and Backspace is pressed", () => {
      const result = calcTextarea(0, "Hello World", ["Backspace"]);
      expect(result).toEqual({ cursorPos: 0, text: "Hello World" });
    });

    it("deletes character at cursor when Delete is pressed", () => {
      const result = calcTextarea(5, "Hello World", ["Delete"]);
      expect(result).toEqual({ cursorPos: 5, text: "HelloWorld" });
    });

    it("does not delete character when cursor is at end of text and Delete is pressed", () => {
      const text = "Hello World";
      const result = calcTextarea(text.length, text, ["Delete"]);
      expect(result).toEqual({ cursorPos: text.length, text });
    });

    it("returns original cursor position and text when key is not handled", () => {
      const result = calcTextarea(5, "Hello World", ["A"]);
      expect(result).toEqual({ cursorPos: 5, text: "Hello World" });
    });
  });

  describe("Ctrl key combinations", () => {
    it("moves cursor to start of previous word when ctrl+ArrowLeft is pressed from middle", () => {
      const result = calcTextarea(6, "Hello World", ["ctrl", "ArrowLeft"]);
      expect(result).toEqual({ cursorPos: 0, text: "Hello World" });
    });

    it("moves cursor to start of previous word when ctrl+ArrowLeft is pressed from end", () => {
      const result = calcTextarea(11, "Hello World", ["ctrl", "ArrowLeft"]);
      expect(result).toEqual({ cursorPos: 6, text: "Hello World" });
    });

    it("moves cursor to start of next word when ctrl+ArrowRight is pressed", () => {
      const result = calcTextarea(0, "Hello World", ["ctrl", "ArrowRight"]);
      expect(result).toEqual({ cursorPos: 5, text: "Hello World" });
    });

    it("moves cursor to end of text when ctrl+ArrowRight is pressed and no next word", () => {
      const result = calcTextarea(6, "Hello World", ["ctrl", "ArrowRight"]);
      expect(result).toEqual({ cursorPos: 11, text: "Hello World" });
    });

    it("deletes next word when ctrl+Delete is pressed from start", () => {
      const result = calcTextarea(0, "Hello World", ["ctrl", "Delete"]);
      expect(result).toEqual({ cursorPos: 0, text: " World" });
    });

    it("deletes to end of text when ctrl+Delete is pressed and no next word", () => {
      const result = calcTextarea(6, "Hello World", ["ctrl", "Delete"]);
      expect(result).toEqual({ cursorPos: 6, text: "Hello " });
    });

    it("deletes previous word when ctrl+Backspace is pressed from middle", () => {
      const result = calcTextarea(6, "Hello World", ["ctrl", "Backspace"]);
      expect(result).toEqual({ cursorPos: 0, text: "World" });
    });

    it("deletes previous word when ctrl+Backspace is pressed from end", () => {
      const result = calcTextarea(11, "Hello World", ["ctrl", "Backspace"]);
      expect(result).toEqual({ cursorPos: 6, text: "Hello " });
    });

    it("does not delete anything when cursor is at start and ctrl+Backspace is pressed", () => {
      const result = calcTextarea(0, "Hello World", ["ctrl", "Backspace"]);
      expect(result).toEqual({ cursorPos: 0, text: "Hello World" });
    });

    it("returns original cursor position and text when ctrl+unhandled key is pressed", () => {
      const result = calcTextarea(5, "Hello World", ["ctrl", "A"]);
      expect(result).toEqual({ cursorPos: 5, text: "Hello World" });
    });
    it("emojis in words", () => {
      const text = "🕷🕷 🐍🐊";
      const cursorPos = 5;
      const result = calcTextarea(cursorPos, text, ["ctrl", "Backspace"]);
      expect(result).toEqual({ cursorPos: 3, text: "🕷🕷 " });
    });
    it("Arrow right with control should move from empty space to the end of the next word", () => {
      const text = "a b c";
      const cursorPos = 1;
      const result = calcTextarea(cursorPos, text, ["ctrl", "ArrowRight"]);
      expect(result).toEqual({ cursorPos: 3, text: "a b c" });
    });
    it("Backspace with control in the middle of the text should delete the previous word", () => {
        const text = "adf sdlfj ldsjfq sdfsd";
        const cursorPos = 16;
        const result = calcTextarea(cursorPos, text, ["ctrl", "Backspace"]);
        expect(result).toEqual({ cursorPos: 10, text: "adf sdlfj  sdfsd" });
    });
  });

  describe("Invalid key combinations", () => {
    it("returns original cursor position and text when keyCombination length is not 1 or 2", () => {
      const result = calcTextarea(5, "Hello World", ["Shift", "A"]);
      expect(result).toEqual({ cursorPos: 5, text: "Hello World" });
    });

    it("returns original cursor position and text when keyCombination is empty", () => {
      const result = calcTextarea(5, "Hello World", []);
      expect(result).toEqual({ cursorPos: 5, text: "Hello World" });
    });
  });
  describe("Line Breaks Handling", () => {
    const multiLineText = "Hello\nWorld\nThis is a test";

    describe("Single key operations with line breaks", () => {
      it("moves cursor across lines with ArrowLeft", () => {
        // Cursor at the start of 'World'
        const cursorPos = 6;
        const result = calcTextarea(cursorPos, multiLineText, ["ArrowLeft"]);
        expect(result).toEqual({ cursorPos: 5, text: multiLineText });
      });

      it("moves cursor across lines with ArrowRight", () => {
        // Cursor at the end of 'Hello'
        const cursorPos = 5;
        const result = calcTextarea(cursorPos, multiLineText, ["ArrowRight"]);
        expect(result).toEqual({ cursorPos: 6, text: multiLineText });
      });

      it("deletes newline character with Backspace", () => {
        // Cursor at the start of 'World'
        const cursorPos = 6;
        const result = calcTextarea(cursorPos, multiLineText, ["Backspace"]);
        expect(result).toEqual({
          cursorPos: 5,
          text: "HelloWorld\nThis is a test",
        });
      });

      it("deletes newline character with Delete", () => {
        // Cursor at the end of 'Hello'
        const cursorPos = 5;
        const result = calcTextarea(cursorPos, multiLineText, ["Delete"]);
        expect(result).toEqual({
          cursorPos: 5,
          text: "HelloWorld\nThis is a test",
        });
      });
    });

    describe("Ctrl key combinations with line breaks", () => {
      it("moves cursor to start of previous word across lines with ctrl+ArrowLeft", () => {
        // Cursor at the start of 'This'
        const cursorPos = 12;
        const result = calcTextarea(cursorPos, multiLineText, [
          "ctrl",
          "ArrowLeft",
        ]);
        expect(result).toEqual({ cursorPos: 6, text: multiLineText });
      });

      it("moves cursor to end of next word across lines with ctrl+ArrowRight", () => {
        // Cursor at the end of 'World'
        const cursorPos = 11;
        const result = calcTextarea(cursorPos, "Hello\nWorld\nThis is a test", [
          "ctrl",
          "ArrowRight",
        ]);
        expect(result).toEqual({ cursorPos: 16, text: multiLineText });
      });
      it("deletes next word across lines with ctrl+Delete", () => {
        // Cursor at the end of 'Hello'
        const cursorPos = 5;
        const result = calcTextarea(cursorPos, multiLineText, [
          "ctrl",
          "Delete",
        ]);
        expect(result).toEqual({
          cursorPos: 5,
          text: "Hello\nThis is a test",
        });
      });

      it("deletes previous word across lines with ctrl+Backspace", () => {
        // Cursor at the start of 'This'
        const cursorPos = 12;
        const result = calcTextarea(cursorPos, multiLineText, [
          "ctrl",
          "Backspace",
        ]);
        expect(result).toEqual({
          cursorPos: 6,
          text: "Hello\nThis is a test",
        });
      });
    });

    describe("Edge cases with line breaks", () => {
      it("does not move cursor left when at position 0 in multi-line text", () => {
        const result = calcTextarea(0, multiLineText, ["ArrowLeft"]);
        expect(result).toEqual({ cursorPos: 0, text: multiLineText });
      });

      it("does not move cursor right when at end of multi-line text", () => {
        const result = calcTextarea(multiLineText.length, multiLineText, [
          "ArrowRight",
        ]);
        expect(result).toEqual({
          cursorPos: multiLineText.length,
          text: multiLineText,
        });
      });

      it("deletes character before cursor at start of line with Backspace", () => {
        // Cursor at the start of 'World' on second line
        const cursorPos = 6;
        const result = calcTextarea(cursorPos, multiLineText, ["Backspace"]);
        expect(result).toEqual({
          cursorPos: 5,
          text: "HelloWorld\nThis is a test",
        });
      });

      it("deletes character at cursor at end of line with Delete", () => {
        // Cursor at the end of 'Hello'
        const cursorPos = 5;
        const result = calcTextarea(cursorPos, multiLineText, ["Delete"]);
        expect(result).toEqual({
          cursorPos: 5,
          text: "HelloWorld\nThis is a test",
        });
      });
    });
  });
  describe("Ctrl key combinations considering line breaks", () => {
    it("moves cursor to start of word when ctrl+ArrowLeft is pressed at middle of text with newline", () => {
      const text = "a\nb c";
      const cursorPos = 3; // After 'b'
      const result = calcTextarea(cursorPos, text, ["ctrl", "ArrowLeft"]);
      expect(result).toEqual({ cursorPos: 2, text });
    });

    it("deletes previous word when ctrl+Backspace is pressed at middle of text with newline", () => {
      const text = "a\nb c";
      const cursorPos = 3; // After 'b'
      const result = calcTextarea(cursorPos, text, ["ctrl", "Backspace"]);
      expect(result).toEqual({ cursorPos: 2, text: "a\n c" });
    });
  });
});
