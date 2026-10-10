import { registerGame } from "../registry.ts";
import { place } from "../place.ts";
import { DEFAULT_HEX_SIZE, HEX_SIZES, findHexPath, type HexSize } from "./rules.ts";
export const definition = registerGame({
  kind: "hex", defaultSize: DEFAULT_HEX_SIZE, sizes: HEX_SIZES,
  play: (game, index, player) => place(game, index, player,
    (board) => findHexPath(board, player, game.boardSize as HexSize), false),
  restore: (game) => ({ ...game, winningLine: findHexPath(game.board, "X", game.boardSize as HexSize)
    || findHexPath(game.board, "O", game.boardSize as HexSize) }),
});
