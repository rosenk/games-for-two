export const DOT_SIZE = 11;
export type DotGame = {
  blocked: boolean[];
  dot: number;
  moves: number;
  result: "playing" | "trapped" | "escaped";
  blocker: "X" | "O";
};

// Odd rows are offset half a circle to the right: six hexagonal neighbors.
export function dotNeighbors(index: number): number[] {
  const row = Math.floor(index / DOT_SIZE);
  const col = index % DOT_SIZE;
  const diagonal = row % 2 ? 1 : -1;
  return [[row, col - 1], [row, col + 1], [row - 1, col],
    [row - 1, col + diagonal], [row + 1, col], [row + 1, col + diagonal]]
    .filter(([r, c]) => r >= 0 && r < DOT_SIZE && c >= 0 && c < DOT_SIZE)
    .map(([r, c]) => r * DOT_SIZE + c);
}

function onEdge(index: number): boolean {
  const row = Math.floor(index / DOT_SIZE);
  const col = index % DOT_SIZE;
  return row === 0 || row === DOT_SIZE - 1 || col === 0 || col === DOT_SIZE - 1;
}

// Multi-source BFS gives the distance from every open circle to the boundary.
export function escapeDistances(blocked: boolean[]): number[] {
  const distances = blocked.map(() => Infinity);
  const queue: number[] = [];
  blocked.forEach((occupied, index) => {
    if (!occupied && onEdge(index)) {
      distances[index] = 0;
      queue.push(index);
    }
  });
  for (let head = 0; head < queue.length; head++) {
    const index = queue[head];
    for (const next of dotNeighbors(index)) {
      if (!blocked[next] && distances[next] === Infinity) {
        distances[next] = distances[index] + 1;
        queue.push(next);
      }
    }
  }
  return distances;
}

export function createDotGame(): DotGame {
  const dot = Math.floor(DOT_SIZE ** 2 / 2);
  const blocked = Array<boolean>(DOT_SIZE ** 2).fill(false);
  // Leave the center and its neighbors open, so a round never starts trapped.
  const protectedCells = new Set([dot, ...dotNeighbors(dot)]);
  const candidates = blocked.map((_, i) => i).filter((i) => !protectedCells.has(i));
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  for (const index of candidates) {
    if (blocked.filter(Boolean).length === 18) break;
    blocked[index] = true;
    if (escapeDistances(blocked)[dot] === Infinity) blocked[index] = false;
  }
  return { blocked, dot, moves: 0, result: "playing", blocker: "X" };
}

export function playDotTurn(game: DotGame, index: number, blocking: boolean): DotGame {
  if (game.result !== "playing" || !Number.isInteger(index) || index < 0
    || index >= game.blocked.length || game.blocked[index] || index === game.dot) return game;
  if (!blocking) {
    if (!dotNeighbors(game.dot).includes(index)) return game;
    return { ...game, dot: index, result: onEdge(index) ? "escaped" : "playing" };
  }
  const blocked = [...game.blocked];
  blocked[index] = true;
  const moves = game.moves + 1;
  const distances = escapeDistances(blocked);
  return { ...game, blocked, moves, result: distances[game.dot] === Infinity ? "trapped" : "playing" };
}

export function dotComputerMove(game: DotGame, blocking: boolean): number {
  const distances = escapeDistances(game.blocked);
  if (!blocking) {
    const best = dotNeighbors(game.dot).filter((next) => !game.blocked[next]
      && distances[next] === distances[game.dot] - 1);
    return best[Math.floor(Math.random() * best.length)];
  }
  // Prefer cutting escape routes: maximize distance, then minimize equally short exits.
  let best: number[] = [];
  let bestScore = -Infinity;
  game.blocked.forEach((occupied, index) => {
    if (occupied || index === game.dot) return;
    const blocked = [...game.blocked];
    blocked[index] = true;
    const next = escapeDistances(blocked);
    const exits = dotNeighbors(game.dot).filter((cell) => !blocked[cell]
      && next[cell] === next[game.dot] - 1).length;
    const score = next[game.dot] * 100 - exits;
    if (score > bestScore) { bestScore = score; best = [index]; }
    else if (score === bestScore) best.push(index);
  });
  return best[Math.floor(Math.random() * best.length)];
}

export function restoreDotGame(value: unknown): DotGame | null {
  if (!value || typeof value !== "object") return null;
  const dot = value as DotGame;
  if (!Array.isArray(dot.blocked) || dot.blocked.length !== DOT_SIZE ** 2
    || !dot.blocked.every((cell) => typeof cell === "boolean")
    || !Number.isInteger(dot.dot) || dot.dot < 0 || dot.dot >= DOT_SIZE ** 2 || dot.blocked[dot.dot]
    || !Number.isInteger(dot.moves) || dot.moves < 0 || dot.moves > DOT_SIZE ** 2 - 19
    || dot.blocked.filter(Boolean).length !== 18 + dot.moves
    || (dot.blocker !== "X" && dot.blocker !== "O")) return null;
  const result = onEdge(dot.dot) ? "escaped"
    : escapeDistances(dot.blocked)[dot.dot] === Infinity ? "trapped" : "playing";
  return dot.result === result ? { ...dot, blocked: [...dot.blocked] } : null;
}
