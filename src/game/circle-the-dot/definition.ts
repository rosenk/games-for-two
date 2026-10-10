import { registerGame } from "../registry.ts";
import { createDotGame, playDot, restoreDotGame } from "./rules.ts";
export const definition = registerGame({
  kind: "circle-the-dot", defaultSize: 3, boardLength: () => 0,
  create: () => ({ dotGame: createDotGame() }), play: playDot,
  reset: (game) => ({ board: [], dotGame: { ...createDotGame(), blocker: game.dotGame!.blocker }, currentPlayer: game.dotGame!.blocker }),
  serialize: (game) => ({ dotGame: { ...game.dotGame!, blocked: [...game.dotGame!.blocked] } }),
  configureHost: (game, selectedSide, hostPlayer) => {
    const blocker = selectedSide === "X" ? hostPlayer : hostPlayer === "X" ? "O" : "X";
    return { ...game, dotGame: { ...game.dotGame!, blocker }, currentPlayer: blocker };
  },
  restore: (game) => {
    const dotGame = restoreDotGame(game.dotGame);
    if (!dotGame || game.gameOver !== (dotGame.result !== "playing")
      || (dotGame.result === "trapped" && game.currentPlayer !== dotGame.blocker)
      || (dotGame.result === "escaped" && game.currentPlayer === dotGame.blocker)) return null;
    return { ...game, dotGame };
  },
});
