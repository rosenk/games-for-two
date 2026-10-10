import { registerGame } from "../registry.ts";
import type { Cell } from "../types.ts";
import { boxEdges, playBoxes, DOTS_SIZES } from "./rules.ts";
export const definition = registerGame({
  kind: "dots-and-boxes", defaultSize: 3, sizes: DOTS_SIZES,
  boardLength: (size) => 2 * size * (size + 1),
  create: (size) => ({ boxes: Array<Cell>(size ** 2).fill(null) }), play: playBoxes,
  reset: (game) => ({ board: game.board.map(() => null), boxes: game.boxes!.map(() => null) }),
  serialize: (game) => ({ boxes: [...game.boxes!] }),
  restore: (game) => {
    if (!Array.isArray(game.boxes) || game.boxes.length !== game.boardSize ** 2
      || !game.boxes.every((cell) => cell === null || cell === "X" || cell === "O")
      || game.boxes.some((owner, index) => Boolean(owner) !== boxEdges(index, game.boardSize).every((edge) => game.board[edge]))
      || game.gameOver !== game.boxes.every(Boolean)) return null;
    return { ...game, boxes: [...game.boxes] };
  },
});
