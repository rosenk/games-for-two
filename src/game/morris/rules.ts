import type { Cell, GameState, Player } from "../game-state.ts";

declare module "../types.ts" { interface GameState { morris?: MorrisState; } }

// Each square runs clockwise from its top-left corner, with a midpoint per side.
export const MORRIS_POINTS = [
  [5, 5], [50, 5], [95, 5], [95, 50], [95, 95], [50, 95], [5, 95], [5, 50],
  [20, 20], [50, 20], [80, 20], [80, 50], [80, 80], [50, 80], [20, 80], [20, 50],
  [35, 35], [50, 35], [65, 35], [65, 50], [65, 65], [50, 65], [35, 65], [35, 50],
];
export const MORRIS_MILLS = [
  ...[0, 8, 16].flatMap((n) => [[n, n + 1, n + 2], [n + 2, n + 3, n + 4],
    [n + 4, n + 5, n + 6], [n + 6, n + 7, n]]),
  [1, 9, 17], [3, 11, 19], [5, 13, 21], [7, 15, 23],
];
export const MORRIS_NEIGHBORS = MORRIS_POINTS.map((_, index) => [...new Set(
  MORRIS_MILLS.flatMap((line) => line.flatMap((point, i) => point === index
    ? [line[i - 1], line[i + 1]].filter((n) => n !== undefined) : [])),
)]);
export type MorrisState = {
  reserve: Record<Player, number>;
  capture: boolean;
  quiet: number;
  history: string[];
  result: Player | "draw" | null;
};
const other = (p: Player): Player => p === "X" ? "O" : "X";
const count = (board: Cell[], p: Player) => board.filter((cell) => cell === p).length;
const inMill = (board: Cell[], index: number) => MORRIS_MILLS.some((line) => line.includes(index)
  && board[index] && line.every((i) => board[i] === board[index]));
export const morrisPosition = (game: GameState) => game.board.map((c) => c || "-").join("")
  + game.currentPlayer + game.morris!.reserve.X + game.morris!.reserve.O;
export const createMorris = (): MorrisState => ({ reserve: { X: 9, O: 9 }, capture: false, quiet: 0, history: [], result: null });

// Placements/captures use 0..23; movement packs source and target into one integer.
export const morrisMovement = (from: number, to: number) => 24 + from * 24 + to;
export function morrisActions(game: GameState): number[] {
  if (game.gameOver) return [];
  const { board, currentPlayer: p } = game;
  const m = game.morris!;
  if (m.capture) {
    const enemy = board.flatMap((c, i) => c === other(p) ? [i] : []);
    const exposed = enemy.filter((i) => !inMill(board, i));
    return exposed.length ? exposed : enemy;
  }
  const empty = board.flatMap((c, i) => c ? [] : [i]);
  if (m.reserve[p]) return empty;
  return board.flatMap((c, from) => c === p
    ? (count(board, p) === 3 ? empty : MORRIS_NEIGHBORS[from].filter((i) => !board[i]))
      .map((to) => morrisMovement(from, to)) : []);
}

export function playMorris(game: GameState, action: number, player: Player): GameState {
  if (player !== game.currentPlayer || !Number.isInteger(action) || !morrisActions(game).includes(action)) return game;
  const board = [...game.board];
  const m: MorrisState = { ...game.morris!, reserve: { ...game.morris!.reserve }, history: [...game.morris!.history] };
  const capturing = m.capture;
  let to = action;
  if (capturing) { board[action] = null; m.capture = false; }
  else {
    if (action >= 24) { const packed = action - 24; board[Math.floor(packed / 24)] = null; to = packed % 24; }
    else m.reserve[player]--;
    board[to] = player;
    if (inMill(board, to) && board.includes(other(player))) m.capture = true;
  }
  let next: GameState = { ...game, board, morris: m };
  if (m.capture) return next;
  next.currentPlayer = other(player);
  m.quiet = capturing || action < 24 ? 0 : m.quiet + 1;
  if (capturing) m.history = [];
  // A player may lose only after their own nine pieces have been placed.
  if (!m.reserve[next.currentPlayer] && (count(board, next.currentPlayer) < 3 || !morrisActions(next).length)) m.result = player;
  if (!m.reserve.X && !m.reserve.O) {
    m.history.push(morrisPosition(next));
    if (!m.result && (m.quiet >= 100 || m.history.filter((key) => key === morrisPosition(next)).length >= 3)) m.result = "draw";
  }
  if (m.result) {
    next = { ...next, gameOver: true, scores: { ...game.scores, [m.result]: game.scores[m.result] + 1 } };
  }
  return next;
}

export function restoreMorris(game: GameState, value: unknown): MorrisState | null {
  if (!value || typeof value !== "object") return null;
  const m = value as MorrisState;
  if (!m.reserve || !["X", "O"].every((p) => {
    const player = p as Player;
    return Number.isInteger(m.reserve[player]) && m.reserve[player] >= 0 && m.reserve[player] <= 9
      && count(game.board, player) + m.reserve[player] <= 9;
  }) || typeof m.capture !== "boolean" || !Number.isInteger(m.quiet) || m.quiet < 0 || m.quiet > 100
    || !Array.isArray(m.history) || m.history.length > 101
    || !m.history.every((key) => typeof key === "string" && /^[XO-]{24}[XO]00$/.test(key))
    || ![null, "X", "O", "draw"].includes(m.result)
    || game.gameOver !== (m.result !== null)
    || (m.capture && (game.gameOver || !game.board.includes(other(game.currentPlayer))
      || !MORRIS_MILLS.some((line) => line.every((i) => game.board[i] === game.currentPlayer))))) return null;
  const copy = { ...m, reserve: { ...m.reserve }, history: [...m.history] };
  const position = { ...game, morris: copy, gameOver: false };
  const lost = !m.reserve[game.currentPlayer]
    && (count(game.board, game.currentPlayer) < 3 || !morrisActions(position).length);
  const draw = m.quiet === 100 || m.history.filter((key) => key === morrisPosition(position)).length >= 3;
  if (m.result === "draw" ? !draw || lost : m.result ? m.result !== other(game.currentPlayer) || !lost
    : !m.capture && (lost || draw)) return null;
  if ((m.reserve.X || m.reserve.O) && (m.history.length || m.quiet)) return null;
  return copy;
}
