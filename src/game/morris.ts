import type { Cell, GameState, Player } from "./game-state.ts";

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

function evaluate(game: GameState, player: Player): number {
  const features = (p: Player) => {
    const pieces = count(game.board, p);
    let score = (pieces + game.morris!.reserve[p]) * 120;
    for (const line of MORRIS_MILLS) {
      const own = line.filter((i) => game.board[i] === p).length;
      const empty = line.filter((i) => !game.board[i]).length;
      if (own === 3) score += 35;
      if (own === 2 && empty === 1) score += 55;
      if (own === 1 && empty === 2) score += 8;
    }
    game.board.forEach((c, i) => {
      if (c !== p) return;
      const mobility = MORRIS_NEIGHBORS[i].filter((n) => !game.board[n]).length;
      score += MORRIS_NEIGHBORS[i].length * 3 + mobility * 5;
      if (!mobility && pieces > 3 && !game.morris!.reserve[p]) score -= 25;
      // Intersections supporting two potential mills are especially valuable.
      const threats = MORRIS_MILLS.filter((line) => line.includes(i) && line.every((n) => game.board[n] !== other(p))
        && line.filter((n) => game.board[n] === p).length === 2).length;
      if (threats >= 2) score += 45;
    });
    return score;
  };
  return features(player) - features(other(player));
}

// Search complete turns: forming a mill and removing a piece is not an enemy reply.
export function morrisComputerMove(game: GameState): number | null {
  const deadline = performance.now() + 1800;
  const timeout = Symbol("timeout");
  const table = new Map<string, { depth: number; score: number; bound: "exact" | "lower" | "upper"; action: number }>();
  function turns(state: GameState) {
    const p = state.currentPlayer;
    return morrisActions(state).flatMap((action) => {
      const moved = playMorris(state, action, p);
      return moved.morris!.capture ? morrisActions(moved).map((capture) => ({ action, state: playMorris(moved, capture, p) }))
        : [{ action, state: moved }];
    });
  }
  function search(state: GameState, depth: number, alpha: number, beta: number): { score: number; action: number } {
    if (performance.now() >= deadline) throw timeout;
    const p = state.currentPlayer;
    if (state.gameOver) return { score: state.morris!.result === "draw" ? 0 : state.morris!.result === p ? 100000 + depth : -100000 - depth, action: -1 };
    if (!depth) return { score: evaluate(state, p), action: -1 };
    const key = morrisPosition(state) + state.morris!.capture + ":" + state.morris!.quiet + ":" + state.morris!.history.join(";");
    const cached = table.get(key);
    const originalAlpha = alpha, originalBeta = beta;
    if (cached && cached.depth >= depth) {
      if (cached.bound === "exact") return cached;
      if (cached.bound === "lower") alpha = Math.max(alpha, cached.score);
      else beta = Math.min(beta, cached.score);
      if (alpha >= beta) return cached;
    }
    const candidates = turns(state).map((turn) => ({ ...turn,
      order: turn.state.gameOver ? turn.state.morris!.result === p ? 100000 : 0 : evaluate(turn.state, p),
    })).sort((a, b) => (b.action === cached?.action ? 1000000 : b.order) - (a.action === cached?.action ? 1000000 : a.order));
    let score = -Infinity, action = candidates[0]?.action ?? -1;
    for (const turn of candidates) {
      const value = -search(turn.state, depth - 1, -beta, -alpha).score;
      if (value > score) { score = value; action = turn.action; }
      alpha = Math.max(alpha, score);
      if (alpha >= beta) break;
    }
    table.set(key, { depth, score, action, bound: score <= originalAlpha ? "upper" : score >= originalBeta ? "lower" : "exact" });
    return { score, action };
  }
  let action = morrisActions(game)[0] ?? null;
  if (action === null) return null;
  for (let depth = 1; depth <= 10; depth++) {
    try {
      const result = search(game, depth, -Infinity, Infinity);
      action = result.action;
      if (Math.abs(result.score) >= 100000) break;
    } catch (error) { if (error !== timeout) throw error; break; }
  }
  return action;
}
