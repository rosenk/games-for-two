import type { Cell, GameState, Player } from "../game-state.ts";
import { findWinningLine } from "./rules.ts";
import { registerComputer, getGame } from "../registry.ts";

registerComputer("tic-tac-toe", (game) => {
  const index = ticComputerMove(game);
  return getGame(game.kind).play(game, index, game.currentPlayer) === game ? null : index;
});

const other = (player: Player): Player => player === "X" ? "O" : "X";
const emptyCells = (board: Cell[]) => board.flatMap((cell, index) => cell ? [] : [index]);

function ticScore(board: Cell[], player: Player): number {
  const line = findWinningLine(board);
  if (line) return board[line[0]] === player ? 10 + emptyCells(board).length : -10 - emptyCells(board).length;
  const moves = emptyCells(board);
  if (!moves.length) return 0;
  return Math.max(...moves.map((index) => {
    board[index] = player;
    const score = -ticScore(board, other(player));
    board[index] = null;
    return score;
  }));
}

export function ticComputerMove(game: GameState): number {
  const board = [...game.board];
  let best = -Infinity;
  let move = -1;
  // Center and corners break equally optimal ties, not the minimax result.
  for (const index of [4, 0, 2, 6, 8, 1, 3, 5, 7].filter((i) => !board[i])) {
    board[index] = game.currentPlayer;
    const score = -ticScore(board, other(game.currentPlayer));
    board[index] = null;
    if (score > best) { best = score; move = index; }
  }
  return move;
}
