import { DEFAULT_HEX_SIZE, findHexPath, isHexSize, type HexSize } from "./hex.ts";
import { findWinningLine } from "./tic-tac-toe.ts";
import { boxEdges, boxesWinner, claimBoxes, DOTS_SIZES } from "./dots-and-boxes.ts";
import { dealSymbolCards, makeSymbolMove, SYMBOL_CARDS, SYMBOL_TARGET } from "./common-symbol.ts";
import { createDotGame, playDotTurn, restoreDotGame, type DotGame } from "./circle-the-dot.ts";
import { createMorris, playMorris, restoreMorris, type MorrisState } from "./morris.ts";
import { CONNECT_COLUMNS, CONNECT_ROWS, connectLanding, connectWinningLine } from "./connect-four.ts";
import { createBattle, playBattle, restoreBattle, cloneBattle, type BattleState } from "./battleship.ts";

export const gameKinds = ["tic-tac-toe", "hex", "dots-and-boxes", "common-symbol", "circle-the-dot", "morris", "connect-four", "battleship"] as const;
export type GameKind = typeof gameKinds[number];
export type Player = "X" | "O";
export type Cell = Player | null;
export type GameState = {
  kind: GameKind;
  boardSize: number;
  board: Cell[];
  boxes?: Cell[];
  deck?: number[];
  started?: boolean;
  dotGame?: DotGame;
  morris?: MorrisState;
  battle?: BattleState;
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
  if (game.kind === "connect-four") return connectWinningLine(board);
  return game.kind === "hex" ? findHexPath(board, player, game.boardSize as HexSize) : findWinningLine(board);
}

export function createGameState(kind: GameKind = "tic-tac-toe", boardSize = kind === "hex" ? DEFAULT_HEX_SIZE : 3): GameState {
  if (!isGameKind(kind)) throw new TypeError("Unknown game");
  if (!isBoardSize(kind, boardSize)) throw new TypeError("Invalid board size");
  return {
    kind,
    boardSize,
    board: Array<Cell>(kind === "connect-four" ? CONNECT_COLUMNS * CONNECT_ROWS : kind === "morris" ? 24 : kind === "common-symbol" || kind === "circle-the-dot" ? 0 : kind === "dots-and-boxes" ? 2 * boardSize * (boardSize + 1) : boardSize ** 2).fill(null),
    ...(kind === "battleship" ? { battle: createBattle() } : {}),
    ...(kind === "morris" ? { morris: createMorris() } : {}),
    ...(kind === "circle-the-dot" ? { dotGame: createDotGame() } : {}),
    ...(kind === "dots-and-boxes" ? { boxes: Array<Cell>(boardSize ** 2).fill(null) } : {}),
    ...(kind === "common-symbol" ? { deck: dealSymbolCards(), started: false } : {}),
    currentPlayer: "X",
    nextStarter: "O",
    gameOver: false,
    winningLine: null,
    scores: { X: 0, O: 0, draw: 0 },
  };
}

export function makeMove(game: GameState, index: number, player: Player): GameState {
  if (game.kind === "battleship") return playBattle(game, index, player);
  if (game.kind === "morris") return playMorris(game, index, player);
  if (game.kind === "common-symbol") return makeSymbolMove(game, index, player);
  if (game.kind === "circle-the-dot") {
    if (game.gameOver || player !== game.currentPlayer) return game;
    const dotGame = playDotTurn(game.dotGame!, index, player === game.dotGame!.blocker);
    if (dotGame === game.dotGame) return game;
    const gameOver = dotGame.result !== "playing";
    const winner = dotGame.result === "trapped" ? dotGame.blocker : dotGame.blocker === "X" ? "O" : "X";
    return { ...game, dotGame, gameOver,
      currentPlayer: gameOver ? player : player === "X" ? "O" : "X",
      scores: gameOver ? { ...game.scores, [winner]: game.scores[winner] + 1 } : game.scores };
  }
  if (game.kind === "connect-four") {
    const landing = connectLanding(game.board, index);
    if (landing === null) return game;
    index = landing;
  }
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
    board: Array<Cell>(game.kind === "common-symbol" ? 0 : game.board.length).fill(null),
    ...(game.boxes ? { boxes: game.boxes.map(() => null) } : {}),
    ...(game.kind === "common-symbol" ? { deck: dealSymbolCards(), started: false } : {}),
    ...(game.kind === "morris" ? { morris: createMorris() } : {}),
    ...(game.kind === "battleship" ? { battle: createBattle(game.nextStarter) } : {}),
    ...(game.kind === "circle-the-dot" ? { dotGame: { ...createDotGame(), blocker: game.dotGame!.blocker } } : {}),
    currentPlayer: game.kind === "circle-the-dot" ? game.dotGame!.blocker : game.nextStarter,
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
    ...(game.deck ? { deck: [...game.deck] } : {}),
    ...(game.kind === "common-symbol" ? { started: game.started } : {}),
    ...(game.morris ? { morris: { ...game.morris, reserve: { ...game.morris.reserve }, history: [...game.morris.history] } } : {}),
    ...(game.battle ? { battle: cloneBattle(game.battle) } : {}),
    ...(game.dotGame ? { dotGame: { ...game.dotGame, blocked: [...game.dotGame.blocked] } } : {}),
    nextStarter: game.nextStarter, gameOver: game.gameOver, scores: { ...game.scores },
  };
}

