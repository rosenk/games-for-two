import type { GameState, Player } from "../game-state.ts";

declare module "../types.ts" { interface GameState { battle?: BattleState; } }

export const FLEET = [5, 4, 3, 3, 2];
export type Shot = null | "miss" | "hit" | "sunk";
export type BattleState = {
  fleets: Record<Player, number[][] | null>;
  ready: Record<Player, boolean>;
  shots: Record<Player, Shot[]>;
  starter: Player;
};
const other = (player: Player): Player => player === "X" ? "O" : "X";

export function cloneBattle(b: BattleState): BattleState {
  return { fleets: { X: b.fleets.X?.map((ship) => [...ship]) ?? null, O: b.fleets.O?.map((ship) => [...ship]) ?? null },
    ready: { ...b.ready }, shots: { X: [...b.shots.X], O: [...b.shots.O] }, starter: b.starter };
}

export function createBattle(starter: Player = "X"): BattleState {
  return { fleets: { X: [], O: [] }, ready: { X: false, O: false },
    shots: { X: Array<Shot>(100).fill(null), O: Array<Shot>(100).fill(null) }, starter };
}

export function shipCells(index: number, length: number): number[] | null {
  if (!Number.isInteger(index) || index < 0 || index >= 200) return null;
  const start = index % 100, vertical = index >= 100;
  if (vertical ? Math.floor(start / 10) + length > 10 : start % 10 + length > 10) return null;
  return Array.from({ length }, (_, n) => start + n * (vertical ? 10 : 1));
}

export function canPlace(fleet: number[][], cells: number[] | null): boolean {
  return !!cells && !cells.some((cell) => fleet.some((ship) => ship.some((occupied) =>
    Math.abs(Math.floor(cell / 10) - Math.floor(occupied / 10)) <= 1 && Math.abs(cell % 10 - occupied % 10) <= 1)));
}

export function playBattle(game: GameState, index: number, player: Player): GameState {
  if (game.gameOver || player !== game.currentPlayer || !Number.isInteger(index)) return game;
  const battle = game.battle!, opponent = other(player), fleet = battle.fleets[player];
  if (!fleet || !battle.fleets[opponent]) return game; // Views cannot apply authoritative moves.
  const next = cloneBattle(battle);
  if (!battle.ready.X || !battle.ready.O) {
    if (battle.ready[player]) return game;
    if (index === 200) {
      // Rebuild the entire fleet; avoids a partial placement that leaves no room.
      do {
        next.fleets[player] = [];
        for (const length of FLEET) {
          const options = Array.from({ length: 200 }, (_, i) => shipCells(i, length))
            .filter((cells): cells is number[] => canPlace(next.fleets[player]!, cells));
          if (!options.length) break;
          next.fleets[player]!.push(options[Math.floor(Math.random() * options.length)]);
        }
      } while (next.fleets[player]!.length !== FLEET.length);
    } else if (index === 201 && fleet.length) next.fleets[player]!.pop();
    else if (index === 202 && fleet.length === FLEET.length) {
      next.ready[player] = true;
      return { ...game, battle: next, currentPlayer: next.ready[opponent] ? battle.starter : opponent };
    } else {
      if (fleet.length === FLEET.length) return game;
      const cells = shipCells(index, FLEET[fleet.length]);
      if (!canPlace(fleet, cells)) return game;
      next.fleets[player]!.push(cells!);
    }
    return { ...game, battle: next };
  }
  if (index < 0 || index >= 100 || battle.shots[player][index]) return game;
  const ship = battle.fleets[opponent]!.find((cells) => cells.includes(index));
  next.shots[player][index] = ship ? "hit" : "miss";
  if (ship?.every((cell) => next.shots[player][cell])) {
    for (const cell of ship) next.shots[player][cell] = "sunk";
  }
  const won = battle.fleets[opponent]!.flat().every((cell) => next.shots[player][cell]);
  return { ...game, battle: next, gameOver: won, currentPlayer: won ? player : opponent,
    scores: won ? { ...game.scores, [player]: game.scores[player] + 1 } : game.scores };
}

// Neither the network recipient nor the bot receives unhit opposing ships.
export function battleView(game: GameState, viewer: Player): GameState {
  if (!game.battle) return game;
  const battle = cloneBattle(game.battle);
  battle.fleets[other(viewer)] = null;
  return { ...game, battle };
}

export function restoreBattle(value: unknown, game: GameState, viewer?: Player): BattleState | null {
  if (!value || typeof value !== "object") return null;
  const b = value as BattleState;
  if (!b.fleets || !b.ready || !b.shots || (b.starter !== "X" && b.starter !== "O")) return null;
  for (const p of ["X", "O"] as const) {
    const fleet = b.fleets[p], shots = b.shots[p];
    if (typeof b.ready[p] !== "boolean" || !Array.isArray(shots) || shots.length !== 100
      || !shots.every((shot) => shot === null || shot === "miss" || shot === "hit" || shot === "sunk")) return null;
    if (fleet === null) {
      if (!viewer || p === viewer) return null;
      continue;
    }
    if (!Array.isArray(fleet) || fleet.length > 5 || (b.ready[p] && fleet.length !== 5)) return null;
    for (let n = 0; n < fleet.length; n++) {
      const ship = fleet[n];
      if (!Array.isArray(ship) || ship.length !== FLEET[n]
        || ![shipCells(ship[0], FLEET[n]), shipCells(ship[0] + 100, FLEET[n])]
          .some((cells) => cells && cells.every((cell, i) => cell === ship[i]))
        || !canPlace(fleet.slice(0, n), ship)) return null;
    }
    const attacks = b.shots[other(p)];
    if (!Array.isArray(attacks) || attacks.length !== 100) return null;
    for (let cell = 0; cell < 100; cell++) {
      const ship = fleet.find((s) => s.includes(cell));
      const shot = attacks[cell];
      if (shot && shot !== (ship ? ship.every((i) => attacks[i]) ? "sunk" : "hit" : "miss")) return null;
    }
  }
  const playing = b.ready.X && b.ready.O;
  if (!playing && (game.gameOver || b.ready[game.currentPlayer] || b.shots.X.some(Boolean) || b.shots.O.some(Boolean))) return null;
  const winners = (["X", "O"] as const).filter((p) => b.shots[p].filter((shot) => shot === "sunk").length === 17);
  if (game.gameOver !== (winners.length === 1) || winners.length > 1 || (winners.length && winners[0] !== game.currentPlayer)) return null;
  if (playing) {
    const first = b.shots[b.starter].filter(Boolean).length, second = b.shots[other(b.starter)].filter(Boolean).length;
    if (first < second || first > second + 1
      || (!game.gameOver && game.currentPlayer !== (first === second ? b.starter : other(b.starter)))) return null;
  }
  return cloneBattle(b);
}
