import assert from "node:assert/strict";
import test from "node:test";

import {
  createGameState,
  makeMove,
  resetScore,
  restoreGame,
  serializeGame,
  startRound,
} from "../src/game/game-state.js";

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
