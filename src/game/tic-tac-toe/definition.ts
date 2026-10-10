import { registerGame } from "../registry.ts";
import { place } from "../place.ts";
import { findWinningLine } from "./rules.ts";
export const definition = registerGame({
  kind: "tic-tac-toe", defaultSize: 3, allowSizeParameter: false,
  play: (game, index, player) => place(game, index, player, findWinningLine),
  restore: (game) => ({ ...game, winningLine: findWinningLine(game.board) }),
});