export function restoreGame(state: unknown, viewer?: Player): GameState | null {
  if (!state || typeof state !== "object") return null;
  const candidate = state as Partial<GameState>;
  const kind = candidate.kind ?? "tic-tac-toe"; // Legacy invitations had no game kind.
  const boardSize = candidate.boardSize ?? (kind === "hex" ? DEFAULT_HEX_SIZE : 3);
  const validCell = (value: unknown): value is Cell => value === null || value === "X" || value === "O";
  const validScore = (value: unknown) => Number.isInteger(value) && (value as number) >= 0;
  if (!isGameKind(kind)
    || !isBoardSize(kind, boardSize)
    || !Array.isArray(candidate.board)
    || (kind !== "common-symbol" && candidate.board.length !== (kind === "connect-four" ? CONNECT_COLUMNS * CONNECT_ROWS : kind === "morris" ? 24 : kind === "circle-the-dot" ? 0 : kind === "dots-and-boxes" ? 2 * boardSize * (boardSize + 1) : boardSize ** 2))
    || !candidate.board.every(validCell)
    || (candidate.currentPlayer !== "X" && candidate.currentPlayer !== "O")
    || (candidate.nextStarter !== "X" && candidate.nextStarter !== "O")
    || typeof candidate.gameOver !== "boolean"
    || !candidate.scores
    || !validScore(candidate.scores.X)
    || !validScore(candidate.scores.O)
    || !validScore(candidate.scores.draw)) return null;

  const board: Cell[] = [...candidate.board];
  const battle = kind === "battleship" ? restoreBattle(candidate.battle, candidate as GameState, viewer) : null;
  if (kind === "battleship" && (!battle || board.some(Boolean))) return null;
  if (kind === "connect-four") {
    const line = connectWinningLine(board);
    if (board.some((cell, index) => cell && index < board.length - CONNECT_COLUMNS && !board[index + CONNECT_COLUMNS])
      || candidate.gameOver !== Boolean(line || board.every(Boolean))
      || (line && board[line[0]] !== candidate.currentPlayer)) return null;
  }
  const morris = kind === "morris" ? restoreMorris(candidate as GameState, candidate.morris) : null;
  if (kind === "morris" && !morris) return null;
  const dotGame = kind === "circle-the-dot" ? restoreDotGame(candidate.dotGame) : null;
  if (kind === "circle-the-dot" && (!dotGame || candidate.gameOver !== (dotGame.result !== "playing")
    || (dotGame.result === "trapped" && candidate.currentPlayer !== dotGame.blocker)
    || (dotGame.result === "escaped" && candidate.currentPlayer === dotGame.blocker))) return null;
  if (kind === "common-symbol" && (
    !Array.isArray(candidate.deck) || candidate.deck.length !== 2
    || new Set(candidate.deck).size !== 2
    || !candidate.deck.every((card) => Number.isInteger(card) && card >= 0 && card < SYMBOL_CARDS.length)
    || board.includes(null)
    || typeof candidate.started !== "boolean"
    || (!candidate.started && board.length > 0)
    || ["X", "O"].some((player) => board.slice(0, -1).filter((owner) => owner === player).length >= SYMBOL_TARGET)
    || candidate.gameOver !== ["X", "O"].some((player) => board.filter((owner) => owner === player).length === SYMBOL_TARGET)
  )) return null;
  if (kind === "dots-and-boxes" && (
    !Array.isArray(candidate.boxes) || candidate.boxes.length !== boardSize ** 2
    || !candidate.boxes.every(validCell)
    || candidate.boxes.some((owner, index) => Boolean(owner) !== boxEdges(index, boardSize).every((edge) => board[edge]))
    || candidate.gameOver !== candidate.boxes.every(Boolean)
  )) return null;
  return {
    kind, boardSize, board, currentPlayer: candidate.currentPlayer, nextStarter: candidate.nextStarter,
    ...(kind === "dots-and-boxes" ? { boxes: [...candidate.boxes!] } : {}),
    ...(kind === "common-symbol" ? { deck: [...candidate.deck!], started: candidate.started } : {}),
    ...(dotGame ? { dotGame } : {}),
    ...(morris ? { morris } : {}),
    ...(battle ? { battle } : {}),
    gameOver: candidate.gameOver,
    scores: { X: candidate.scores.X, O: candidate.scores.O, draw: candidate.scores.draw },
    winningLine: kind === "hex"
      ? findHexPath(board, "X", boardSize as HexSize) || findHexPath(board, "O", boardSize as HexSize)
      : kind === "connect-four" ? connectWinningLine(board)
      : kind === "battleship" || kind === "morris" || kind === "dots-and-boxes" || kind === "common-symbol" || kind === "circle-the-dot" ? null : findWinningLine(board),
  };
}
