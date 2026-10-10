import { makeMove, type GameState, type Cell, type Player } from "./game-state.ts";
import { findWinningLine } from "./tic-tac-toe.ts";
import { boxEdges, boxScore } from "./dots-and-boxes.ts";
import { SYMBOL_CARDS, SYMBOLS } from "./common-symbol.ts";
import { dotComputerMove } from "./circle-the-dot.ts";
import { morrisComputerMove } from "./morris.ts";
import { connectComputerMove } from "./connect-four.ts";

const other = (player: Player): Player => player === "X" ? "O" : "X";
const emptyCells = (board: Cell[]) => board.flatMap((cell, index) => cell ? [] : [index]);

// Reaction speed is deliberately separate from decision quality. A trailing human
// gets more time, never a changed answer or a secretly awarded point.
export function computerDelay(game: GameState, player: Player, random = Math.random): number {
  if (game.kind !== "common-symbol") return 550 + random() * 350;
  const lead = boxScore(game.board, player) - boxScore(game.board, other(player));
  return 3500 + random() * 2000 + Math.max(-1000, Math.min(2000, lead * 300));
}

function ticScore(board: Cell[], player: Player): number {
  const line = findWinningLine(board);
  if (line) return board[line[0]] === player ? 10 + emptyCells(board).length : -10 - emptyCells(board).length;
  const moves = emptyCells(board);
  if (!moves.length) return 0;
  return Math.max(...moves.map((index) => {
    board[index] = player;
    const score = -ticScore(board, other(player));
    board[index] = null;
    return score;
  }));
}

function ticMove(game: GameState): number {
  const board = [...game.board];
  let best = -Infinity;
  let move = -1;
  // Center and corners break equally optimal ties, not the minimax result.
  for (const index of [4, 0, 2, 6, 8, 1, 3, 5, 7].filter((i) => !board[i])) {
    board[index] = game.currentPlayer;
    const score = -ticScore(board, other(game.currentPlayer));
    board[index] = null;
    if (score > best) { best = score; move = index; }
  }
  return move;
}

function hexMove(game: GameState): number {
  const size = game.boardSize;
  const board = [...game.board];
  const neighbors = board.map((_, i) => {
    const r = Math.floor(i / size), c = i % size;
    return [[r - 1, c], [r - 1, c + 1], [r, c - 1], [r, c + 1], [r + 1, c - 1], [r + 1, c]]
      .filter(([row, col]) => row >= 0 && row < size && col >= 0 && col < size)
      .map(([row, col]) => row * size + col);
  });
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
      for (const next of neighbors[i]) {
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
        if (board[j] !== owner || neighbors[i].includes(j)) continue;
        const shared = neighbors[i].filter((n) => neighbors[j].includes(n));
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

function boxesMove(game: GameState): number {
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

// The UI and worker both use the same legal-move contract as human players.
export function chooseComputerMove(game: GameState): number | null {
  if (game.gameOver) return null;
  if (game.kind === "connect-four") return connectComputerMove(game);
  if (game.kind === "morris") return morrisComputerMove(game);
  if (game.kind === "common-symbol") {
    if (!game.started) return null;
    const symbol = SYMBOL_CARDS[game.deck![0]].find((s) => SYMBOL_CARDS[game.deck![1]].includes(s))!;
    return game.board.length * SYMBOLS.length + symbol;
  }
  if (game.kind === "circle-the-dot") return dotComputerMove(game.dotGame!, game.currentPlayer === game.dotGame!.blocker);
  const index = game.kind === "tic-tac-toe" ? ticMove(game) : game.kind === "hex" ? hexMove(game) : boxesMove(game);
  return makeMove(game, index, game.currentPlayer) === game ? null : index;
}
