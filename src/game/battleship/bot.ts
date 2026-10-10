import type { GameState } from "../game-state.ts";
import { FLEET, shipCells } from "./rules.ts";
import { registerComputer } from "../registry.ts";

registerComputer("battleship", battleComputerMove);

export function battleComputerMove(game: GameState): number | null {
  const battle = game.battle!, player = game.currentPlayer;
  if (!battle.ready[player]) return battle.fleets[player]?.length === 5 ? 202 : 200;
  if (!battle.ready.X || !battle.ready.O) return null;
  const shots = battle.shots[player], hits = shots.flatMap((shot, i) => shot === "hit" ? [i] : []);
  const scores = Array<number>(100).fill(0);
  // Count possible placements of unsunk ships, respecting misses, sunk ships,
  // and all unresolved hits. No access to the rival fleet is needed.
  const remaining = [...FLEET];
  const visited = new Set<number>();
  for (let i = 0; i < 100; i++) {
    if (shots[i] !== "sunk" || visited.has(i)) continue;
    const stack = [i]; let length = 0;
    while (stack.length) {
      const cell = stack.pop()!;
      if (visited.has(cell)) continue;
      visited.add(cell); length++;
      for (let n = 0; n < 100; n++) if (shots[n] === "sunk" && !visited.has(n)
        && Math.abs(Math.floor(cell / 10) - Math.floor(n / 10)) + Math.abs(cell % 10 - n % 10) === 1) stack.push(n);
    }
    const at = remaining.indexOf(length);
    if (at >= 0) remaining.splice(at, 1);
  }
  for (const length of remaining) for (let move = 0; move < 200; move++) {
    const cells = shipCells(move, length);
    if (!cells || cells.some((cell) => shots[cell] === "miss" || shots[cell] === "sunk"
      || [...visited].some((sunk) => Math.abs(Math.floor(cell / 10) - Math.floor(sunk / 10)) <= 1 && Math.abs(cell % 10 - sunk % 10) <= 1))) continue;
    const count = cells.filter((cell) => shots[cell] === "hit").length;
    if (hits.length && !count) continue;
    for (const cell of cells) if (!shots[cell]) scores[cell] += count ? 100 ** count : 1;
  }
  const legal = shots.flatMap((shot, i) => shot ? [] : [i]);
  const best = Math.max(...legal.map((i) => scores[i]));
  const candidates = legal.filter((i) => scores[i] === best);
  return candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : null;
}
