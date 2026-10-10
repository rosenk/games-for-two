import type { Cell, GameState } from "../game-state.ts";
import { boxEdges } from "./rules.ts";
import { registerComputer, getGame } from "../registry.ts";

registerComputer("dots-and-boxes", (game) => {
  const index = boxesComputerMove(game);
  return getGame(game.kind).play(game, index, game.currentPlayer) === game ? null : index;
});

const emptyCells = (board: Cell[]) => board.flatMap((cell, index) => cell ? [] : [index]);

export function boxesComputerMove(game: GameState): number {
  const edges = game.boxes!.map((_, i) => boxEdges(i, game.boardSize));
  const board = [...game.board];
  const available = emptyCells(board);
  const memo = new Map<string, number>();
  const exact = available.length <= 12;
  const deadline = performance.now() + 1000;
  let timedOut = false;
  function captures(index: number): number {
    return edges.filter((box) => box.includes(index) && box.every((edge) => edge === index || board[edge])).length;
  }
  function search(depth: number): number {
    const moves = emptyCells(board);
    if (!moves.length) return 0;
    if (!exact && performance.now() > deadline) { timedOut = true; return 0; }
    const key = board.map((cell) => cell ? "1" : "0").join("") + `:${depth}`;
    const cached = memo.get(key);
    if (cached !== undefined) return cached;
    // At the horizon, price the whole available chain, not just its first box.
    // Greedy collection here bounds the work even with many independent chains.
    if (!exact && depth <= 0) {
      const taken: number[] = [];
      let total = 0;
      for (;;) {
        const index = moves.find((i) => !board[i] && captures(i));
        if (index === undefined) break;
        total += captures(index);
        board[index] = "X";
        taken.push(index);
      }
      for (const index of taken) board[index] = null;
      return total;
    }
    let best = -Infinity;
    for (const index of moves) {
      const count = captures(index);
      board[index] = "X"; // Ownership is irrelevant to the remaining-edge search.
      const value = count ? count + search(depth - 1) : -search(depth - 1);
      board[index] = null;
      best = Math.max(best, value);
      if (timedOut) return best;
    }
    memo.set(key, best);
    return best;
  }
  let move = available[0];
  for (const depth of exact ? [12] : [0, 1, 2, 3]) {
    let best = -Infinity, candidate = move;
    for (const index of available) {
      const count = captures(index);
      board[index] = "X";
      const value = count ? count + search(depth) : -search(depth);
      board[index] = null;
      // Equal tactical outcomes: prefer leaving fewer two-sided squares.
      const risk = edges.filter((box) => box.filter((edge) => edge === index || board[edge]).length === 2).length;
      const score = value * 100 - risk;
      if (score > best) { best = score; candidate = index; }
      if (timedOut) break;
    }
    if (timedOut) break;
    move = candidate;
  }
  return move;
}
