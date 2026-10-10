import type { Cell, GameState, Player } from "./game-state.ts";

export const CONNECT_COLUMNS = 7;
export const CONNECT_ROWS = 6;

const lines: number[][] = [];
for (let row = 0; row < CONNECT_ROWS; row++) {
  for (let col = 0; col < CONNECT_COLUMNS; col++) {
    for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
      if (row + 3 * dr >= CONNECT_ROWS || col + 3 * dc < 0 || col + 3 * dc >= CONNECT_COLUMNS) continue;
      lines.push(Array.from({ length: 4 }, (_, n) => (row + n * dr) * CONNECT_COLUMNS + col + n * dc));
    }
  }
}

export function connectLanding(board: Cell[], column: number): number | null {
  if (!Number.isInteger(column) || column < 0 || column >= CONNECT_COLUMNS) return null;
  for (let row = CONNECT_ROWS - 1; row >= 0; row--) {
    const index = row * CONNECT_COLUMNS + column;
    if (!board[index]) return index;
  }
  return null;
}

export function connectWinningLine(board: Cell[]): number[] | null {
  return lines.find((line) => board[line[0]] && line.every((i) => board[i] === board[line[0]])) ?? null;
}

export function connectComputerMove(game: GameState): number | null {
  const board = [...game.board];
  const order = [3, 2, 4, 1, 5, 0, 6];
  const other = (player: Player): Player => player === "X" ? "O" : "X";
  const deadline = performance.now() + 800;
  let timedOut = false;
  function evaluate(player: Player): number {
    let score = 0;
    for (const line of lines) {
      const own = line.filter((i) => board[i] === player).length;
      const rival = line.filter((i) => board[i] === other(player)).length;
      if (!rival) score += [0, 1, 8, 60, 0][own];
      if (!own) score -= [0, 1, 8, 60, 0][rival];
    }
    for (let row = 0; row < CONNECT_ROWS; row++) {
      const cell = board[row * CONNECT_COLUMNS + 3];
      if (cell) score += cell === player ? 4 : -4;
    }
    return score;
  }
  function search(player: Player, depth: number, alpha: number, beta: number): number {
    if (performance.now() > deadline) { timedOut = true; return 0; }
    if (board.every(Boolean)) return 0;
    if (!depth) return evaluate(player);
    let best = -Infinity;
    for (const column of order) {
      const index = connectLanding(board, column);
      if (index === null) continue;
      board[index] = player;
      const score = connectWinningLine(board) ? 100000 + depth : -search(other(player), depth - 1, -beta, -alpha);
      board[index] = null;
      if (timedOut) return 0;
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
      if (alpha >= beta) break;
    }
    return best === -Infinity ? 0 : best;
  }
  let move = order.find((column) => connectLanding(board, column) !== null) ?? null;
  for (let depth = 1; depth <= 8; depth++) {
    let best = -Infinity, candidate = move;
    for (const column of order) {
      const index = connectLanding(board, column);
      if (index === null) continue;
      board[index] = game.currentPlayer;
      const score = connectWinningLine(board) ? 100000 + depth : -search(other(game.currentPlayer), depth - 1, -Infinity, -best);
      board[index] = null;
      if (timedOut) break;
      if (score > best) { best = score; candidate = column; }
    }
    if (timedOut) break;
    move = candidate;
    if (best >= 100000) break;
  }
  return move;
}
