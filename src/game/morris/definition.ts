import { registerGame } from "../registry.ts";
import { createMorris, playMorris, restoreMorris } from "./rules.ts";
export const definition = registerGame({
  kind: "morris", defaultSize: 3, boardLength: () => 24,
  create: () => ({ morris: createMorris() }), play: playMorris,
  reset: (game) => ({ board: game.board.map(() => null), morris: createMorris() }),
  serialize: (game) => ({ morris: { ...game.morris!, reserve: { ...game.morris!.reserve }, history: [...game.morris!.history] } }),
  restore: (game) => {
    const morris = restoreMorris(game, game.morris);
    return morris ? { ...game, morris } : null;
  },
});
