import "./computers.ts";
import { getGame, getComputer } from "./catalog.ts";
import type { GameState, Player } from "./types.ts";

export function computerDelay(game: GameState, player: Player, random = Math.random): number {
  getGame(game.kind);
  return getComputer(game.kind)?.delay?.(game, player, random) ?? 550 + random() * 350;
}
export function chooseComputerMove(game: GameState): number | null {
  getGame(game.kind);
  if (game.gameOver) return null;
  return getComputer(game.kind)?.choose(game) ?? null;
}
