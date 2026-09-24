import type { Cell, Player } from "./game-state.ts";

export const HEX_SIZES = [5, 7, 9, 11] as const;
export const DEFAULT_HEX_SIZE = 5;
export type HexSize = typeof HEX_SIZES[number];

export function isHexSize(value: unknown): value is HexSize {
  return HEX_SIZES.some((size) => size === value);
}

function neighbors(index: number, size: number): number[] {
  const row = Math.floor(index / size);
  const col = index % size;
  return [[row - 1, col], [row - 1, col + 1], [row, col - 1],
    [row, col + 1], [row + 1, col - 1], [row + 1, col]]
    .filter(([r, c]) => r >= 0 && r < size && c >= 0 && c < size)
    .map(([r, c]) => r * size + c);
}

// X connects top to bottom; O connects left to right. The path highlights the win.
export function findHexPath(board: Cell[], player: Player, size: HexSize = DEFAULT_HEX_SIZE): number[] | null {
  const starts = Array.from({ length: size }, (_, n) => player === "X" ? n : n * size);
  const visited = new Set<number>();
  const queue = starts.filter((index) => board[index] === player).map((index) => [index]);
  for (const path of queue) visited.add(path[0]);
  for (let head = 0; head < queue.length; head += 1) {
    const path = queue[head];
    const index = path.at(-1)!;
    if (player === "X" ? index >= size * (size - 1) : index % size === size - 1) {
      return path;
    }
    for (const neighbor of neighbors(index, size)) {
      if (board[neighbor] !== player || visited.has(neighbor)) continue;
      visited.add(neighbor);
      queue.push([...path, neighbor]);
    }
  }
  return null;
}
