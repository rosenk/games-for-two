import assert from "node:assert/strict";
import test from "node:test";

import {
  createGameState,
  makeMove,
  resetScore,
  restoreGame,
  serializeGame,
  startRound,
} from "../src/game/game-state.ts";
import { findHexPath } from "../src/game/hex.ts";

test("accepts only the current player's move in an empty cell", () => {
  const initial = createGameState();
  assert.equal(makeMove(initial, 4, "O"), initial);

  const afterX = makeMove(initial, 4, "X");
  assert.equal(afterX.board[4], "X");
  assert.equal(afterX.currentPlayer, "O");
  assert.equal(makeMove(afterX, 4, "O"), afterX);
});

test("detects a win and increments only the winner's score", () => {
  let game = createGameState();
  for (const [index, player] of [[0, "X"], [3, "O"], [1, "X"], [4, "O"], [2, "X"]]) {
    game = makeMove(game, index, player);
  }

  assert.deepEqual(game.winningLine, [0, 1, 2]);
  assert.equal(game.gameOver, true);
  assert.deepEqual(game.scores, { X: 1, O: 0, draw: 0 });
});

test("alternates round starters and score reset starts again with X", () => {
  const secondRound = startRound(createGameState());
  assert.equal(secondRound.currentPlayer, "O");
  assert.equal(secondRound.nextStarter, "X");

  const reset = resetScore({ ...secondRound, scores: { X: 3, O: 2, draw: 1 } });
  assert.equal(reset.currentPlayer, "X");
  assert.equal(reset.nextStarter, "O");
  assert.deepEqual(reset.scores, { X: 0, O: 0, draw: 0 });
});

test("restores valid network state and rejects malformed state", () => {
  const game = makeMove(createGameState(), 8, "X");
  assert.deepEqual(restoreGame(serializeGame(game)), game);
  assert.equal(restoreGame({ ...serializeGame(game), board: ["X"] }), null);
  assert.equal(restoreGame({ ...serializeGame(game), scores: { X: -1, O: 0, draw: 0 } }), null);
});

test("Hex connects top to bottom through slanted neighbors but not across a gap", () => {
  const board = Array(25).fill(null);
  for (const index of [4, 8, 12, 16, 20]) board[index] = "X";
  assert.deepEqual(findHexPath(board, "X"), [4, 8, 12, 16, 20]);
  board[12] = null;
  assert.equal(findHexPath(board, "X"), null);
  assert.equal(findHexPath(board, "O"), null);
});

test("Hex connects left to right, scores once, rejects occupied cells and resets the board", () => {
  let game = createGameState("hex");
  for (const [index, player] of [[5, "X"], [0, "O"], [10, "X"], [1, "O"],
    [15, "X"], [2, "O"], [20, "X"], [3, "O"], [21, "X"], [4, "O"]]) {
    game = makeMove(game, index, player);
  }
  assert.deepEqual(game.winningLine, [0, 1, 2, 3, 4]);
  assert.equal(game.gameOver, true);
  assert.deepEqual(game.scores, { X: 0, O: 1, draw: 0 });
  assert.equal(makeMove(game, 24, "O"), game);
  assert.deepEqual(restoreGame(serializeGame(game)), game);
  assert.equal(restoreGame({ ...serializeGame(game), board: Array(9).fill(null) }), null);
  assert.equal(restoreGame({ ...serializeGame(game), kind: "other" }), null);
  const next = startRound(game);
  assert.equal(next.board.length, 25);
  assert.equal(next.board.every((cell) => cell === null), true);
  assert.equal(next.currentPlayer, "O");
  assert.equal(next.scores.O, 1);
});

test("selected Hex size controls path geometry, move bounds and round length", () => {
  let game = createGameState("hex", 7);
  for (let row = 0; row < 6; row += 1) {
    game = makeMove(game, row * 7, "X");
    game = makeMove(game, row + 1, "O");
  }
  game = makeMove(game, 42, "X");
  assert.deepEqual(game.winningLine, [0, 7, 14, 21, 28, 35, 42]);
  assert.equal(game.scores.X, 1);
  assert.equal(makeMove(createGameState("hex", 7), 49, "X").board.length, 49);
  assert.equal(startRound(game).board.length, 49);
  assert.deepEqual(restoreGame(serializeGame(game)), game);
  assert.equal(restoreGame({ ...serializeGame(game), boardSize: 5 }), null);
  assert.throws(() => createGameState("hex", 6), /Invalid board size/);
  assert.throws(() => createGameState("tic-tac-toe", 7), /Invalid board size/);
});

test("11 × 11 Hex recognizes slanted paths without crossing a gap", () => {
  const board = Array(121).fill(null);
  const path = Array.from({ length: 11 }, (_, row) => row * 11 + 10 - row);
  for (const index of path) board[index] = "X";
  assert.deepEqual(findHexPath(board, "X", 11), path);
  board[path[5]] = null;
  assert.equal(findHexPath(board, "X", 11), null);
});
