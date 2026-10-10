import { registerGame } from "../registry.ts";
import { place } from "../place.ts";
import { CONNECT_COLUMNS, CONNECT_ROWS, connectLanding, connectWinningLine } from "./rules.ts";
export const definition = registerGame({
  kind: "connect-four", defaultSize: 3, boardLength: () => CONNECT_COLUMNS * CONNECT_ROWS,
  play: (game, index, player) => {
    const landing = connectLanding(game.board, index);
    return landing === null ? game : place(game, landing, player, connectWinningLine);
  },
  restore: (game) => {
    const line = connectWinningLine(game.board);
    if (game.board.some((cell, index) => cell && index < game.board.length - CONNECT_COLUMNS && !game.board[index + CONNECT_COLUMNS])
      || game.gameOver !== Boolean(line || game.board.every(Boolean))
      || (line && game.board[line[0]] !== game.currentPlayer)) return null;
    return { ...game, winningLine: line };
  },
});
