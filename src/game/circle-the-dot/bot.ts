import type { DotGame } from "./rules.ts";
import { dotNeighbors, escapeDistances, onEdge } from "./rules.ts";
import { registerComputer } from "../registry.ts";

registerComputer("circle-the-dot", (game) => dotComputerMove(game.dotGame!, game.currentPlayer === game.dotGame!.blocker));

export function dotComputerMove(game: DotGame, blocking: boolean): number {
  const distances = escapeDistances(game.blocked);
  if (!blocking) {
    let best: number[] = [];
    let bestScore = Infinity;
    for (const next of dotNeighbors(game.dot).filter((cell) => !game.blocked[cell])) {
      if (onEdge(next)) return next;
      // Look ahead to the human's strongest block, avoiding a short but fragile
      // corridor when a slightly longer route remains open after one block.
      let worst = 0;
      game.blocked.forEach((occupied, index) => {
        if (occupied || index === next) return;
        const blocked = [...game.blocked];
        blocked[index] = true;
        worst = Math.max(worst, escapeDistances(blocked)[next]);
      });
      const exits = dotNeighbors(next).filter((cell) => !game.blocked[cell]).length;
      const score = Math.min(worst, 1000) * 1000 + Math.min(distances[next], 1000) * 10 - exits;
      if (score < bestScore) { bestScore = score; best = [next]; }
      else if (score === bestScore) best.push(next);
    }
    return best[Math.floor(Math.random() * best.length)];
  }
  // Prefer cutting escape routes: maximize distance, then minimize equally short exits.
  let best: number[] = [];
  let bestScore = -Infinity;
  const candidates: { index: number; score: number; blocked: boolean[] }[] = [];
  game.blocked.forEach((occupied, index) => {
    if (occupied || index === game.dot) return;
    const blocked = [...game.blocked];
    blocked[index] = true;
    const next = escapeDistances(blocked);
    const exits = dotNeighbors(game.dot).filter((cell) => !blocked[cell]
      && next[cell] === next[game.dot] - 1).length;
    const score = next[game.dot] * 100 - exits;
    candidates.push({ index, score, blocked });
    if (score > bestScore) { bestScore = score; best = [index]; }
    else if (score === bestScore) best.push(index);
  });
  if (bestScore === Infinity) return best[Math.floor(Math.random() * best.length)];
  // Block → strongest escape reply → next block. Distance maps for a second
  // block serve every possible runner reply, rather than repeating each BFS.
  const deadline = performance.now() + 1000;
  let planned: number[] = [];
  let plannedScore = -Infinity;
  for (const candidate of candidates.sort((a, b) => b.score - a.score).slice(0, 8)) {
    const replies = dotNeighbors(game.dot).filter((cell) => !candidate.blocked[cell]);
    if (replies.some(onEdge)) continue;
    const threats = replies.map(() => -Infinity);
    candidate.blocked.forEach((occupied, index) => {
      if (occupied) return;
      const blocked = [...candidate.blocked];
      blocked[index] = true;
      const next = escapeDistances(blocked);
      replies.forEach((reply, i) => {
        if (reply !== index) threats[i] = Math.max(threats[i], Math.min(next[reply], 1000));
      });
    });
    if (performance.now() > deadline) return best[Math.floor(Math.random() * best.length)];
    const score = Math.min(...threats) * 1000 + candidate.score;
    if (score > plannedScore) { plannedScore = score; planned = [candidate.index]; }
    else if (score === plannedScore) planned.push(candidate.index);
  }
  if (planned.length) best = planned;
  return best[Math.floor(Math.random() * best.length)];
}
