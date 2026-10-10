import type { GameDefinition, GameState, Player } from "./types.ts";
export type { GameDefinition } from "./types.ts";

export const games: GameDefinition[] = [];
export const gameKinds: string[] = [];
const definitions = new Map<string, GameDefinition>();
type Registration = Pick<GameDefinition, "kind" | "defaultSize" | "play"> & Partial<GameDefinition>;
export function registerGame(def: Registration): GameDefinition {
  if (!def.kind || definitions.has(def.kind)) throw new TypeError("Duplicate or empty game kind");
  const normalized: GameDefinition = {
    sizes: [def.defaultSize], allowSizeParameter: true, boardLength: (size) => size ** 2,
    create: () => ({}), reset: (game) => ({ board: game.board.map(() => null) }),
    serialize: () => ({}), restore: (game) => game,
    simultaneous: false, ready: () => true, reveal: (game) => game,
    view: (game) => game, configureHost: (game) => game, ...def,
  };
  definitions.set(def.kind, normalized);
  games.push(normalized);
  gameKinds.push(def.kind);
  return normalized;
}
export function findGame(kind: unknown): GameDefinition | undefined {
  return typeof kind === "string" ? definitions.get(kind) : undefined;
}
export function getGame(kind: unknown): GameDefinition {
  const definition = findGame(kind);
  if (!definition) throw new TypeError("Unknown game");
  return definition;
}

export interface ComputerDefinition {
  choose(game: GameState): number | null;
  delay?: (game: GameState, player: Player, random: () => number) => number;
}
const computers = new Map<string, ComputerDefinition>();
export function registerComputer(kind: string, choose: ComputerDefinition["choose"], delay?: ComputerDefinition["delay"]): void {
  if (computers.has(kind)) throw new TypeError("Duplicate computer kind");
  computers.set(kind, { choose, delay });
}
export function getComputer(kind: string): ComputerDefinition | undefined {
  return computers.get(kind);
}
