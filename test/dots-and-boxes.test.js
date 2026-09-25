import assert from "node:assert/strict";
import test from "node:test";
import { createGameState, makeMove, resetScore, restoreGame, serializeGame, startRound } from "../src/game/game-state.ts";
import { boxesWinner, boxScore } from "../src/game/dots-and-boxes.ts";

test("closing two adjacent boxes awards both and retains the turn without mutating the old state", () => {
  let game = createGameState("dots-and-boxes");
  assert.equal(game.board.length, 24);
  for (const index of [0, 1, 3, 4, 12, 14]) game = makeMove(game, index, game.currentPlayer);
  assert.equal(game.currentPlayer, "X");
  assert.deepEqual(game.boxes, Array(9).fill(null));
  for (const index of [-1, 24, 1.5, 0]) assert.equal(makeMove(game, index, "X"), game);
  assert.equal(makeMove(game, 13, "O"), game);
  const closed = makeMove(game, 13, "X");
  assert.equal(closed.currentPlayer, "X");
  assert.deepEqual(closed.boxes, ["X", "X", null, null, null, null, null, null, null]);
  assert.equal(boxScore(closed.boxes, "X"), 2);
  assert.equal(closed.gameOver, false);
  assert.deepEqual(closed.scores, { X: 0, O: 0, draw: 0 });
  assert.equal(game.board[13], null);
  assert.equal(game.boxes[0], null);
  assert.equal(makeMove(closed, 2, "X").currentPlayer, "O");
  assert.deepEqual(restoreGame(serializeGame(closed)), closed);
});

test("a complete round counts boxes, scores once and resets ownership but preserves round wins", () => {
  let game = createGameState("dots-and-boxes");
  for (let edge = 0; edge < 24; edge++) {
    game = makeMove(game, edge, game.currentPlayer);
    assert.deepEqual(restoreGame(serializeGame(game)), game);
  }
  assert.equal(game.gameOver, true);
  assert.deepEqual(game.boxes, ["O", "O", "O", "X", "X", "X", "O", "O", "O"]);
  assert.equal(boxesWinner(game.boxes), "O");
  assert.deepEqual(game.scores, { X: 0, O: 1, draw: 0 });
  assert.equal(makeMove(game, 23, "O"), game);
  const next = startRound(game);
  assert.deepEqual(next.boxes, Array(9).fill(null));
  assert.deepEqual(next.board, Array(24).fill(null));
  assert.equal(next.currentPlayer, "O");
  assert.equal(next.scores.O, 1);
  assert.deepEqual(resetScore(game).scores, { X: 0, O: 0, draw: 0 });
});

test("the last edge does not decide the winner: five boxes beat four", () => {
  const game = createGameState("dots-and-boxes");
  game.board.fill("X");
  game.board[23] = null;
  game.boxes = ["X", "X", "X", "X", "X", "O", "O", "O", null];
  game.currentPlayer = "O";
  const finished = makeMove(game, 23, "O");
  assert.equal(finished.boxes[8], "O");
  assert.equal(boxesWinner(finished.boxes), "X");
  assert.deepEqual(finished.scores, { X: 1, O: 0, draw: 0 });
});

test("restoration rejects missing, malformed or geometrically inconsistent ownership", () => {
  const state = serializeGame(createGameState("dots-and-boxes"));
  for (const boxes of [undefined, [], Array(9).fill("bad"), ["X", ...Array(8).fill(null)]]) {
    assert.equal(restoreGame({ ...state, boxes }), null);
  }
  assert.equal(restoreGame({ ...state, gameOver: true }), null);
  assert.equal(restoreGame({ ...state, board: Array(9).fill(null) }), null);
  for (const edge of [0, 3, 12, 13]) state.board[edge] = "X";
  assert.equal(restoreGame(state), null);
  state.boxes[0] = "X";
  assert.notEqual(restoreGame(state), null);
  for (const size of [2, 7, 3.5]) assert.throws(() => createGameState("dots-and-boxes", size), /Invalid board size/);
});

for (const [size, edges, boxes] of [[4, 40, 16], [5, 60, 25], [6, 84, 36]]) {
  test(`size ${size} preserves geometry, ownership and dimensions through restore and reset`, () => {
    let game = createGameState("dots-and-boxes", size);
    assert.equal(game.board.length, edges);
    assert.equal(game.boxes.length, boxes);
    // Bottom-right box: top, bottom, left, right (independent coordinates).
    const corners = size === 4 ? [15, 19, 38, 39] : size === 5 ? [24, 29, 58, 59] : [35, 41, 82, 83];
    for (const edge of corners) game = makeMove(game, edge, game.currentPlayer);
    assert.equal(game.boxes[boxes - 1], "O");
    assert.equal(boxScore(game.boxes, "O"), 1);
    assert.equal(game.currentPlayer, "O");
    assert.equal(makeMove(game, edges, "O"), game);
    assert.deepEqual(restoreGame(serializeGame(game)), game);
    assert.equal(restoreGame({ ...serializeGame(game), boardSize: 3 }), null);
    const next = startRound(game);
    assert.deepEqual(next.board, Array(edges).fill(null));
    assert.deepEqual(next.boxes, Array(boxes).fill(null));
    assert.equal(resetScore(game).boardSize, size);
  });
}

test("an even-sized board can finish in a draw", () => {
  let game = createGameState("dots-and-boxes", 4);
  for (let edge = 0; edge < 40; edge++) game = makeMove(game, edge, game.currentPlayer);
  assert.equal(game.gameOver, true);
  assert.equal(boxScore(game.boxes, "X"), 8);
  assert.equal(boxScore(game.boxes, "O"), 8);
  assert.equal(boxesWinner(game.boxes), null);
  assert.deepEqual(game.scores, { X: 0, O: 0, draw: 1 });
  assert.deepEqual(restoreGame(serializeGame(game)), game);
});
