import { DEFAULT_HEX_SIZE, findHexPath, isHexSize, type HexSize } from "./hex.ts";
import { findWinningLine } from "./tic-tac-toe.ts";
import { boxEdges, boxesWinner, claimBoxes, DOTS_SIZES } from "./dots-and-boxes.ts";

export const gameKinds = ["tic-tac-toe", "hex", "dots-and-boxes"] as const;
export type GameKind = typeof gameKinds[number];
export type Player = "X" | "O";
export type Cell = Player | null;
export type GameState = {
  kind: GameKind;
  boardSize: number;
  board: Cell[];
  boxes?: Cell[];
  currentPlayer: Player;
  nextStarter: Player;
  gameOver: boolean;
  winningLine: number[] | null;
  scores: Record<Player | "draw", number>;
};

export function isGameKind(value: unknown): value is GameKind {
  return gameKinds.some((kind) => kind === value);
}

export function isBoardSize(kind: GameKind, size: number): boolean {
  return kind === "hex" ? isHexSize(size)
    : kind === "dots-and-boxes" ? DOTS_SIZES.some((allowed) => allowed === size) : size === 3;
}

function winnerPath(game: GameState, board: Cell[], player: Player): number[] | null {
  return game.kind === "hex" ? findHexPath(board, player, game.boardSize as HexSize) : findWinningLine(board);
}

export function createGameState(kind: GameKind = "tic-tac-toe", boardSize = kind === "hex" ? DEFAULT_HEX_SIZE : 3): GameState {
  if (!isGameKind(kind)) throw new TypeError("Unknown game");
  if (!isBoardSize(kind, boardSize)) throw new TypeError("Invalid board size");
  return {
    kind,
    boardSize,
    board: Array<Cell>(kind === "dots-and-boxes" ? 2 * boardSize * (boardSize + 1) : boardSize ** 2).fill(null),
    ...(kind === "dots-and-boxes" ? { boxes: Array<Cell>(boardSize ** 2).fill(null) } : {}),
    currentPlayer: "X",
    nextStarter: "O",
    gameOver: false,
    winningLine: null,
    scores: { X: 0, O: 0, draw: 0 },
  };
}

export function makeMove(game: GameState, index: number, player: Player): GameState {
  if (!Number.isInteger(index) || index < 0 || index >= game.board.length) return game;
  if (game.gameOver || game.board[index] || player !== game.currentPlayer) return game;

  const board = [...game.board];
  const scores = { ...game.scores };
  board[index] = player;
  if (game.kind === "dots-and-boxes") {
    const boxes = claimBoxes(board, game.boxes!, player, game.boardSize);
    const claimed = boxes.some((owner, index) => owner !== game.boxes![index]);
    const gameOver = boxes.every(Boolean);
    if (gameOver) scores[boxesWinner(boxes) || "draw"] += 1;
    return {
      ...game, board, boxes, scores, gameOver,
      currentPlayer: claimed ? player : player === "X" ? "O" : "X",
    };
  }
  const winningLine = winnerPath(game, board, player);
  const draw = game.kind !== "hex" && !winningLine && board.every(Boolean);

  if (winningLine) scores[player] += 1;
  else if (draw) scores.draw += 1;

  return {
    ...game, board, scores, winningLine,
    gameOver: Boolean(winningLine || draw),
    currentPlayer: winningLine || draw ? game.currentPlayer : game.currentPlayer === "X" ? "O" : "X",
  };
}

export function startRound(game: GameState): GameState {
  return {
    ...game,
    board: Array<Cell>(game.board.length).fill(null),
    ...(game.boxes ? { boxes: game.boxes.map(() => null) } : {}),
    currentPlayer: game.nextStarter,
    nextStarter: game.nextStarter === "X" ? "O" : "X",
    gameOver: false,
    winningLine: null,
  };
}

export function resetScore(game: GameState): GameState {
  return startRound({ ...game, scores: { X: 0, O: 0, draw: 0 }, nextStarter: "X" });
}

export function serializeGame(game: GameState): Omit<GameState, "winningLine"> {
  return {
    kind: game.kind, boardSize: game.boardSize, board: [...game.board], currentPlayer: game.currentPlayer,
    ...(game.boxes ? { boxes: [...game.boxes] } : {}),
    nextStarter: game.nextStarter, gameOver: game.gameOver, scores: { ...game.scores },
  };
}

export function restoreGame(state: unknown): GameState | null {
  if (!state || typeof state !== "object") return null;
  const candidate = state as Partial<GameState>;
  const kind = candidate.kind ?? "tic-tac-toe"; // Legacy invitations had no game kind.
  const boardSize = candidate.boardSize ?? (kind === "hex" ? DEFAULT_HEX_SIZE : 3);
  const validCell = (value: unknown): value is Cell => value === null || value === "X" || value === "O";
  const validScore = (value: unknown) => Number.isInteger(value) && (value as number) >= 0;
  if (!isGameKind(kind)
    || !isBoardSize(kind, boardSize)
    || !Array.isArray(candidate.board)
    || candidate.board.length !== (kind === "dots-and-boxes" ? 2 * boardSize * (boardSize + 1) : boardSize ** 2)
    || !candidate.board.every(validCell)
    || (candidate.currentPlayer !== "X" && candidate.currentPlayer !== "O")
    || (candidate.nextStarter !== "X" && candidate.nextStarter !== "O")
    || typeof candidate.gameOver !== "boolean"
    || !candidate.scores
    || !validScore(candidate.scores.X)
    || !validScore(candidate.scores.O)
    || !validScore(candidate.scores.draw)) return null;

  const board: Cell[] = [...candidate.board];
  if (kind === "dots-and-boxes" && (
    !Array.isArray(candidate.boxes) || candidate.boxes.length !== boardSize ** 2
    || !candidate.boxes.every(validCell)
    || candidate.boxes.some((owner, index) => Boolean(owner) !== boxEdges(index, boardSize).every((edge) => board[edge]))
    || candidate.gameOver !== candidate.boxes.every(Boolean)
  )) return null;
  return {
    kind, boardSize, board, currentPlayer: candidate.currentPlayer, nextStarter: candidate.nextStarter,
    ...(kind === "dots-and-boxes" ? { boxes: [...candidate.boxes!] } : {}),
    gameOver: candidate.gameOver,
    scores: { X: candidate.scores.X, O: candidate.scores.O, draw: candidate.scores.draw },
    winningLine: kind === "hex"
      ? findHexPath(board, "X", boardSize as HexSize) || findHexPath(board, "O", boardSize as HexSize)
      : kind === "dots-and-boxes" ? null : findWinningLine(board),
  };
}
