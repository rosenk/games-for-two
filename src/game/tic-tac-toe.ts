import type { Cell } from "./game-state.ts";

export const cellLabels = [
  "Горе вляво", "Горе в средата", "Горе вдясно",
  "В средата вляво", "В центъра", "В средата вдясно",
  "Долу вляво", "Долу в средата", "Долу вдясно",
];

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export function findWinningLine(board: Cell[]): number[] | null {
  return winningLines.find(([a, b, c]) => (
    board[a] && board[a] === board[b] && board[a] === board[c]
  )) || null;
}
