import { assertNever } from "../utils";

export type ICursorStartPos = "start" | "middle" | "end";

export function getActualInitialCursorPos(
    cursorStartPos: ICursorStartPos,
    levelStartContent: string[],
  ): number {
    const levelTextLength = Array.from(
      startContentToText(levelStartContent),
    ).length;
    switch (cursorStartPos) {
      case "start":
        return 0;
        break;
      case "middle":
        return Math.floor(levelTextLength / 2);
        break;
      case "end":
        return levelTextLength;
        break;
      default:
        assertNever(cursorStartPos);
    }
  }
  
  export function startContentToText(startContent: string[]) {
    return startContent.join("\n");
  }
  