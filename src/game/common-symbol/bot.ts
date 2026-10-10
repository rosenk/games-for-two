import type { GameState, Player } from "../game-state.ts";
import { SYMBOL_CARDS, SYMBOLS } from "./rules.ts";
import { registerComputer } from "../registry.ts";

registerComputer("common-symbol", symbolComputerMove, symbolComputerDelay);

export function symbolComputerMove(game: GameState): number | null {
  if (!game.started) return null;
  const symbol = SYMBOL_CARDS[game.deck![0]].find((s) => SYMBOL_CARDS[game.deck![1]].includes(s))!;
  return game.board.length * SYMBOLS.length + symbol;
}

// Reaction speed is deliberately separate from decision quality. A trailing human
// gets more time, never a changed answer or a secretly awarded point.
export function symbolComputerDelay(game: GameState, player: Player, random = Math.random): number {
  const rival = player === "X" ? "O" : "X";
  const lead = game.board.filter((owner) => owner === player).length - game.board.filter((owner) => owner === rival).length;
  return 3500 + random() * 2000 + Math.max(-1000, Math.min(2000, lead * 300));
}
