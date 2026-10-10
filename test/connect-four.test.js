import assert from "node:assert/strict";
import test from "node:test";
import { createGameState, makeMove, restoreGame, serializeGame, startRound, resetScore } from "../src/game/game-state.ts";
import { chooseComputerMove } from "../src/game/computer.ts";
import { createMatchUrl, parseMatchRoute } from "../src/online/match-url.js";

function play(columns) {
  let game = createGameState("connect-four");
  for (const column of columns) game = makeMove(game, column, game.currentPlayer);
  return game;
}

test("columns obey gravity, reject full columns and invalid turns", () => {
  const initial = createGameState("connect-four");
  assert.equal(initial.board.length, 42);
  for (const column of [-1, 7, 35, 1.5, NaN]) assert.equal(makeMove(initial, column, "X"), initial);
  assert.equal(makeMove(initial, 2, "O"), initial);
  const game = play([2, 2, 2, 2, 2, 2]);
  assert.deepEqual([2, 9, 16, 23, 30, 37].map((i) => game.board[i]), ["O", "X", "O", "X", "O", "X"]);
  assert.equal(makeMove(game, 2, game.currentPlayer), game);
  assert.equal(makeMove(game, 4, game.currentPlayer).board[39], "X");
});

for (const [name, moves, line] of [
  ["horizontal", [0, 6, 1, 6, 2, 5, 3], [35, 36, 37, 38]],
  ["vertical", [2, 4, 2, 4, 2, 5, 2], [16, 23, 30, 37]],
  ["diagonal up", [0, 1, 1, 2, 4, 2, 2, 3, 4, 3, 5, 3, 3], [17, 23, 29, 35]],
  ["diagonal down", [6, 5, 5, 4, 2, 4, 4, 3, 2, 3, 1, 3, 3], [17, 25, 33, 41]],
]) test(`wins ${name}, preserves score and restores the winning line`, () => {
  const game = play(moves);
  assert.equal(game.gameOver, true);
  assert.deepEqual(game.winningLine, line);
  assert.deepEqual(game.scores, { X: 1, O: 0, draw: 0 });
  assert.equal(makeMove(game, 0, game.currentPlayer), game);
  assert.deepEqual(restoreGame(serializeGame(game)), game);
  const next = startRound(game);
  assert.equal(next.currentPlayer, "O");
  assert.ok(next.board.every((cell) => cell === null));
  assert.equal(next.scores.X, 1);
  assert.deepEqual(resetScore(game).scores, { X: 0, O: 0, draw: 0 });
});

test("restoration rejects floating pieces, wrong geometry and false results", () => {
  const state = serializeGame(play([0, 3]));
  assert.ok(restoreGame(state));
  const floating = { ...state, board: [...state.board] };
  floating.board[0] = "X";
  assert.equal(restoreGame(floating), null);
  assert.equal(restoreGame({ ...state, board: state.board.slice(0, 9) }), null);
  assert.equal(restoreGame({ ...state, gameOver: true }), null);
});

test("computer wins before defending, blocks a forced loss and never mutates the game", () => {
  for (const [moves, expected] of [
    [[0, 6, 1, 6, 2, 6], 3],
    [[6, 0, 6, 1, 5, 2], 3],
    [[0, 2, 0, 2, 4, 2], 2],
  ]) {
    const game = play(moves);
    const snapshot = structuredClone(game);
    assert.equal(chooseComputerMove(game), expected);
    assert.deepEqual(game, snapshot);
  }
  assert.equal(chooseComputerMove(play([0, 6, 1, 6, 2, 5, 3])), null);
});

test("invitations keep the Connect Four identity", () => {
  const room = `ttt-${"1".repeat(32)}${"2".repeat(32)}`;
  const url = createMatchUrl("https://example.com/", room, "connect-four");
  assert.deepEqual(parseMatchRoute(new URL(url).search), { roomId: room, game: "connect-four", boardSize: 3, valid: true });
});

test("a full board without four in a row is a draw, not a wrapped horizontal win", () => {
  const game = play([2,6,3,1,4,2,4,5,5,4,1,4,5,5,4,1,6,3,4,2,2,2,6,1,5,0,5,6,0,1,3,2,0,0,3,3,0,3,1,0,6,6]);
  assert.ok(game.board.every(Boolean));
  assert.equal(game.gameOver, true);
  assert.equal(game.winningLine, null);
  assert.deepEqual(game.scores, { X: 0, O: 0, draw: 1 });
  assert.deepEqual(restoreGame(serializeGame(game)), game);
  assert.equal(chooseComputerMove(game), null);
});
