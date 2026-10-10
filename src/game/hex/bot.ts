import type { Cell, GameState, Player } from "../game-state.ts";
import { neighbors } from "./rules.ts";
import { registerComputer, getGame } from "../registry.ts";

registerComputer("hex", (game) => {
  const index = hexComputerMove(game);
  return getGame(game.kind).play(game, index, game.currentPlayer) === game ? null : index;
});

const other = (player: Player): Player => player === "X" ? "O" : "X";
const emptyCells = (board: Cell[]) => board.flatMap((cell, index) => cell ? [] : [index]);

export function hexComputerMove(game: GameState): number {
  const size = game.boardSize;
  const board = [...game.board];
  const adjacent = board.map((_, i) => neighbors(i, size));
  // Weighted shortest connections: own stones are free, blanks cost one,
  // opposing stones are impassable. Relaxation handles zero-cost clusters.
  function distance(player: Player): number {
    const distances = board.map(() => Infinity);
    const queue: number[] = [];
    for (let n = 0; n < size; n++) {
      const i = player === "X" ? n : n * size;
      if (board[i] !== other(player)) { distances[i] = board[i] ? 0 : 1; queue.push(i); }
    }
    for (let head = 0; head < queue.length; head++) {
      const i = queue[head];
      for (const next of adjacent[i]) {
        if (board[next] === other(player)) continue;
        const cost = distances[i] + (board[next] ? 0 : 1);
        if (cost < distances[next]) { distances[next] = cost; queue.push(next); }
      }
    }
    return Math.min(...Array.from({ length: size }, (_, n) => distances[player === "X" ? size * (size - 1) + n : n * size + size - 1]));
  }
  function evaluate(player: Player): number {
    const own = distance(player), rival = distance(other(player));
    if (own === 0) return 10000;
    if (rival === 0) return -10000;
    let shape = 0;
    board.forEach((owner, i) => {
      if (!owner) return;
      const sign = owner === player ? 1 : -1;
      const r = Math.floor(i / size), c = i % size;
      shape += sign * (size - Math.abs(r - (size - 1) / 2) - Math.abs(c - (size - 1) / 2)) * .08;
      // A virtual bridge has two shared empty neighbors: one block cannot cut it.
      for (let j = i + 1; j < board.length; j++) {
        if (board[j] !== owner || adjacent[i].includes(j)) continue;
        const shared = adjacent[i].filter((n) => adjacent[j].includes(n));
        if (shared.length === 2 && shared.every((n) => !board[n])) shape += sign * .6;
      }
    });
    return (Math.min(rival, size * 2) - Math.min(own, size * 2)) * 20 + shape;
  }
  const available = emptyCells(board);
  for (const player of [game.currentPlayer, other(game.currentPlayer)]) {
    for (const index of available) {
      board[index] = player;
      const wins = distance(player) === 0;
      board[index] = null;
      if (wins) return index;
    }
  }
  const deadline = performance.now() + 1000;
  function search(player: Player, depth: number, alpha: number, beta: number): { score: number; move: number } {
    const score = evaluate(player);
    if (!depth || Math.abs(score) >= 10000 || performance.now() > deadline) return { score, move: -1 };
    const candidates = emptyCells(board).map((index) => {
      board[index] = player;
      const value = evaluate(player);
      board[index] = null;
      return { index, value };
    }).sort((a, b) => b.value - a.value).slice(0, 8);
    let best = -Infinity, move = candidates[0]?.index ?? -1;
    for (const candidate of candidates) {
      board[candidate.index] = player;
      const value = -search(other(player), depth - 1, -beta, -alpha).score;
      board[candidate.index] = null;
      if (value > best) { best = value; move = candidate.index; }
      alpha = Math.max(alpha, best);
      if (alpha >= beta) break;
    }
    return { score: best, move };
  }
  let move = available[0];
  for (let depth = 1; depth <= 4; depth++) {
    const result = search(game.currentPlayer, depth, -Infinity, Infinity);
    // Do not replace a completed iteration with a partially explored one.
    if (performance.now() > deadline) break;
    move = result.move;
  }
  return move;
}
