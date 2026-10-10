import type { Cell } from "../game-state.ts";

export const CONNECT_COLUMNS = 7;
export const CONNECT_ROWS = 6;

export const lines: number[][] = [];
for (let row = 0; row < CONNECT_ROWS; row++) {
  for (let col = 0; col < CONNECT_COLUMNS; col++) {
    for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
      if (row + 3 * dr >= CONNECT_ROWS || col + 3 * dc < 0 || col + 3 * dc >= CONNECT_COLUMNS) continue;
      lines.push(Array.from({ length: 4 }, (_, n) => (row + n * dr) * CONNECT_COLUMNS + col + n * dc));
    }
  }
}

export function connectLanding(board: Cell[], column: number): number | null {
  if (!Number.isInteger(column) || column < 0 || column >= CONNECT_COLUMNS) return null;
  for (let row = CONNECT_ROWS - 1; row >= 0; row--) {
    const index = row * CONNECT_COLUMNS + column;
    if (!board[index]) return index;
  }
  return null;
}

export function connectWinningLine(board: Cell[]): number[] | null {
  return lines.find((line) => board[line[0]] && line.every((i) => board[i] === board[line[0]])) ?? null;
}
