import type { Cell, GameState, Player } from "../game-state.ts";

declare module "../types.ts" { interface GameState { boxes?: Cell[]; } }

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

export function playBoxes(game: GameState, index: number, player: Player): GameState {
  if (!Number.isInteger(index) || index < 0 || index >= game.board.length) return game;
  if (game.gameOver || game.board[index] || player !== game.currentPlayer) return game;
  const board = [...game.board];
  const scores = { ...game.scores };
  board[index] = player;
  const boxes = claimBoxes(board, game.boxes!, player, game.boardSize);
  const claimed = boxes.some((owner, index) => owner !== game.boxes![index]);
  const gameOver = boxes.every(Boolean);
  if (gameOver) scores[boxesWinner(boxes) || "draw"] += 1;
  return {
    ...game, board, boxes, scores, gameOver,
    currentPlayer: claimed ? player : player === "X" ? "O" : "X",
  };
}
