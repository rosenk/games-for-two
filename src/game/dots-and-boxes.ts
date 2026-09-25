import type { Cell, Player } from "./game-state.ts";

// Sizes count boxes; the UI presents size + 1 points per side.
export const DOTS_SIZES = [3, 4, 5, 6] as const;

// Horizontal edges first (row-major), then vertical edges (row-major).
export function boxEdges(index: number, size: number): number[] {
  const row = Math.floor(index / size);
  const col = index % size;
  const vertical = size * (size + 1) + row * (size + 1) + col;
  return [row * size + col, (row + 1) * size + col, vertical, vertical + 1];
}

export function claimBoxes(board: Cell[], boxes: Cell[], player: Player, size: number): Cell[] {
  return boxes.map((owner, index) => owner || (boxEdges(index, size).every((edge) => board[edge]) ? player : null));
}

export function boxScore(boxes: Cell[], player: Player): number {
  return boxes.filter((owner) => owner === player).length;
}

export function boxesWinner(boxes: Cell[]): Player | null {
  const difference = boxScore(boxes, "X") - boxScore(boxes, "O");
  return difference === 0 ? null : difference > 0 ? "X" : "O";
}
