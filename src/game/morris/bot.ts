import type { Cell, GameState, Player } from "../game-state.ts";
import { MORRIS_MILLS, MORRIS_NEIGHBORS, morrisActions, morrisPosition, playMorris } from "./rules.ts";
import { registerComputer } from "../registry.ts";

registerComputer("morris", morrisComputerMove);

const other = (p: Player): Player => p === "X" ? "O" : "X";
const count = (board: Cell[], p: Player) => board.filter((cell) => cell === p).length;

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
