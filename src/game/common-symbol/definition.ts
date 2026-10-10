import { registerGame } from "../registry.ts";
import { dealSymbolCards, makeSymbolMove, SYMBOL_CARDS, SYMBOL_TARGET } from "./rules.ts";
export const definition = registerGame({
  kind: "common-symbol", defaultSize: 3, boardLength: () => null,
  create: () => ({ deck: dealSymbolCards(), started: false }), play: makeSymbolMove,
  reset: () => ({ board: [], deck: dealSymbolCards(), started: false }),
  serialize: (game) => ({ deck: [...game.deck!], started: game.started }),
  simultaneous: true, ready: (game) => !!game.started, reveal: (game) => ({ ...game, started: true }),
  restore: (game) => {
    if (!Array.isArray(game.deck) || game.deck.length !== 2 || new Set(game.deck).size !== 2
      || !game.deck.every((card) => Number.isInteger(card) && card >= 0 && card < SYMBOL_CARDS.length)
      || game.board.includes(null) || typeof game.started !== "boolean" || (!game.started && game.board.length > 0)
      || ["X", "O"].some((player) => game.board.slice(0, -1).filter((owner) => owner === player).length >= SYMBOL_TARGET)
      || game.gameOver !== ["X", "O"].some((player) => game.board.filter((owner) => owner === player).length === SYMBOL_TARGET)) return null;
    return { ...game, deck: [...game.deck] };
  },
});
