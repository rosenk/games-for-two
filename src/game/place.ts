import type { Cell, GameState, Player } from "./types.ts";

export function place(game: GameState, index: number, player: Player,
  path: (board: Cell[]) => number[] | null, draws = true): GameState {
  if (!Number.isInteger(index) || index < 0 || index >= game.board.length
    || game.gameOver || game.board[index] || player !== game.currentPlayer) return game;
  const board = [...game.board], scores = { ...game.scores };
  board[index] = player;
  const winningLine = path(board);
  const draw = draws && !winningLine && board.every(Boolean);
  if (winningLine) scores[player] += 1;
  else if (draw) scores.draw += 1;
  return { ...game, board, scores, winningLine, gameOver: Boolean(winningLine || draw),
    currentPlayer: winningLine || draw ? game.currentPlayer : player === "X" ? "O" : "X" };
}
