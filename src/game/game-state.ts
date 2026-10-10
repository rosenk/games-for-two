import { DEFAULT_GAME_KIND, findGame, getGame } from "./catalog.ts";
import type { Cell, GameKind, GameState, Player } from "./types.ts";
export type { Cell, GameKind, GameState, Player } from "./types.ts";
export { gameKinds } from "./catalog.ts";

export function isGameKind(value: unknown): value is GameKind { return !!findGame(value); }
export function defaultBoardSize(kind: GameKind = DEFAULT_GAME_KIND): number { return findGame(kind)?.defaultSize ?? 3; }
export function isBoardSize(kind: GameKind, size: number): boolean { return findGame(kind)?.sizes.includes(size) ?? false; }

export function isSizeParameter(kind: GameKind, value: string | null): boolean {
  const definition = findGame(kind);
  if (!definition) return false;
  return value === null || (definition.allowSizeParameter && isBoardSize(kind, Number(value)) && value === String(Number(value)));
}

export function createGameState(kind: GameKind = DEFAULT_GAME_KIND, boardSize = defaultBoardSize(kind)): GameState {
  const definition = getGame(kind);
  if (!isBoardSize(kind, boardSize)) throw new TypeError("Invalid board size");
  return { kind, boardSize, board: Array<Cell>(definition.boardLength(boardSize) ?? 0).fill(null),
    currentPlayer: "X", nextStarter: "O", gameOver: false, winningLine: null,
    scores: { X: 0, O: 0, draw: 0 }, ...definition.create(boardSize) };
}
export function makeMove(game: GameState, index: number, player: Player): GameState {
  return getGame(game.kind).play(game, index, player);
}
export function startRound(game: GameState): GameState {
  return { ...game, currentPlayer: game.nextStarter, nextStarter: game.nextStarter === "X" ? "O" : "X",
    gameOver: false, winningLine: null, ...getGame(game.kind).reset(game) };
}
export function resetScore(game: GameState): GameState {
  return startRound({ ...game, scores: { X: 0, O: 0, draw: 0 }, nextStarter: "X" });
}
export function serializeGame(game: GameState): Omit<GameState, "winningLine"> {
  return { kind: game.kind, boardSize: game.boardSize, board: [...game.board], currentPlayer: game.currentPlayer,
    nextStarter: game.nextStarter, gameOver: game.gameOver, scores: { ...game.scores }, ...getGame(game.kind).serialize(game) };
}
export function validCell(value: unknown): value is Cell { return value === null || value === "X" || value === "O"; }
export function restoreGame(state: unknown, viewer?: Player): GameState | null {
  if (!state || typeof state !== "object") return null;
  const candidate = state as Partial<GameState>;
  const kind = candidate.kind ?? DEFAULT_GAME_KIND;
  const definition = findGame(kind);
  const boardSize = candidate.boardSize ?? defaultBoardSize(kind);
  const score = (value: unknown) => Number.isInteger(value) && (value as number) >= 0;
  if (!definition || !isBoardSize(kind, boardSize) || !Array.isArray(candidate.board)
    || (definition.boardLength(boardSize) !== null && candidate.board.length !== definition.boardLength(boardSize))
    || !candidate.board.every(validCell) || (candidate.currentPlayer !== "X" && candidate.currentPlayer !== "O")
    || (candidate.nextStarter !== "X" && candidate.nextStarter !== "O") || typeof candidate.gameOver !== "boolean"
    || !candidate.scores || !score(candidate.scores.X) || !score(candidate.scores.O) || !score(candidate.scores.draw)) return null;
  const restored = definition.restore({ ...candidate, kind, boardSize, board: [...candidate.board],
    currentPlayer: candidate.currentPlayer, nextStarter: candidate.nextStarter, gameOver: candidate.gameOver,
    scores: { X: candidate.scores.X, O: candidate.scores.O, draw: candidate.scores.draw }, winningLine: null }, viewer);
  return restored ? { ...serializeGame(restored), winningLine: restored.winningLine } : null;
}
