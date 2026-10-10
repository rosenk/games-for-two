import { registerGame } from "../registry.ts";
import { createBattle, playBattle, restoreBattle, cloneBattle, battleView } from "./rules.ts";
export const definition = registerGame({
  kind: "battleship", defaultSize: 3,
  create: () => ({ battle: createBattle() }), play: playBattle,
  reset: (game) => ({ board: game.board.map(() => null), battle: createBattle(game.nextStarter) }),
  serialize: (game) => ({ battle: cloneBattle(game.battle!) }), view: battleView,
  restore: (game, viewer) => {
    const battle = restoreBattle(game.battle, game, viewer);
    return battle && !game.board.some(Boolean) ? { ...game, battle } : null;
  },
});
